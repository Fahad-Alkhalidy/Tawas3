import { useEffect, useRef, useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'
import { enterDemoSession } from '../utils/demoSession'
import type { UserRole } from '../types'
import { BrandLogo } from './BrandLogo'

const demoHeaderRoles = ['admin', 'company'] as const satisfies readonly UserRole[]

const demoRoleLabels: Record<(typeof demoHeaderRoles)[number], string> = {
  admin: 'Admin',
  company: 'Company',
}

export function AppShell() {
  const location = useLocation()
  const navigate = useNavigate()
  const session = useAppStore((s) => s.session)
  const setRole = useAppStore((s) => s.setRole)
  const clearSession = useAppStore((s) => s.clearSession)
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
        : role === 'visitor'
          ? [{ to: '/visitor/browse', label: 'Directory' }]
          : []

  const enterAs = (target: (typeof demoHeaderRoles)[number]) => {
    enterDemoSession(setRole, target, navigate)
  }

  const isNavActive = (to: string) => {
    if (to === '/company') {
      return location.pathname === '/company' || location.pathname === '/company/dashboard'
    }
    return location.pathname.startsWith(to)
  }

  const [headerVisible, setHeaderVisible] = useState(true)
  const lastScrollY = useRef(0)

  useEffect(() => {
    if (location.pathname === '/') {
      clearSession()
    }
    setHeaderVisible(true)
    lastScrollY.current = window.scrollY
  }, [location.pathname, clearSession])

  useEffect(() => {
    const threshold = 72

    const onScroll = () => {
      const y = window.scrollY
      const delta = y - lastScrollY.current
      lastScrollY.current = y

      if (y <= threshold) {
        setHeaderVisible(true)
        return
      }
      if (delta > 6) setHeaderVisible(false)
      else if (delta < -6) setHeaderVisible(true)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [location.pathname])

  const roleBtnClass = (target: (typeof demoHeaderRoles)[number]) =>
    `text-xs px-2.5 py-1.5 rounded-md transition-colors ${
      role === target
        ? 'bg-teal/30 text-white shadow-card'
        : 'text-sand/55 hover:text-sand/90 hover:bg-white/8'
    }`

  return (
    <div className="min-h-screen flex flex-col">
      <header
        className={`fixed top-0 inset-x-0 z-50 bg-ink text-sand shadow-header transition-transform duration-300 ease-out will-change-transform ${
          headerVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <BrandLogo onDark />

          <nav className="hidden sm:flex flex-1 items-center justify-center gap-1 md:gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm px-2.5 py-1.5 rounded-md transition-colors ${
                  isNavActive(link.to)
                    ? 'text-white bg-teal/30'
                    : 'text-sand/80 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1 shrink-0 flex-wrap justify-end">
            {demoHeaderRoles.map((target) => (
              <button
                key={target}
                type="button"
                className={roleBtnClass(target)}
                onClick={() => enterAs(target)}
              >
                {demoRoleLabels[target]}
              </button>
            ))}
          </div>
        </div>
      </header>
      <main className="flex-1 pt-14">
        <Outlet />
      </main>
      <footer className="py-8 text-center text-xs text-ink-muted bg-surface-raised/50 shadow-[0_-4px_24px_rgb(52_45_71_/_0.04)]">
        Tawas3: simplify GCC applications, explore demand, and extend your reach
      </footer>
    </div>
  )
}
