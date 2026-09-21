import type { Company, Package, RoadmapRequest, User } from '../types'

/** Single demo company — fresh application waiting for admin review. */
export const DEMO_COMPANY_ID = 'c-gulf-thread'

export const seedUsers: User[] = [
  { id: 'u-admin', role: 'admin', name: '', email: 'admin@demo.local' },
  { id: 'u-company-1', role: 'company', name: '', email: 'company@demo.local' },
  { id: 'u-customer-1', role: 'customer', name: '', email: 'customer@demo.local' },
]

export const seedPackages: Package[] = [
  {
    id: 'pkg-basic',
    tier: 'basic',
    name: 'Single GCC Market',
    price: 499,
    billingPeriod: 'yearly',
    features: [
      'Choose 1 GCC country',
      'Full localization process for that market',
      'Customer directory listing in that country only',
    ],
    limits: {
      gccMarkets: 1,
      featured: false,
      topFeatured: false,
      analytics: 'none',
      priorityReview: false,
      teamMembers: 1,
      productSlots: 1,
    },
  },
  {
    id: 'pkg-growth',
    tier: 'growth',
    name: 'Triple GCC',
    price: 1299,
    billingPeriod: 'yearly',
    features: [
      'Choose 3 GCC countries',
      'Localization process for each selected market',
      'Directory visibility in those 3 countries',
      'Featured placement in search',
    ],
    limits: {
      gccMarkets: 3,
      featured: true,
      topFeatured: false,
      analytics: 'basic',
      priorityReview: true,
      teamMembers: 3,
      productSlots: 5,
    },
  },
  {
    id: 'pkg-enterprise',
    tier: 'enterprise',
    name: 'Full GCC',
    price: 2499,
    billingPeriod: 'yearly',
    features: [
      'All 6 GCC countries included',
      'Localization process for every GCC market',
      'Directory visibility across the full GCC',
      'Top featured placement & full analytics',
    ],
    limits: {
      gccMarkets: 6,
      featured: true,
      topFeatured: true,
      analytics: 'full',
      priorityReview: true,
      teamMembers: 25,
      productSlots: 50,
    },
  },
]

export const seedCompanies: Company[] = [
  {
    id: DEMO_COMPANY_ID,
    userId: 'u-company-1',
    name: 'Gulf Thread Manufacturing',
    logoUrl: '',
    domain: 'Manufacturing',
    pitch: 'Premium apparel manufacturing for GCC retailers and private labels.',
    problemSolved: 'Reliable cut-and-sew capacity with export-ready compliance documentation.',
    targetCustomerType: 'Retail brands, distributors',
    originCountry: 'United Kingdom',
    targetCountries: ['Bahrain'],
    status: 'pending',
    packageTier: null,
    licensedCountries: [],
    roadmapRequestsUsed: 0,
    profileViews: 0,
    createdAt: new Date().toISOString(),
  },
]

export const seedRoadmapRequests: RoadmapRequest[] = []
