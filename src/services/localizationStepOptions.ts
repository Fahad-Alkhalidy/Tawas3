import type { GccCountry, RoadmapStep } from '../types'

export interface StepChoiceOption {
  id: string
  label: string
  description: string
}

const OPTIONS: Record<string, StepChoiceOption[]> = {
  'legal-structure': [
    {
      id: 'wll',
      label: 'With Limited Liability Company (W.L.L.)',
      description: 'Common for SMEs and joint ventures; flexible ownership.',
    },
    {
      id: 'bsc-closed',
      label: 'Bahrain Shareholding Company (B.S.C.) — closed',
      description: 'Suitable for larger capital and multiple shareholders.',
    },
    {
      id: 'branch',
      label: 'Branch of a foreign company',
      description: 'Extension of parent entity; no separate legal personality.',
    },
    {
      id: 'rep-office',
      label: 'Representative office',
      description: 'Market research and liaison only — no commercial sales.',
    },
  ],
  'incorporation-path': [
    {
      id: 'self-incorporate',
      label: 'Incorporate directly via Sijilat',
      description: 'Our team guides you; you file through MOICT online.',
    },
    {
      id: 'with-local-partner',
      label: 'Incorporate with a local corporate partner',
      description: 'Partner holds required local share or provides sponsorship.',
    },
    {
      id: 'use-formation-agent',
      label: 'Use a licensed formation agent',
      description: 'Third party handles filings and document preparation.',
    },
  ],
  'banking-preference': [
    {
      id: 'tier1-local',
      label: 'Tier-1 local bank (onshore Bahrain)',
      description: 'Full retail/corporate banking with local branch network.',
    },
    {
      id: 'islamic-window',
      label: 'Islamic banking window',
      description: 'Sharia-compliant accounts and financing structures.',
    },
    {
      id: 'international-bank',
      label: 'International bank with Bahrain presence',
      description: 'Cross-border treasury and multi-currency needs.',
    },
  ],
  'workforce-plan': [
    {
      id: 'staff-1-5',
      label: '1–5 employees in year one',
      description: 'Minimal quota; founder plus small core team.',
    },
    {
      id: 'staff-6-20',
      label: '6–20 employees in year one',
      description: 'Standard LMRA quota planning and dependent visas.',
    },
    {
      id: 'staff-20-plus',
      label: '20+ employees in year one',
      description: 'Higher quota, bulk visa processing, housing considerations.',
    },
    {
      id: 'no-local-hires-yet',
      label: 'No local hires in first 6 months',
      description: 'Remote leadership; defer quota until operations scale.',
    },
  ],
  'tax-registration': [
    {
      id: 'vat-mandatory',
      label: 'Expect mandatory VAT registration',
      description: 'Projected turnover above NBR mandatory threshold.',
    },
    {
      id: 'vat-voluntary',
      label: 'Voluntary VAT registration',
      description: 'Below threshold but want to reclaim input VAT.',
    },
    {
      id: 'vat-not-yet',
      label: 'Not registering for VAT yet',
      description: 'Early-stage; reassess when revenue triggers registration.',
    },
  ],
  'industrial-licensing': [
    {
      id: 'light-manufacturing',
      label: 'Light manufacturing / assembly',
      description: 'Factory permit with standard environmental review.',
    },
    {
      id: 'heavy-industrial',
      label: 'Heavy industrial / chemical processing',
      description: 'Extended EIA and industrial zoning requirements.',
    },
    {
      id: 'warehouse-only',
      label: 'Bonded warehouse / storage only',
      description: 'No production on site; customs-focused operations.',
    },
  ],
  'customs-import': [
    {
      id: 'own-imports',
      label: 'We will import directly',
      description: 'Company acts as importer of record for equipment/goods.',
    },
    {
      id: 'customs-broker',
      label: 'Use a licensed customs broker',
      description: 'Broker handles clearance and duty classification.',
    },
    {
      id: 'free-zone',
      label: 'Utilize free zone / bonded facility',
      description: 'Defer duties until goods enter local market.',
    },
  ],
  'data-privacy': [
    {
      id: 'cloud-gcc',
      label: 'Cloud hosted in GCC region',
      description: 'Data residency aligned with PDPL expectations.',
    },
    {
      id: 'cloud-global',
      label: 'Global cloud with transfer agreements',
      description: 'Cross-border transfers with DPA and SCCs.',
    },
    {
      id: 'on-prem',
      label: 'On-premises / private hosting',
      description: 'Local servers or dedicated managed hosting.',
    },
  ],
  'licensing-generic': [
    {
      id: 'standard-permit',
      label: 'Standard sector permit',
      description: 'Proceed with default licensing path for this activity.',
    },
    {
      id: 'expedited',
      label: 'Request expedited review',
      description: 'Time-sensitive launch; operations team to prioritize.',
    },
    {
      id: 'need-guidance',
      label: 'Need guidance before applying',
      description: 'Unsure which permit applies — request ops consultation.',
    },
  ],
  'employment-generic': [
    {
      id: 'local-hire-first',
      label: 'Hire locally first',
      description: 'Prioritize Bahraini or resident talent where possible.',
    },
    {
      id: 'mix-expat-local',
      label: 'Mix of expatriate and local hires',
      description: 'Typical quota split for specialized roles.',
    },
    {
      id: 'contractors',
      label: 'Contractors / freelancers initially',
      description: 'Flexible workforce before full-time headcount.',
    },
  ],
  'tax-generic': [
    { id: 'standard', label: 'Standard tax registration path', description: 'Follow default NBR / authority timeline.' },
    { id: 'advisor', label: 'Engage tax advisor first', description: 'External firm structures entity and filings.' },
  ],
  'customs-generic': [
    { id: 'goods-import', label: 'Importing physical goods', description: 'HS classification and duty planning required.' },
    { id: 'services-only', label: 'Services only — no imports', description: 'Minimal customs interaction expected.' },
  ],
  'market-generic': [
    { id: 'pilot', label: 'Pilot launch first', description: 'Soft launch before full commercial scale.' },
    { id: 'full-launch', label: 'Full commercial launch', description: 'Immediate market entry at target scale.' },
  ],
  'culture-generic': [
    { id: 'standard-review', label: 'Standard content review', description: 'Internal checklist for cultural sensitivity.' },
    { id: 'external-review', label: 'External cultural consultant', description: 'Third-party review of marketing and product.' },
  ],
}

/** Maps roadmap step titles to option sets (Bahrain-first; shared where titles match). */
const TITLE_TO_KEY: Record<string, string> = {
  'Choose legal structure': 'legal-structure',
  'Reserve trade name & incorporate': 'incorporation-path',
  'Open corporate bank account': 'banking-preference',
  'LMRA & immigration planning': 'workforce-plan',
  'VAT & tax registration': 'tax-registration',
  'Industrial land & factory licensing': 'industrial-licensing',
  'Customs & import of equipment': 'customs-import',
  'Data protection & cloud residency': 'data-privacy',
}

const CATEGORY_FALLBACK: Record<RoadmapStep['category'], string> = {
  legal: 'licensing-generic',
  licensing: 'licensing-generic',
  employment: 'employment-generic',
  tax: 'tax-generic',
  customs: 'customs-generic',
  data: 'data-privacy',
  market: 'market-generic',
  culture: 'culture-generic',
}

export function getInteractionKeyForStep(step: RoadmapStep, _country: GccCountry): string {
  return TITLE_TO_KEY[step.title] ?? CATEGORY_FALLBACK[step.category]
}

export function getOptionsForStep(step: RoadmapStep, country: GccCountry): StepChoiceOption[] {
  const key = getInteractionKeyForStep(step, country)
  return OPTIONS[key] ?? OPTIONS['licensing-generic']
}

export function getOptionById(key: string, optionId: string): StepChoiceOption | undefined {
  return (OPTIONS[key] ?? []).find((o) => o.id === optionId)
}
