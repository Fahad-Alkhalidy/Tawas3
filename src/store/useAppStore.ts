import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  seedCompanies,
  seedPackages,
  seedRoadmapRequests,
  seedUsers,
} from '../data/seed'
import { generateLocalizationRoadmap } from '../services/localizationRulesEngine'
import { allGccMarkets, marketsLimitForTier } from '../utils/tierMarkets'
import type {
  Company,
  CompanyDomain,
  CompanyStatus,
  GccCountry,
  Package,
  PackageTier,
  RoadmapExtraFactors,
  LocalizationPlanSubmission,
  LocalizationStepSelection,
  RoadmapRequest,
  SessionState,
  User,
  UserRole,
} from '../types'

function hydrateRoadmaps(requests: RoadmapRequest[]): RoadmapRequest[] {
  return requests.map((r) => ({
    ...r,
    generatedSteps:
      r.generatedSteps.length > 0
        ? r.generatedSteps
        : generateLocalizationRoadmap(r.domain, r.targetCountry, r.extraFactors),
  }))
}

function uid(prefix: string): string {
  return `${prefix}-${crypto.randomUUID().slice(0, 8)}`
}

interface AppState {
  session: SessionState
  users: User[]
  companies: Company[]
  packages: Package[]
  roadmapRequests: RoadmapRequest[]
  localizationSubmissions: LocalizationPlanSubmission[]

  setRole: (role: UserRole) => void
  clearSession: () => void

  getCurrentUser: () => User | undefined
  getCompanyForUser: (userId: string) => Company | undefined
  getPackageByTier: (tier: PackageTier) => Package | undefined

  updateCompanyStatus: (companyId: string, status: CompanyStatus) => void
  updateCompany: (companyId: string, patch: Partial<Company>) => void
  createOrUpdateCompanyProfile: (
    userId: string,
    data: Omit<
      Company,
      'id' | 'userId' | 'status' | 'packageTier' | 'licensedCountries' | 'roadmapRequestsUsed' | 'profileViews' | 'createdAt'
    > & { id?: string },
  ) => Company

  setCustomerRestricted: (userId: string, restricted: boolean) => void
  removeCustomer: (userId: string) => void

  updatePackage: (packageId: string, patch: Partial<Pick<Package, 'name' | 'price' | 'features'>>) => void

  selectPackageForCompany: (
    companyId: string,
    tier: PackageTier,
  ) => { ok: true } | { ok: false; reason: string }

  setLicensedCountries: (
    companyId: string,
    countries: GccCountry[],
  ) => { ok: true } | { ok: false; reason: string }

  /** Admin delivers requirements after reviewing an approved application. */
  adminCreateRoadmapRequest: (
    companyId: string,
    domain: CompanyDomain,
    targetCountry: GccCountry,
    extraFactors: RoadmapExtraFactors,
  ) => { ok: true; request: RoadmapRequest } | { ok: false; reason: string }

  incrementProfileView: (companyId: string) => void

  ensureLocalizationSubmission: (companyId: string, roadmapRequestId: string) => void
  setLocalizationStepChoice: (
    submissionId: string,
    selection: LocalizationStepSelection,
  ) => { ok: true } | { ok: false; reason: string }
  submitLocalizationPlan: (
    submissionId: string,
  ) => { ok: true } | { ok: false; reason: string }
  updateLocalizationSubmissionStatus: (
    submissionId: string,
    status: LocalizationPlanSubmission['status'],
  ) => void

  getApprovedCompanies: () => Company[]
  resetDemoData: () => void
}

const defaultSession: SessionState = { role: null, userId: null }

function roleToUserId(role: UserRole): string {
  if (role === 'admin') return 'u-admin'
  if (role === 'company') return 'u-company-1'
  return 'u-customer-1'
}

function initialState() {
  return {
    session: defaultSession,
    users: [...seedUsers],
    companies: [...seedCompanies],
    packages: [...seedPackages],
    roadmapRequests: hydrateRoadmaps([...seedRoadmapRequests]),
    localizationSubmissions: [],
  }
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...initialState(),

      setRole: (role) => {
        set({ session: { role, userId: roleToUserId(role) } })
      },

      clearSession: () => set({ session: defaultSession }),

      getCurrentUser: () => {
        const { session, users } = get()
        if (!session.userId) return undefined
        return users.find((u) => u.id === session.userId)
      },

      getCompanyForUser: (userId) => get().companies.find((c) => c.userId === userId),

      getPackageByTier: (tier) => get().packages.find((p) => p.tier === tier),

      updateCompanyStatus: (companyId, status) => {
        set((s) => ({
          companies: s.companies.map((c) => {
            if (c.id !== companyId) return c
            const patch: Partial<Company> = { status }
            if (status === 'pending' || status === 'rejected') {
              patch.packageTier = null
              patch.licensedCountries = []
            }
            return { ...c, ...patch }
          }),
        }))
      },

      updateCompany: (companyId, patch) => {
        set((s) => ({
          companies: s.companies.map((c) => (c.id === companyId ? { ...c, ...patch } : c)),
        }))
      },

      createOrUpdateCompanyProfile: (userId, data) => {
        const existing = get().companies.find((c) => c.userId === userId)
        if (existing) {
          const updated = { ...existing, ...data, userId }
          set((s) => ({
            companies: s.companies.map((c) => (c.id === existing.id ? updated : c)),
          }))
          return updated
        }
        const created: Company = {
          id: data.id ?? uid('c'),
          userId,
          name: data.name,
          logoUrl: data.logoUrl,
          domain: data.domain,
          pitch: data.pitch,
          problemSolved: data.problemSolved,
          targetCustomerType: data.targetCustomerType,
          originCountry: data.originCountry,
          targetCountries: data.targetCountries,
          status: 'pending',
          packageTier: null,
          licensedCountries: [],
          roadmapRequestsUsed: 0,
          profileViews: 0,
          createdAt: new Date().toISOString(),
        }
        set((s) => ({ companies: [...s.companies, created] }))
        return created
      },

      setCustomerRestricted: (userId, restricted) => {
        set((s) => ({
          users: s.users.map((u) =>
            u.id === userId && u.role === 'customer' ? { ...u, restricted } : u,
          ),
        }))
      },

      removeCustomer: (userId) => {
        set((s) => ({
          users: s.users.filter((u) => u.id !== userId || u.role !== 'customer'),
        }))
      },

      updatePackage: (packageId, patch) => {
        set((s) => ({
          packages: s.packages.map((p) => (p.id === packageId ? { ...p, ...patch } : p)),
        }))
      },

      selectPackageForCompany: (companyId, tier) => {
        const company = get().companies.find((c) => c.id === companyId)
        if (!company) return { ok: false, reason: 'Company not found' }
        if (company.status !== 'approved') {
          return { ok: false, reason: 'Your application must be approved before you can subscribe.' }
        }
        const licensedCountries = tier === 'enterprise' ? allGccMarkets() : []
        set((s) => ({
          companies: s.companies.map((c) =>
            c.id === companyId ? { ...c, packageTier: tier, licensedCountries } : c,
          ),
        }))
        return { ok: true }
      },

      setLicensedCountries: (companyId, countries) => {
        const company = get().companies.find((c) => c.id === companyId)
        if (!company) return { ok: false, reason: 'Company not found' }
        if (company.status !== 'approved') {
          return { ok: false, reason: 'Application must be approved.' }
        }
        if (!company.packageTier) {
          return { ok: false, reason: 'Purchase a tier before selecting markets.' }
        }
        const limit = marketsLimitForTier(company.packageTier)
        const unique = [...new Set(countries)]
        if (unique.length !== limit) {
          return {
            ok: false,
            reason: `Your plan requires exactly ${limit} market${limit === 1 ? '' : 's'}.`,
          }
        }
        set((s) => ({
          companies: s.companies.map((c) =>
            c.id === companyId ? { ...c, licensedCountries: unique } : c,
          ),
        }))
        return { ok: true }
      },

      adminCreateRoadmapRequest: (companyId, domain, targetCountry, extraFactors) => {
        const company = get().companies.find((c) => c.id === companyId)
        if (!company) return { ok: false, reason: 'Company not found' }
        if (company.status !== 'approved') {
          return {
            ok: false,
            reason: 'Approve the business application before delivering requirements.',
          }
        }
        if (
          company.licensedCountries.length > 0 &&
          !company.licensedCountries.includes(targetCountry)
        ) {
          return {
            ok: false,
            reason: `${targetCountry} is not in this company's paid markets.`,
          }
        }

        const steps = generateLocalizationRoadmap(domain, targetCountry, extraFactors)
        const request: RoadmapRequest = {
          id: uid('rr'),
          companyId,
          domain,
          targetCountry,
          extraFactors,
          generatedSteps: steps,
          createdAt: new Date().toISOString(),
        }

        set((s) => ({
          roadmapRequests: [request, ...s.roadmapRequests],
        }))

        return { ok: true, request }
      },

      incrementProfileView: (companyId) => {
        set((s) => ({
          companies: s.companies.map((c) =>
            c.id === companyId ? { ...c, profileViews: c.profileViews + 1 } : c,
          ),
        }))
      },

      ensureLocalizationSubmission: (companyId, roadmapRequestId) => {
        const existing = get().localizationSubmissions.find(
          (s) => s.companyId === companyId && s.roadmapRequestId === roadmapRequestId,
        )
        if (existing) return
        const request = get().roadmapRequests.find((r) => r.id === roadmapRequestId)
        if (!request || request.companyId !== companyId) return
        const sub: LocalizationPlanSubmission = {
          id: uid('lps'),
          companyId,
          roadmapRequestId,
          targetCountry: request.targetCountry,
          selections: [],
          status: 'draft',
          submittedAt: null,
          updatedAt: new Date().toISOString(),
        }
        set((s) => ({ localizationSubmissions: [...s.localizationSubmissions, sub] }))
      },

      setLocalizationStepChoice: (submissionId, selection) => {
        const sub = get().localizationSubmissions.find((s) => s.id === submissionId)
        if (!sub) return { ok: false, reason: 'Submission not found' }
        if (sub.status !== 'draft') {
          return { ok: false, reason: 'This plan was already submitted to operations.' }
        }
        const rest = sub.selections.filter((s) => s.stepOrder !== selection.stepOrder)
        set((s) => ({
          localizationSubmissions: s.localizationSubmissions.map((item) =>
            item.id === submissionId
              ? {
                  ...item,
                  selections: [...rest, selection],
                  updatedAt: new Date().toISOString(),
                }
              : item,
          ),
        }))
        return { ok: true }
      },

      submitLocalizationPlan: (submissionId) => {
        const sub = get().localizationSubmissions.find((s) => s.id === submissionId)
        if (!sub) return { ok: false, reason: 'Submission not found' }
        if (sub.status !== 'draft') return { ok: false, reason: 'Already submitted.' }
        const request = get().roadmapRequests.find((r) => r.id === sub.roadmapRequestId)
        if (!request) return { ok: false, reason: 'Roadmap not found' }
        const stepCount = request.generatedSteps.length
        if (sub.selections.length < stepCount) {
          return { ok: false, reason: 'Complete every step before submitting.' }
        }
        const orders = new Set(sub.selections.map((s) => s.stepOrder))
        if (orders.size < stepCount) {
          return { ok: false, reason: 'Complete every step before submitting.' }
        }
        set((s) => ({
          localizationSubmissions: s.localizationSubmissions.map((item) =>
            item.id === submissionId
              ? {
                  ...item,
                  status: 'submitted',
                  submittedAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                }
              : item,
          ),
        }))
        return { ok: true }
      },

      updateLocalizationSubmissionStatus: (submissionId, status) => {
        set((s) => ({
          localizationSubmissions: s.localizationSubmissions.map((item) =>
            item.id === submissionId ? { ...item, status, updatedAt: new Date().toISOString() } : item,
          ),
        }))
      },

      getApprovedCompanies: () => get().companies.filter((c) => c.status === 'approved'),

      resetDemoData: () => set(initialState()),
    }),
    {
      name: 'tawase3-mvp',
      version: 5,
      merge: (persisted, current) => ({
        ...current,
        ...(persisted as Partial<AppState>),
        session: defaultSession,
      }),
      migrate: (persisted: unknown, version) => {
        if (persisted && typeof persisted === 'object') {
          const state = persisted as {
            companies?: Company[]
            localizationSubmissions?: LocalizationPlanSubmission[]
            session?: SessionState
          }
          delete state.session
          if (version < 4) {
            state.localizationSubmissions = state.localizationSubmissions ?? []
          }
        }
        if (persisted && typeof persisted === 'object' && 'companies' in persisted) {
          const state = persisted as { companies: Company[] }
          state.companies = state.companies.map((c) => {
            const company = c as Company & { licensedCountries?: GccCountry[] }
            let licensedCountries = company.licensedCountries ?? []
            let packageTier =
              company.status === 'approved' ? (company.packageTier ?? null) : null
            if (version < 2) {
              packageTier = company.status === 'approved' ? (company.packageTier ?? null) : null
            }
            if (version < 3 && packageTier && licensedCountries.length === 0) {
              const limit = marketsLimitForTier(packageTier)
              licensedCountries =
                packageTier === 'enterprise'
                  ? allGccMarkets()
                  : company.targetCountries.slice(0, limit)
            }
            if (company.status !== 'approved') {
              packageTier = null
              licensedCountries = []
            }
            return { ...company, packageTier, licensedCountries }
          })
        }
        return persisted as AppState
      },
      partialize: (state) => ({
        users: state.users,
        companies: state.companies,
        packages: state.packages,
        roadmapRequests: state.roadmapRequests,
        localizationSubmissions: state.localizationSubmissions,
      }),
    },
  ),
)
