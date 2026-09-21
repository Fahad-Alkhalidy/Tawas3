import { GCC_COUNTRIES } from '../data/constants'
import type { GccCountry, PackageTier } from '../types'

export function marketsLimitForTier(tier: PackageTier): number {
  switch (tier) {
    case 'basic':
      return 1
    case 'growth':
      return 3
    case 'enterprise':
      return GCC_COUNTRIES.length
    default:
      return 0
  }
}

export function allGccMarkets(): GccCountry[] {
  return [...GCC_COUNTRIES]
}
