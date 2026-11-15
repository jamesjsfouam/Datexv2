import { useState } from 'react'
import { DIRECTION_ARROW, type Forecast, type TrendResponse } from './api'
import { ExplainPanel } from './Explain'
import {
  certaintyInfo,
  fmtNum,
  fmtProb,
  formatForecastText,
  humanVerdictSummary,
  translateWarning,
  tUnit,
  UI,
  verdictLabel,
  type Lang,
} from './i18n'
import { TrendChart } from './TrendChart'
import { Card, Disclosure, Kpi, Shard } from './ui'

export function TrendView({
  data,
  where,
  varLabel,
  reliability,
  scenario,
  onScenario,
  start,
  lang,
}: {
  data: TrendResponse
  where: string
  varLabel: string
  reliability: string
  scenario: Forecast | null
  onScenario: (y: number) => void
  start: number
  lang: Lang
}) {
  const t = data.result
  const unit = tUnit(t.unit, lang)
  const kpi = UI[lang].phase3.kpi
  const scCopy = UI[lang].phase3.scenario
  const rig = UI[lang].phase3.rigor

  const [toYear, setToYear] = useState(2050)

  const cert = certaintyInfo(t.mk_p, t.verdict, lang)
  const sign = t.slope_per_decade > 0 ? '+' : ''
  const totSign = t.total_change > 0 ? '+' : ''
  const rangeJoin = lang === 'es' ? 'a' : 'to'

  const needed = t.years_needed ?? t.n_years
  const ratioPct = t.verdict === 'significant'
    ? 100
    : Math.max(12, Math.min(96, Math.round((t.n_years / Math.max(1, needed)) * 100)))
  const missingYears = t.years_needed && t.years_needed > t.n_years ? t.years_needed - t.n_years : 0

  function pickScenarioYear(y: number) {
    setToYear(y)
    onScenario(y)
  }

  return (
    <div className="studio-block">

      <Card className={`verdict hero-verdict ${t.verdict}`}>
        <div className="row">
          <div>
            <span className="muted small">
              {t.first_year}–{t.last_year} · {where}
            </span>
            <h2>{varLabel}</h2>
          </div>
          <span className={`badge lg ${t.verdict}`}>{verdictLabel(t.verdict, lang)}</span>
        </div>
        <p className="lead">{humanVerdictSummary(t, where, varLabel, lang)}</p>
        <Shard part="bottom" className="deco" />
      </Card>

      <div className="kpi-grid">
        <Kpi label={kpi.what} value={<>{DIRECTION_ARROW[t.direction]} {varLabel}</>}>
          <em className="muted small">{t.first_year}–{t.last_year} ({t.n_years} {kpi.yearsWord})</em>
        </Kpi>

        <Kpi label={kpi.pace} value={<>{sign}{fmtNum(t.slope_per_decade, lang)} {unit} {kpi.perDecade}</>} num>
          <em className="muted small">
            {totSign}{fmtNum(t.total_change, lang)} {unit} {kpi.totalOver} {t.n_years} {kpi.yearsWord}
            {t.percent_change !== null ? ` (${totSign}${t.percent_change.toFixed(1)}%)` : ''}
          </em>
          <span className="muted small">
            {kpi.plausibleRange} {fmtNum(t.ci_low_per_decade, lang)} {rangeJoin} {fmtNum(t.ci_high_per_decade, lang)}
          </span>
        </Kpi>

        <Kpi label={kpi.certainty} value={cert.headline} color={cert.tone === 'high' ? 'var(--accent-deep)' : cert.tone === 'mid' ? 'var(--amber)' : 'var(--no)'}>
          <div className="meter-track">
            <div className={`meter-fill ${cert.tone}`} style={{ width: `${cert.pct}%` }} />
          </div>
          <em className="muted small">
            {cert.detail}
          </em>
        </Kpi>

        <Kpi label={kpi.data} value={<>{t.n_years} {t.verdict !== 'significant' && t.years_needed ? `/ ~${t.years_needed}` : ''} {kpi.yearsWord}</>} num>
          <div className="meter-track">
            <div
              className={`meter-fill ${t.verdict === 'significant' ? 'high' : 'mid'}`}
              style={{ width: `${ratioPct}%` }}
            />
          </div>
          <em className="muted small">
            {t.verdict === 'significant'
              ? kpi.enoughData
              : missingYears > 0
                ? `${kpi.missingYearsPrefix} ~${missingYears} ${kpi.missingYearsSuffix}`
                : kpi.enoughData}
          </em>
        </Kpi>
      </div>

      {t.warnings.length > 0 && (
        <ul className="warnings">
          {t.warnings.map((w) => (
            <li key={w}>{translateWarning(w, lang)}</li>
          ))}
        </ul>
      )}
      {reliability && (
        <p className="muted small" style={{ margin: '6px 0 14px' }}>
          ℹ {reliability}
        </p>
      )}

      <TrendChart trend={t} forecast={scenario} lang={lang} />

      <Card className="scenario-card">
        <div className="row">
          <div>
            <strong>{scCopy.title}</strong>
            <p className="muted small" style={{ margin: '2px 0 0' }}>{scCopy.note}</p>
          </div>
          <div className="scenario-pills">
            {[2030, 2040, 2050, 2075, 2100].map((y) => (
              <button
                key={y}
                type="button"
                className={`chip ${scenario && toYear === y ? 'on' : ''}`}
                onClick={() => pickScenarioYear(y)}
              >
                {y}
              </button>
            ))}
          </div>
        </div>
        {scenario && (
          <div className="scenario-result">
            <p style={{ margin: '8px 0 4px' }}>{formatForecastText(scenario, varLabel, t.unit, lang)}</p>
            {scenario.warnings.map((w) => (
              <p key={w} className="muted small" style={{ margin: '2px 0' }}>{translateWarning(w, lang)}</p>
            ))}
          </div>
        )}
      </Card>

      <ExplainPanel
        request={{
          kind: 'trend',
          variable: t.variable,
          lat: data.lat,
          lon: data.lon,
          place: where,
          start,
          to_year: toYear,
        }}
        lang={lang}
      />

      <Card className="rigor-card">
        <Disclosure title={rig.summaryStudent}>
            <p className="small muted" style={{ marginTop: 0 }}>
              {rig.methodTitle} · n = {t.n_years}, n_eff = {fmtNum(t.n_effective, lang, 3)}, lag-1 r = {fmtNum(t.autocorrelation, lang, 2)}
            </p>
            <div className="scroll">
              <table>
                <thead>
                  <tr>
                    {rig.cols.map((col) => <th key={col}>{col}</th>)}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{rig.row1}</td>
                    <td className="num">{fmtNum(t.slope_per_decade, lang)}</td>
                    <td className="num">{fmtNum(t.ci_low_per_decade, lang)} {rangeJoin} {fmtNum(t.ci_high_per_decade, lang)}</td>
                    <td className="num">{fmtProb(t.mk_p, lang)} (τ = {fmtNum(t.mk_tau, lang, 2)})</td>
                  </tr>
                  <tr>
                    <td>{rig.row2}</td>
                    <td className="num">{fmtNum(t.ols_slope_per_decade, lang)}</td>
                    <td className="num">{fmtNum(t.ols_ci_low_per_decade, lang)} {rangeJoin} {fmtNum(t.ols_ci_high_per_decade, lang)}</td>
                    <td className="num">{fmtProb(t.ols_p, lang)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="muted small" style={{ marginBottom: 0 }}>
              {t.methods_agree ? rig.agreeYes : rig.agreeNo}{' '}
              {data.source === 'nasa-power' ? rig.sourceLive : rig.sourceLocal}
            </p>
        </Disclosure>
      </Card>
    </div>
  )
}
