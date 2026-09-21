import { flushSync } from 'react-dom'
import type { UserRole } from '../types'

const defaultPaths: Record<UserRole, string> = {
  admin: '/admin',
  company: '/company',
  customer: '/customer/browse',
}

export function enterDemoSession(
  setRole: (role: UserRole) => void,
  role: UserRole,
  navigate: (path: string) => void,
  path?: string,
) {
  flushSync(() => setRole(role))
  navigate(path ?? defaultPaths[role])
}
