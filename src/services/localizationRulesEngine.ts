import type {
  CompanyDomain,
  GccCountry,
  RoadmapExtraFactors,
  RoadmapStep,
} from '../types'

/** Country-specific registration & authority baseline (shared first steps). */
const countryBaselines: Record<GccCountry, RoadmapStep[]> = {
  Bahrain: [
    {
      order: 1,
      title: 'Choose legal structure',
      description:
        'Decide between W.L.L., B.S.C. (closed/public), branch, or representative office. Factor in foreign ownership caps for your sector.',
      category: 'legal',
      estimatedWeeks: 2,
    },
    {
      order: 2,
      title: 'Reserve trade name & incorporate',
      description:
        'Register via MOICT / Sijilat: trade name reservation, memorandum, shareholders, and commercial registration (CR).',
      category: 'legal',
      estimatedWeeks: 3,
    },
    {
      order: 3,
      title: 'Open corporate bank account',
      description:
        'Prepare CR, ownership structure, and business plan. Local banks require in-person KYC and source-of-funds documentation.',
      category: 'legal',
      estimatedWeeks: 2,
    },
    {
      order: 4,
      title: 'LMRA & immigration planning',
      description:
        'Plan work permits and dependent visas via LMRA. Budget for quota, medical tests, and CPR (Central Population Registry) steps.',
      category: 'employment',
      estimatedWeeks: 2,
    },
    {
      order: 5,
      title: 'VAT & tax registration',
      description:
        'Register for VAT with NBR if turnover exceeds mandatory thresholds. Understand withholding tax on cross-border services.',
      category: 'tax',
      estimatedWeeks: 1,
    },
  ],
  'Saudi Arabia': [
    {
      order: 1,
      title: 'MISA investment license',
      description:
        'Apply through MISA (Ministry of Investment) for foreign investment license aligned with your activity code.',
      category: 'legal',
      estimatedWeeks: 4,
    },
    {
      order: 2,
      title: 'Commercial registration (CR)',
      description: 'Obtain CR via Ministry of Commerce after MISA approval and local address verification.',
      category: 'legal',
      estimatedWeeks: 3,
    },
    {
      order: 3,
      title: 'Chamber of Commerce & municipal requirements',
      description: 'Register with relevant Chamber and secure municipal/baladiya licenses for your premises.',
      category: 'licensing',
      estimatedWeeks: 2,
    },
    {
      order: 4,
      title: 'Qiwa, GOSI & payroll setup',
      description: 'Register employees on Qiwa, GOSI social insurance, and WPS-compliant payroll.',
      category: 'employment',
      estimatedWeeks: 2,
    },
    {
      order: 5,
      title: 'ZATCA tax & e-invoicing',
      description: 'VAT registration with ZATCA where applicable; implement Phase 2 e-invoicing if required for your entity.',
      category: 'tax',
      estimatedWeeks: 2,
    },
  ],
  UAE: [
    {
      order: 1,
      title: 'Select mainland vs free zone',
      description:
        'Mainland allows broader market access; free zones offer 100% foreign ownership and sector-specific rules.',
      category: 'legal',
      estimatedWeeks: 2,
    },
    {
      order: 2,
      title: 'Trade license & entity formation',
      description:
        'Apply via DED (mainland) or relevant free zone authority. Secure initial approval and lease agreement.',
      category: 'legal',
      estimatedWeeks: 3,
    },
    {
      order: 3,
      title: 'Corporate bank & UBO disclosure',
      description: 'Complete KYC with UAE banks; file Ultimate Beneficial Owner declarations as required.',
      category: 'legal',
      estimatedWeeks: 2,
    },
    {
      order: 4,
      title: 'MOHRE / free zone employment setup',
      description: 'Work permits, medical, Emirates ID, and WPS payroll per your jurisdiction.',
      category: 'employment',
      estimatedWeeks: 2,
    },
    {
      order: 5,
      title: 'Corporate tax & VAT',
      description: 'Assess UAE corporate tax applicability and register for VAT if turnover triggers registration.',
      category: 'tax',
      estimatedWeeks: 2,
    },
  ],
  Qatar: [
    {
      order: 1,
      title: 'MOCI commercial registration',
      description: 'Register legal entity and activity with Ministry of Commerce and Industry.',
      category: 'legal',
      estimatedWeeks: 4,
    },
    {
      order: 2,
      title: 'Foreign investment approval',
      description: 'Obtain investment approval where foreign ownership or restricted activities apply.',
      category: 'legal',
      estimatedWeeks: 3,
    },
    {
      order: 3,
      title: 'Municipality & sector permits',
      description: 'Secure location approvals and any sector-specific operational permits.',
      category: 'licensing',
      estimatedWeeks: 2,
    },
    {
      order: 4,
      title: 'QID & labour compliance',
      description: 'Work permits via Ministry of Labour, medical, and Qatar ID for employees.',
      category: 'employment',
      estimatedWeeks: 2,
    },
    {
      order: 5,
      title: 'Tax registration',
      description: 'Register for withholding tax and VAT obligations with General Tax Authority.',
      category: 'tax',
      estimatedWeeks: 1,
    },
  ],
  Kuwait: [
    {
      order: 1,
      title: 'KDIPA / Ministry of Commerce approval',
      description: 'Foreign investment approval and commercial license application for your activity.',
      category: 'legal',
      estimatedWeeks: 5,
    },
    {
      order: 2,
      title: 'Local partner or approved structure',
      description: 'Confirm ownership structure requirements; some activities require Kuwaiti sponsor/partner.',
      category: 'legal',
      estimatedWeeks: 3,
    },
    {
      order: 3,
      title: 'Municipality & fire safety',
      description: 'Premises inspection, civil defense, and municipal trade license.',
      category: 'licensing',
      estimatedWeeks: 2,
    },
    {
      order: 4,
      title: 'Manpower & residency',
      description: 'Work permits via Public Authority for Manpower and residency via Interior.',
      category: 'employment',
      estimatedWeeks: 2,
    },
    {
      order: 5,
      title: 'Tax & social security',
      description: 'Corporate tax considerations and PIFSS registration for national employees.',
      category: 'tax',
      estimatedWeeks: 1,
    },
  ],
  Oman: [
    {
      order: 1,
      title: 'MOCIIP investment & CR',
      description: 'Register with Ministry of Commerce, Industry and Investment Promotion.',
      category: 'legal',
      estimatedWeeks: 4,
    },
    {
      order: 2,
      title: 'Foreign capital requirements',
      description: 'Meet minimum capital and local shareholding rules if applicable to your sector.',
      category: 'legal',
      estimatedWeeks: 2,
    },
    {
      order: 3,
      title: 'Municipality & sector licensing',
      description: 'Operational licenses from municipality and sector regulators (e.g. tourism, telecom).',
      category: 'licensing',
      estimatedWeeks: 2,
    },
    {
      order: 4,
      title: 'Ministry of Labour permits',
      description: 'Work permits, medical, and resident card (residence visa) processing.',
      category: 'employment',
      estimatedWeeks: 2,
    },
    {
      order: 5,
      title: 'Tax Authority registration',
      description: 'VAT and excise registration where applicable; understand royalty withholding.',
      category: 'tax',
      estimatedWeeks: 1,
    },
  ],
}

/** Domain-specific steps appended after baseline (order renumbered in merge). */
const domainOverlays: Record<CompanyDomain, RoadmapStep[]> = {
  Manufacturing: [
    {
      order: 100,
      title: 'Industrial land & factory licensing',
      description:
        'Secure industrial zoning approval, factory permit, and environmental impact assessment where required.',
      category: 'licensing',
      estimatedWeeks: 6,
    },
    {
      order: 101,
      title: 'Customs & import of equipment',
      description:
        'Register with customs authority; classify HS codes for machinery and raw materials; consider bonded warehouse options.',
      category: 'customs',
      estimatedWeeks: 3,
    },
    {
      order: 102,
      title: 'Product standards & labeling',
      description:
        'Comply with GCC/GSO standards, Arabic labeling, and sector certifications (e.g. textiles, food-contact materials).',
      category: 'licensing',
      estimatedWeeks: 4,
    },
  ],
  'Technology/AI': [
    {
      order: 100,
      title: 'Data protection & cloud residency',
      description:
        'Map PDPL (KSA), UAE PDPL, or Bahrain PDPL obligations; document cross-border transfers and DPA with processors.',
      category: 'data',
      estimatedWeeks: 3,
    },
    {
      order: 101,
      title: 'Telecom / IT service provider rules',
      description:
        'Check if your SaaS triggers telecom or cloud service provider registration in the target market.',
      category: 'licensing',
      estimatedWeeks: 2,
    },
    {
      order: 102,
      title: 'AI governance & content moderation',
      description:
        'Document model risk, bias testing, and content policies aligned with local media and cybercrime regulations.',
      category: 'data',
      estimatedWeeks: 2,
    },
  ],
  'Media & Production': [
    {
      order: 100,
      title: 'Media / content licensing',
      description:
        'Obtain filming permits, content distribution licenses, and censorship clearance workflows for broadcast.',
      category: 'licensing',
      estimatedWeeks: 4,
    },
    {
      order: 101,
      title: 'Talent & freelance contracts',
      description:
        'Use compliant freelance and talent agreements; respect visa rules for cross-border crew.',
      category: 'employment',
      estimatedWeeks: 2,
    },
    {
      order: 102,
      title: 'Cultural sensitivity review',
      description:
        'Establish internal review for imagery, language, and religious/cultural norms in GCC markets.',
      category: 'culture',
      estimatedWeeks: 1,
    },
  ],
  'Food & Beverage': [
    {
      order: 100,
      title: 'Food control & HACCP',
      description:
        'Register with food safety authority; implement HACCP; facility inspection for production or import.',
      category: 'licensing',
      estimatedWeeks: 5,
    },
    {
      order: 101,
      title: 'Import & cold chain',
      description:
        'Halal certification where required; import permits for ingredients; cold storage compliance.',
      category: 'customs',
      estimatedWeeks: 3,
    },
    {
      order: 102,
      title: 'Labeling & nutrition claims',
      description: 'Arabic nutrition labels, allergen declarations, and approved health claims.',
      category: 'licensing',
      estimatedWeeks: 2,
    },
  ],
  Retail: [
    {
      order: 100,
      title: 'Retail trade license & signage',
      description: 'Municipal shop license, signage approvals, and mall landlord compliance if applicable.',
      category: 'licensing',
      estimatedWeeks: 3,
    },
    {
      order: 101,
      title: 'Consumer protection & e-commerce',
      description:
        'Refund policies, Arabic T&Cs, and e-commerce registration if selling online in the GCC.',
      category: 'legal',
      estimatedWeeks: 2,
    },
    {
      order: 102,
      title: 'Import & distribution',
      description: 'Distributor agreements, commercial agency rules, and customs clearance for stock.',
      category: 'customs',
      estimatedWeeks: 3,
    },
  ],
  Healthcare: [
    {
      order: 100,
      title: 'Health regulator approval',
      description:
        'Facility licensing, clinician credentials, and NHRA/SFDA/MOH-equivalent registrations.',
      category: 'licensing',
      estimatedWeeks: 8,
    },
    {
      order: 101,
      title: 'Medical device / pharma import',
      description: 'Product registration, cold chain, and pharmacovigilance if applicable.',
      category: 'customs',
      estimatedWeeks: 6,
    },
    {
      order: 102,
      title: 'Patient data & clinical records',
      description: 'Health data privacy policies and secure EMR hosting requirements.',
      category: 'data',
      estimatedWeeks: 3,
    },
  ],
  Logistics: [
    {
      order: 100,
      title: 'Transport & freight licensing',
      description:
        'Commercial vehicle permits, customs broker license, or 3PL operator registration.',
      category: 'licensing',
      estimatedWeeks: 4,
    },
    {
      order: 101,
      title: 'Warehouse & free zone utilization',
      description: 'Bonded warehouse, FTZ benefits, and last-mile delivery regulations.',
      category: 'customs',
      estimatedWeeks: 3,
    },
    {
      order: 102,
      title: 'Dangerous goods & cross-border',
      description: 'DG handling certifications and transit agreements with neighboring GCC states.',
      category: 'licensing',
      estimatedWeeks: 2,
    },
  ],
  Finance: [
    {
      order: 100,
      title: 'Central bank / CBB licensing',
      description:
        'Determine if activity requires banking, payment service, or fintech sandbox approval.',
      category: 'licensing',
      estimatedWeeks: 12,
    },
    {
      order: 101,
      title: 'AML / CFT program',
      description: 'KYC, transaction monitoring, and goAML reporting obligations.',
      category: 'legal',
      estimatedWeeks: 4,
    },
    {
      order: 102,
      title: 'Consumer credit & marketing',
      description: 'Disclosure rules for lending products and Sharia compliance if offering Islamic finance.',
      category: 'legal',
      estimatedWeeks: 3,
    },
  ],
  Other: [
    {
      order: 100,
      title: 'Sector regulator mapping',
      description:
        'Identify whether your activity falls under a specialized regulator beyond standard CR.',
      category: 'licensing',
      estimatedWeeks: 2,
    },
    {
      order: 101,
      title: 'Market entry validation',
      description: 'Pilot with local partner or representative office before full capital deployment.',
      category: 'market',
      estimatedWeeks: 4,
    },
  ],
}

function applyExtraFactors(
  steps: RoadmapStep[],
  factors: RoadmapExtraFactors,
): RoadmapStep[] {
  const extras: RoadmapStep[] = []

  if (factors.needsLocalPartner) {
    extras.push({
      order: 200,
      title: 'Local sponsor / partner diligence',
      description:
        'Shortlist partners with sector track record; structure profit-sharing and exit clauses; notarize agreements.',
      category: 'legal',
      estimatedWeeks: 4,
    })
  }

  if (factors.productType === 'physical') {
    extras.push({
      order: 201,
      title: 'Import compliance checklist',
      description:
        'HS classification, certificate of origin, and inspection requirements for physical goods.',
      category: 'customs',
      estimatedWeeks: 2,
    })
  }

  if (factors.productType === 'digital') {
    extras.push({
      order: 202,
      title: 'Digital service tax & invoicing',
      description:
        'Confirm B2B/B2C VAT treatment for cross-border digital services and localized invoicing.',
      category: 'tax',
      estimatedWeeks: 1,
    })
  }

  if (factors.companySize === 'solo' || factors.companySize === 'small') {
    extras.push({
      order: 203,
      title: 'Lean entity option',
      description:
        'Consider branch or rep office first to test market before full subsidiary capital requirements.',
      category: 'market',
      estimatedWeeks: 2,
    })
  }

  if (factors.companySize === 'large') {
    extras.push({
      order: 204,
      title: 'Group structure & transfer pricing',
      description:
        'Document intercompany agreements, IP ownership, and transfer pricing policy for regional HQ.',
      category: 'tax',
      estimatedWeeks: 4,
    })
  }

  return [...steps, ...extras]
}

function renumberSteps(steps: RoadmapStep[]): RoadmapStep[] {
  return steps
    .slice()
    .sort((a, b) => a.order - b.order)
    .map((step, index) => ({ ...step, order: index + 1 }))
}

/**
 * Generates a localization roadmap from domain, target country, and optional factors.
 * Swap this function's implementation for LLM generation without changing callers.
 */
export function generateLocalizationRoadmap(
  domain: CompanyDomain,
  targetCountry: GccCountry,
  extraFactors: RoadmapExtraFactors = {},
): RoadmapStep[] {
  const baseline = countryBaselines[targetCountry] ?? []
  const overlay = domainOverlays[domain] ?? domainOverlays.Other
  const merged = applyExtraFactors([...baseline, ...overlay], extraFactors)
  return renumberSteps(merged)
}

export function getSupportedDomains(): CompanyDomain[] {
  return Object.keys(domainOverlays) as CompanyDomain[]
}

export function getSupportedCountries(): GccCountry[] {
  return Object.keys(countryBaselines) as GccCountry[]
}
