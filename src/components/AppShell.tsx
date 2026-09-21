import { useEffect } from 'react'
import { flushSync } from 'react-dom'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'
import { BrandLogo } from './BrandLogo'

export function AppShell() {
  const location = useLocation()
  const navigate = useNavigate()
  const session = useAppStore((s) => s.session)
  const setRole = useAppStore((s) => s.setRole)
  const clearSession = useAppStore((s) => s.clearSession)
  const user = useAppStore((s) => s.getCurrentUser())
  const company = useAppStore((s) =>
    session.role === 'company' && session.userId ? s.getCompanyForUser(session.userId) : undefined,
  )

  const role = session.role
  const companyLinks = [
    { to: '/company', label: 'Dashboard' },
    { to: '/company/onboarding', label: 'Application' },
  ]
  if (company?.status === 'approved') {
    companyLinks.push({ to: '/company/pricing', label: 'Subscribe' })
  }

  const navLinks =
    role === 'admin'
      ? [{ to: '/admin', label: 'Dashboard' }]
      : role === 'company'
        ? companyLinks
        : role === 'customer'
          ? [{ to: '/customer/browse', label: 'Directory' }]
          : []

  const enterAs = (target: 'admin' | 'company') => {
    flushSync(() => {
      setRole(target)
    })
    navigate(target === 'admin' ? '/admin' : '/company')
  }

  const isNavActive = (to: string) => {
    if (to === '/company') {
      return location.pathname === '/company' || location.pathname === '/company/dashboard'
    }
    return location.pathname.startsWith(to)
  }

  useEffect(() => {
    if (location.pathname === '/') {
      clearSession()
    }
  }, [location.pathname, clearSession])

  const roleBtnClass = (target: 'admin' | 'company') =>
    `text-xs px-2.5 py-1 rounded-sm border transition-colors ${
      role === target
        ? 'bg-teal/30 text-white border-teal/50'
        : 'text-sand/55 border-transparent hover:text-sand/90 hover:bg-white/5'
    }`

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border bg-ink text-sand">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <BrandLogo onDark />

          <nav className="hidden sm:flex flex-1 items-center justify-center gap-1 md:gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm px-2 py-1 rounded-sm transition-colors ${
                  isNavActive(link.to)
                    ? 'text-white bg-teal/30'
                    : 'text-sand/80 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1.5 shrink-0">
            {user && role && (
              <span className="hidden lg:block text-xs text-sand/70 max-w-[120px] truncate mr-1">
                {user.name}
              </span>
            )}
            <button type="button" className={roleBtnClass('admin')} onClick={() => enterAs('admin')}>
              Admin
            </button>
            <button type="button" className={roleBtnClass('company')} onClick={() => enterAs('company')}>
              Company
            </button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-border py-6 text-center text-xs text-ink-muted">
        Tawas3 — localization guidance &amp; marketplace for Bahrain &amp; the GCC
      </footer>
    </div>
  )
}
