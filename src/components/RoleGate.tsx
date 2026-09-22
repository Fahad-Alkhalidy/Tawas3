import { Navigate, useLocation } from 'react-router-dom'
import type { UserRole } from '../types'
import { useAppStore } from '../store/useAppStore'
import { VisitorRestricted } from '../pages/visitor/VisitorRestricted'

export function RoleGate({ allow, children }: { allow: UserRole; children: React.ReactNode }) {
  const location = useLocation()
  const role = useAppStore((s) => s.session.role)
  const user = useAppStore((s) => s.getCurrentUser())

  if (role !== allow) {
    return <Navigate to="/" replace state={{ from: location.pathname }} />
  }

  if (allow === 'visitor' && user?.restricted) {
    return <VisitorRestricted />
  }

  return <>{children}</>
}
