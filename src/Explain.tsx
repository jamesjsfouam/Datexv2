import { Fragment, useState, type ReactNode } from 'react'
import { apiPost } from './api'
import type { Lang } from './i18n'
import { Button, Card } from './ui'

export type ExplainRequest = {
  kind: 'trend' | 'demography' | 'landcover' | 'relate'
  variable?: string
  indicator?: string
  country?: string | null
  lat?: number
  lon?: number
  place?: string
  start?: number
  to_year?: number
  lang?: Lang
}
type Explanation = { text: string; source: 'claude' | 'plantilla'; note: string | null }

function renderText(text: string): ReactNode {
  return text.split(/\n{2,}/).map((para, i) => (
    <p key={i}>
      {para.split(/(\*\*[^*]+\*\*)/g).map((chunk, j) =>
        chunk.startsWith('**') && chunk.endsWith('**')
          ? <strong key={j}>{chunk.slice(2, -2)}</strong>
          : <Fragment key={j}>{chunk}</Fragment>,
      )}
    </p>
  ))
}

export function ExplainPanel({ request, lang }: { request: ExplainRequest; lang: Lang }) {
  const [data, setData] = useState<Explanation | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function run() {
    setBusy(true)
    setError(null)
    try {
      setData(await apiPost<Explanation>('/api/explain', { ...request, lang }))
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setBusy(false)
    }
  }

  const copy = lang === 'es'
    ? {
        btn: 'Explicar en lenguaje sencillo: ¿por qué ocurre y qué significa?',
        thinking: 'Analizando cifras…',
        aiTitle: 'Explicación asistida por IA (anclada a cifras reales)',
        tplTitle: 'Resumen científico automático',
        close: 'ocultar',
      }
    : {
        btn: 'Explain in plain language: why might this happen & what does it mean?',
        thinking: 'Synthesizing numbers…',
        aiTitle: 'AI Explanation (anchored strictly to engine numbers)',
        tplTitle: 'Automated Scientific Summary',
        close: 'hide',
      }

  return (
    <div className="explain">
      {!data && (
        <Button variant="secondary" className="explain-btn" onClick={run} disabled={busy}>
          {busy ? copy.thinking : copy.btn}
        </Button>
      )}
      {error && <p className="error" role="alert">{error}</p>}
      {data && (
        <Card className={`explain-box ${data.source}`}>
          <div className="row">
            <strong>{data.source === 'claude' ? copy.aiTitle : copy.tplTitle}</strong>
            <button className="link" onClick={() => setData(null)}>{copy.close}</button>
          </div>
          {renderText(data.text)}
          {data.note && <p className="muted small">{data.note}</p>}
        </Card>
      )}
    </div>
  )
}
