import type { PointerEvent } from 'react'
import { type Catalog } from './api'
import { tDemo, UI, type Lang } from './i18n'
import { Arrow, Button, Card, Disclosure, Shard } from './ui'

const MONTE_CARLO_ROWS = [
  { phi: '0', naive: '4,8 %', naiveEn: '4.8%', verdict: '3,6 %', verdictEn: '3.6%', tagEs: 'Sin memoria', tagEn: 'No memory' },
  { phi: '0,4', phiEn: '0.4', naive: '19,3 %', naiveEn: '19.3%', verdict: '4,8 %', verdictEn: '4.8%', tagEs: '4× menos errores', tagEn: '4× fewer errors' },
  { phi: '0,8', phiEn: '0.8', naive: '49,0 %', naiveEn: '49.0%', verdict: '8,2 %', verdictEn: '8.2%', tagEs: '6× menos errores', tagEn: '6× fewer errors' },
]

type Props = {
  lang: Lang
  cat: Catalog | null
  onExplore: () => void
  onDemo: (d: Catalog['demos'][number], goPlanet?: boolean) => void
}

function tilt(e: PointerEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect()
  e.currentTarget.style.setProperty('--px', String((e.clientX - r.left) / r.width - 0.5))
  e.currentTarget.style.setProperty('--py', String((e.clientY - r.top) / r.height - 0.5))
}

export function Briefing({ lang, cat, onExplore, onDemo }: Props) {
  const t = UI[lang].phase1
  const stats = [
    [cat ? cat.variables.length : 14, t.stats.vars],
    [cat ? cat.last_year - cat.first_year + 1 : 45, t.stats.years],
    // a mano, porque toLocaleString('es') no le pone punto a los números de 4 cifras
    [lang === 'es' ? '2.592' : '2,592', t.stats.cells],
    [cat ? Object.keys(cat.countries).length : 249, t.stats.countries],
  ]

  return (
    <div className="phase-stack">
      <section className="hero" onPointerMove={tilt}>
        <div className="hero-copy">
          <h1 className="hero-title">{t.headline} <mark>{t.headlineMark}</mark></h1>
          <p className="hero-sub">{t.sub}</p>
          <Button className="cta-lg" onClick={onExplore}>
            {t.ctaPlanet}
            <Arrow />
          </Button>
        </div>
        <div className="hero-mark" aria-hidden>
          <Shard part="left" />
          <Shard part="top" />
          <Shard part="right" />
          <Shard part="bottom" />
        </div>
      </section>

      <section className="stats-band reveal">
        {stats.map(([value, label]) => (
          <div key={label}>
            <strong className="num">{value}</strong>
            <span>{label}</span>
          </div>
        ))}
        <Shard part="bottom" className="deco" />
      </section>

      {cat && (
        <section className="reveal">
          <h2 className="section-heading">{t.demosTitle}</h2>
          <div className="demo-grid">
            {cat.demos.map((rawD) => (
              <button type="button" key={rawD.region + rawD.variable} className="demo-card" onClick={() => onDemo(rawD, false)}>
                <h3>{tDemo(rawD, lang).title}</h3>
                <Arrow />
              </button>
            ))}
          </div>
        </section>
      )}

      <Card as="section" className="method reveal">
        <Disclosure title={t.trapTitle}>
          <div className="briefing-two-col">
            <div>
              <p className="muted" style={{ marginTop: 0 }}>{t.trapDesc}</p>
              <div className="scroll">
                <table className="bench-table">
                  <thead>
                    <tr>
                      {t.trapCols.map((col) => <th key={col}>{col}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {MONTE_CARLO_ROWS.map((row) => (
                      <tr key={row.phi}>
                        <td className="num">φ = {lang === 'en' ? (row.phiEn ?? row.phi) : row.phi}</td>
                        <td className="num bad-val">{lang === 'en' ? row.naiveEn : row.naive}</td>
                        <td className="num good-val">{lang === 'en' ? row.verdictEn : row.verdict}</td>
                        <td><span className="badge significant">{lang === 'en' ? row.tagEn : row.tagEs}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h3>{t.semaforoTitle}</h3>
              <div className="semaforo-list">
                {t.semaforo.map((item) => (
                  <Card inset key={item.tone} className="semaforo-card">
                    <div className="row">
                      <strong>{item.title}</strong>
                      <span className={`badge ${item.tone}`}>{item.badge}</span>
                    </div>
                    <p className="small muted" style={{ margin: '6px 0 0' }}>{item.desc}</p>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </Disclosure>
      </Card>
    </div>
  )
}
