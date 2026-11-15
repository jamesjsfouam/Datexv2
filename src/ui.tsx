import { useState, type ButtonHTMLAttributes, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react'

const cx = (...parts: (string | false | undefined)[]) => parts.filter(Boolean).join(' ')

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' }

export function Button({ variant = 'primary', className, type = 'button', ...rest }: ButtonProps) {
  return <button type={type} className={cx('btn', `btn-${variant}`, className)} {...rest} />
}

type CardProps = HTMLAttributes<HTMLElement> & { as?: 'div' | 'section' | 'article' | 'aside'; inset?: boolean }

export function Card({ as: Tag = 'div', inset, className, ...rest }: CardProps) {
  return <Tag className={cx(inset ? 'surface-inset' : 'surface', 'card', className)} {...rest} />
}

type KpiProps = { label: ReactNode; value: ReactNode; num?: boolean; color?: CSSProperties['color']; children?: ReactNode }

export function Kpi({ label, value, num, color, children }: KpiProps) {
  return (
    <Card inset className="kpi-card">
      <span className="kpi-kicker">{label}</span>
      <strong className={cx(num && 'num', 'kpi-val')} style={color ? { color } : undefined}>{value}</strong>
      {children}
    </Card>
  )
}

export function Collapse({ open, children }: { open: boolean; children: ReactNode }) {
  return (
    <div className={cx('collapse', open && 'open')} inert={!open}>
      <div className="collapse-inner">{children}</div>
    </div>
  )
}

export function Disclosure({ title, className, children }: { title: ReactNode; className?: string; children: ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={cx('disclosure', className)}>
      <button type="button" className="disclosure-toggle" aria-expanded={open} onClick={() => setOpen(!open)}>
        <span>{title}</span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M3.5 6l4.5 4.5L12.5 6" />
        </svg>
      </button>
      <Collapse open={open}>
        <div className="disclosure-body">{children}</div>
      </Collapse>
    </div>
  )
}

export function Switch({ checked, onChange, children }: { checked: boolean; onChange: (v: boolean) => void; children: ReactNode }) {
  return (
    <label className="switch">
      <input type="checkbox" role="switch" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="switch-track" aria-hidden />
      <span>{children}</span>
    </label>
  )
}

export function Shard({ part, className }: { part: 'left' | 'top' | 'right' | 'bottom'; className?: string }) {
  const mask = `url(./shard-${part}.png)`
  return <i aria-hidden className={cx('shard', `shard-${part}`, className)} style={{ maskImage: mask, WebkitMaskImage: mask }} />
}

export function Arrow() {
  return (
    <svg className="arrow" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  )
}

export function Loader({ label }: { label?: string }) {
  return (
    <div className="loader" role="status">
      <div className="loader-mark" aria-hidden>
        <Shard part="left" />
        <Shard part="top" />
        <Shard part="right" />
        <Shard part="bottom" />
      </div>
      {label && <span>{label}</span>}
    </div>
  )
}
