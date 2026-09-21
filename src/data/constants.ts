import type { CompanyDomain, GccCountry } from '../types'

export const DOMAINS: CompanyDomain[] = [
  'Manufacturing',
  'Technology/AI',
  'Media & Production',
  'Food & Beverage',
  'Retail',
  'Healthcare',
  'Logistics',
  'Finance',
  'Other',
]

export const GCC_COUNTRIES: GccCountry[] = [
  'Bahrain',
  'Saudi Arabia',
  'UAE',
  'Qatar',
  'Kuwait',
  'Oman',
]

export const STATUS_LABELS: Record<string, string> = {
  pending: 'Pending review',
  approved: 'Approved',
  rejected: 'Rejected',
  suspended: 'Suspended',
}
