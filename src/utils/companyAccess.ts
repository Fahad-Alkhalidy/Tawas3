import type { Company, GccCountry } from '../types'
import { marketsLimitForTier } from './tierMarkets'

export function companyHasPaid(c: Company): boolean {
  return c.packageTier !== null
}

export function companyMarketLimit(c: Company): number {
  if (!c.packageTier) return 0
  return marketsLimitForTier(c.packageTier)
}

export function companyMarketsConfigured(c: Company): boolean {
  if (!companyHasPaid(c)) return false
  const limit = companyMarketLimit(c)
  return c.licensedCountries.length === limit
}

/** Localization steps visible after approval, payment, and markets confirmed. */
export function canViewRequirements(c: Company): boolean {
  return c.status === 'approved' && companyMarketsConfigured(c)
}

export function isListedInCountry(c: Company, country: GccCountry): boolean {
  return (
    c.status === 'approved' &&
    companyMarketsConfigured(c) &&
    c.licensedCountries.includes(country)
  )
}

/** Shown anywhere in the customer directory (at least one paid market). */
export function isListedForCustomers(c: Company): boolean {
  return c.status === 'approved' && companyMarketsConfigured(c)
}
