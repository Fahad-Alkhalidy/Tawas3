import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from 'react'

const baseBtn =
  'inline-flex items-center justify-center gap-2 font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none cursor-pointer'

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md'
}) {
  const variants = {
    primary: 'bg-ink text-white hover:bg-ink-muted shadow-card hover:shadow-soft',
    secondary: 'bg-teal text-ink hover:bg-teal-dark/30 shadow-card',
    ghost: 'text-ink-muted hover:text-ink hover:bg-sand/40',
    danger: 'bg-danger text-white hover:opacity-90 shadow-card',
  }
  const sizes = { sm: 'text-sm px-3 py-1.5 rounded-md', md: 'text-sm px-4 py-2.5 rounded-md' }
  return (
    <button className={`${baseBtn} ${variants[variant]} ${sizes[size]} ${className}`} {...props} />
  )
}

export function Badge({
  tone = 'neutral',
  children,
}: {
  tone?: 'neutral' | 'success' | 'warning' | 'danger' | 'teal'
  children: ReactNode
}) {
  const tones = {
    neutral: 'bg-sand/80 text-ink-muted shadow-card',
    success: 'bg-teal-soft text-teal-dark',
    warning: 'bg-[#f5ead6] text-[#7a5a1e]',
    danger: 'bg-[#f5e6e6] text-danger',
    teal: 'bg-teal text-ink shadow-card',
  }
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-md ${tones[tone]}`}
    >
      {children}
    </span>
  )
}

export function FieldLabel({ children, htmlFor }: { children: ReactNode; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="block text-xs font-semibold uppercase tracking-wide text-ink-muted mb-1.5">
      {children}
    </label>
  )
}

export function Input({ className = '', ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`w-full bg-surface-raised rounded-md px-3 py-2.5 text-sm text-ink shadow-card placeholder:text-ink-muted/60 focus:outline-none focus:ring-2 focus:ring-teal/35 ${className}`}
      {...props}
    />
  )
}

export function TextArea({ className = '', ...props }: InputHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={`w-full min-h-[96px] bg-surface-raised rounded-md px-3 py-2.5 text-sm text-ink shadow-card placeholder:text-ink-muted/60 focus:outline-none focus:ring-2 focus:ring-teal/35 ${className}`}
      {...props}
    />
  )
}

export function Select({ className = '', children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={`w-full bg-surface-raised rounded-md px-3 py-2.5 text-sm text-ink shadow-card focus:outline-none focus:ring-2 focus:ring-teal/35 ${className}`}
      {...props}
    >
      {children}
    </select>
  )
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string
  title: string
  description?: string
  actions?: ReactNode
}) {
  return (
    <header className="flex flex-col gap-4 pb-6 mb-8 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-widest text-teal mb-2">{eyebrow}</p>
        )}
        <h1 className="text-3xl md:text-4xl text-ink">{title}</h1>
        {description && <p className="mt-2 text-ink-muted leading-relaxed">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2 shrink-0">{actions}</div>}
    </header>
  )
}

export function DataTable({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-x-auto bg-surface-raised rounded-lg shadow-soft">
      <table className="w-full text-sm text-left">{children}</table>
    </div>
  )
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-xl p-10 text-center bg-surface-raised shadow-soft">
      <p className="font-display text-xl text-ink">{title}</p>
      <p className="mt-2 text-sm text-ink-muted max-w-md mx-auto">{description}</p>
    </div>
  )
}
