import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'

/** Reset scroll position on client-side navigation (React Router keeps scroll by default). */
export function ScrollToTop() {
  const { pathname } = useLocation()

  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}
