import { DIRECTION_ARROW, type Catalog, type RegionTrend, type ScanResponse } from './api'
import { certaintyInfo, fmtNum, fmtProb, tRegion, tUnit, tVariable, UI, verdictLabel, type Lang } from './i18n'
import { Card } from './ui'

export function ScanAndRegionsView({
  scan,
  regions,
  where,
  varLabel,
  cat,
  lang,
  onOpen,
}: {
  scan: ScanResponse
  regions: RegionTrend[]
  where: string
  varLabel: string
  cat: Catalog
  lang: Lang
  onOpen: (key: string) => void
}) {
  const sCopy = UI[lang].phase3.scan
  const ok = regions.filter((r) => r.result)
  const ups = ok.filter((r) => r.result!.significant && r.result!.direction === 'up').length
  const downs = ok.filter((r) => r.result!.significant && r.result!.direction === 'down').length

  return (
    <div className="studio-block">
      <Card className="chart-card">
        <h3 style={{ marginTop: 0 }}>{sCopy.title} {where}</h3>
        <p className="muted small">{sCopy.sub}</p>
        <div className="scroll">
          <table>
            <thead>
              <tr>
                {sCopy.colsScan.map((c) => <th key={c}>{c}</th>)}
              </tr>
            </thead>
            <tbody>
              {scan.results.map((r) => {
                const rawV = cat.variables.find((v) => v.key === r.variable)
                const vName = rawV ? tVariable(rawV, lang).label : r.label
                const unit = tUnit(r.unit, lang)
                const cert = certaintyInfo(r.mk_p, r.verdict, lang)
                return (
                  <tr key={r.variable}>
                    <td>
                      <button className="link" onClick={() => onOpen(r.variable)}>{vName}</button>
                    </td>
                    <td className="num">{DIRECTION_ARROW[r.direction]}</td>
                    <td className="num">{r.slope_per_decade > 0 ? '+' : ''}{fmtNum(r.slope_per_decade, lang)} {unit}</td>
                    <td className="num">
                      {cert.headline}
                      {r.p_adjusted !== null && (
                        <span className="muted small" style={{ display: 'block' }}>
                          p_adj {fmtProb(r.p_adjusted, lang)}
                        </span>
                      )}
                    </td>
                    <td>
                      <span className={`badge ${r.verdict}`}>{verdictLabel(r.verdict, lang)}</span>
                      {r.step_year && (
                        <span className="badge not_yet" style={{ marginLeft: 6 }}>
                          {lang === 'es' ? `salto ${r.step_year}` : `jump ${r.step_year}`}
                        </span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <p className="muted small" style={{ marginBottom: 0 }}>{sCopy.bonferroniNote}</p>
      </Card>

      <Card className="chart-card" style={{ marginTop: 16 }}>
        <h3 style={{ marginTop: 0 }}>{sCopy.regionsTitle} ({varLabel})</h3>
        <p className="muted small">
          {sCopy.regionsSub}{' '}
          {lang === 'es'
            ? `(${ups} suben y ${downs} bajan significativamente.)`
            : `(${ups} rising and ${downs} falling significantly.)`}
        </p>
        <div className="scroll">
          <table>
            <thead>
              <tr>
                {sCopy.colsReg.map((c) => <th key={c}>{c}</th>)}
              </tr>
            </thead>
            <tbody>
              {regions.map((row) => {
                const reg = tRegion(row.region, lang)
                if (!row.result) {
                  return (
                    <tr key={reg.id}>
                      <td>{reg.label}</td>
                      <td colSpan={4} className="muted">{row.error}</td>
                    </tr>
                  )
                }
                const r = row.result
                const unit = tUnit(r.unit, lang)
                const cert = certaintyInfo(r.mk_p, r.verdict, lang)
                return (
                  <tr key={reg.id}>
                    <td>
                      <strong>{reg.label}</strong>
                      <br />
                      <span className="muted small">{reg.biome}</span>
                    </td>
                    <td className="num">{DIRECTION_ARROW[r.direction]}</td>
                    <td className="num">{r.slope_per_decade > 0 ? '+' : ''}{fmtNum(r.slope_per_decade, lang)} {unit}</td>
                    <td className="num">{cert.headline}</td>
                    <td>
                      <span className={`badge ${r.verdict}`}>{verdictLabel(r.verdict, lang)}</span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
