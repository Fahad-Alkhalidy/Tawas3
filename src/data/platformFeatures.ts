/** Shown on company pricing — everything Tawas3 provides regardless of GCC coverage tier. */
export const PLATFORM_FEATURES = [
  'Admin review of your business application before go-live',
  'Localization process tailored to your industry and each target GCC market',
  'Step-by-step requirements (legal entity, licensing, labor, tax, sector rules)',
  'Directory profile visible to visitors in each paid GCC country',
  'Searchable listing by industry, problem solved, and market',
  'Introduction requests from visitors browsing the directory',
  'Dashboard to track application status and localization progress',
  'Updates to your roadmap when regulations change (per active markets)',
]

export const GCC_COVERAGE_OPTIONS: {
  tier: 'basic' | 'growth' | 'enterprise'
  label: string
  description: string
}[] = [
  {
    tier: 'basic',
    label: 'One GCC country',
    description: 'Localization process and directory listing in a single market you choose.',
  },
  {
    tier: 'growth',
    label: 'Three GCC countries',
    description: 'Localization and directory visibility in three markets you choose.',
  },
  {
    tier: 'enterprise',
    label: 'All GCC countries',
    description: 'Full GCC coverage: every market for localization and listings.',
  },
]
