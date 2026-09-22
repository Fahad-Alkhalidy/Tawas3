export type UserRole = 'admin' | 'company' | 'visitor'

export type CompanyStatus = 'pending' | 'approved' | 'rejected' | 'suspended'

export type PackageTier = 'basic' | 'growth' | 'enterprise'

export type CompanyDomain =
  | 'Manufacturing'
  | 'Technology/AI'
  | 'Media & Production'
  | 'Food & Beverage'
  | 'Retail'
  | 'Healthcare'
  | 'Logistics'
  | 'Finance'
  | 'Other'

export type GccCountry =
  | 'Bahrain'
  | 'Saudi Arabia'
  | 'UAE'
  | 'Qatar'
  | 'Kuwait'
  | 'Oman'

export interface User {
  id: string
  role: UserRole
  name: string
  email: string
  restricted?: boolean
}

export interface PackageLimits {
  /** GCC markets covered for localization + visitor directory visibility */
  gccMarkets: number
  featured: boolean
  topFeatured: boolean
  analytics: 'none' | 'basic' | 'full'
  priorityReview: boolean
  teamMembers: number
  productSlots: number
}

export interface Package {
  id: string
  tier: PackageTier
  name: string
  price: number
  billingPeriod: 'monthly' | 'yearly'
  features: string[]
  limits: PackageLimits
}

export interface Company {
  id: string
  userId: string
  name: string
  logoUrl: string
  domain: CompanyDomain
  pitch: string
  problemSolved: string
  targetCustomerType: string
  originCountry: string
  targetCountries: GccCountry[]
  status: CompanyStatus
  /** null until the company pays after admin approval */
  packageTier: PackageTier | null
  /** Paid GCC markets — localization + directory visibility per country */
  licensedCountries: GccCountry[]
  roadmapRequestsUsed: number
  profileViews: number
  createdAt: string
}

export interface RoadmapStep {
  order: number
  title: string
  description: string
  category: 'legal' | 'licensing' | 'employment' | 'tax' | 'customs' | 'data' | 'market' | 'culture'
  estimatedWeeks?: number
}

export interface RoadmapExtraFactors {
  companySize?: 'solo' | 'small' | 'medium' | 'large'
  needsLocalPartner?: boolean
  productType?: 'physical' | 'digital' | 'hybrid'
}

export interface RoadmapRequest {
  id: string
  companyId: string
  domain: CompanyDomain
  targetCountry: GccCountry
  extraFactors: RoadmapExtraFactors
  generatedSteps: RoadmapStep[]
  createdAt: string
}

export interface SessionState {
  role: UserRole | null
  userId: string | null
}

export type LocalizationSubmissionStatus = 'draft' | 'submitted' | 'in_review' | 'completed'

export interface LocalizationStepSelection {
  stepOrder: number
  stepTitle: string
  interactionKey: string
  selectedOptionId: string
  selectedOptionLabel: string
}

/** Company choices through the localization process — submitted to operations. */
export interface LocalizationPlanSubmission {
  id: string
  companyId: string
  roadmapRequestId: string
  targetCountry: GccCountry
  selections: LocalizationStepSelection[]
  status: LocalizationSubmissionStatus
  submittedAt: string | null
  updatedAt: string
}
