import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { STATUS_LABELS } from '../../data/constants'
import { useAppStore } from '../../store/useAppStore'
import type { RoadmapRequest } from '../../types'
import {
  canViewRequirements,
  companyHasPaid,
  companyMarketsConfigured,
  companyMarketLimit,
} from '../../utils/companyAccess'
import {
  LocalizationProcessEmpty,
  LocalizationProcessPanel,
} from '../../components/LocalizationProcessPanel'
import { Badge, Button, EmptyState, PageHeader, Select } from '../../components/ui'

export function CompanyDashboard() {
  const session = useAppStore((s) => s.session)
  const getCompanyForUser = useAppStore((s) => s.getCompanyForUser)
  const getPackageByTier = useAppStore((s) => s.getPackageByTier)
  const roadmapRequests = useAppStore((s) => s.roadmapRequests)

  const company = session.userId ? getCompanyForUser(session.userId) : undefined
  const pkg = company?.packageTier ? getPackageByTier(company.packageTier) : undefined
  const paid = company ? companyHasPaid(company) : false
  const marketsReady = company ? companyMarketsConfigured(company) : false
  const canView = company ? canViewRequirements(company) : false
  const limit = company ? companyMarketLimit(company) : 0

  const companyRequests = useMemo(() => {
    if (!company) return []
    return roadmapRequests
      .filter(
        (r) =>
          r.companyId === company.id &&
          (marketsReady ? company.licensedCountries.includes(r.targetCountry) : true),
      )
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  }, [company, roadmapRequests, marketsReady])

  const [selectedRequest, setSelectedRequest] = useState<RoadmapRequest | null>(null)

  useEffect(() => {
    setSelectedRequest(companyRequests[0] ?? null)
  }, [companyRequests])

  if (!company) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <EmptyState
          title="No application on file"
          description="Submit your business details for admin review. There is no payment at this stage."
        />
        <div className="mt-6 text-center">
          <Link to="/company/onboarding">
            <Button>Start application</Button>
          </Link>
        </div>
      </div>
    )
  }

  const statusTone =
    company.status === 'approved'
      ? 'success'
      : company.status === 'pending'
        ? 'warning'
        : company.status === 'rejected'
          ? 'danger'
          : 'neutral'

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <PageHeader
        eyebrow="Company workspace"
        title={company.name}
        description="Apply free → admin approval → pay for GCC coverage → access localization steps and directory listings in your chosen markets."
        actions={
          <Link to="/company/onboarding">
            <Button variant="secondary">Edit application</Button>
          </Link>
        }
      />

      <div className="grid lg:grid-cols-[1fr_1.1fr] gap-8">
        <aside className="space-y-6">
          <div className="border border-border bg-surface-raised p-5 rounded-sm">
            <p className="text-xs uppercase tracking-wide text-ink-muted">Application status</p>
            <div className="mt-2 flex items-center gap-2">
              <Badge tone={statusTone}>{STATUS_LABELS[company.status]}</Badge>
            </div>
            {company.status === 'pending' && (
              <p className="mt-4 text-sm text-ink-muted leading-relaxed">
                Your form is with the Tawas3 team. Pricing and localization unlock after approval.
              </p>
            )}
            {company.status === 'approved' && !paid && (
              <p className="mt-4 text-sm text-ink-muted leading-relaxed">
                Approved — select a tier to start localization and appear in the customer directory for
                your chosen GCC countries.
              </p>
            )}
            {company.status === 'approved' && paid && !marketsReady && (
              <p className="mt-4 text-sm text-terracotta leading-relaxed">
                Tier active ({pkg?.name}). Choose {limit} market{limit === 1 ? '' : 's'} to continue.
              </p>
            )}
            {marketsReady && (
              <p className="mt-4 text-sm text-ink-muted leading-relaxed">
                Active: {pkg?.name}. Listed &amp; localized for{' '}
                <strong>{company.licensedCountries.join(', ')}</strong>.
              </p>
            )}
          </div>

          {company.status === 'approved' && !paid && (
            <div className="border border-teal/30 bg-teal-soft/40 p-5 rounded-sm">
              <h2 className="font-display text-lg text-ink">Choose a tier</h2>
              <p className="mt-2 text-sm text-ink-muted">
                1, 3, or all GCC countries — each includes the localization process and matching directory
                visibility.
              </p>
              <Link to="/company/pricing" className="inline-block mt-4">
                <Button>View tiers</Button>
              </Link>
            </div>
          )}

          {paid && !marketsReady && company.packageTier !== 'enterprise' && (
            <div className="border border-border bg-surface-raised p-5 rounded-sm">
              <h2 className="font-display text-lg text-ink">Select markets</h2>
              <p className="mt-2 text-sm text-ink-muted">
                Pick exactly {limit} GCC {limit === 1 ? 'country' : 'countries'} for localization and
                customer listings.
              </p>
              <Link to="/company/markets" className="inline-block mt-4">
                <Button>Choose countries</Button>
              </Link>
            </div>
          )}

          {paid && (
            <div className="text-sm">
              <Link to="/company/pricing" className="text-teal-dark underline">
                Change tier
              </Link>
              {marketsReady && company.packageTier !== 'enterprise' && (
                <>
                  {' · '}
                  <Link to="/company/markets" className="text-teal-dark underline">
                    Update markets
                  </Link>
                </>
              )}
            </div>
          )}
        </aside>

        <section className="border border-border bg-surface-raised rounded-sm min-h-[420px] flex flex-col">
          <div className="px-5 py-4 border-b border-border flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-display text-lg">Localization process</h2>
            {canView && companyRequests.length > 1 && (
              <Select
                className="w-auto max-w-[220px]"
                value={selectedRequest?.id ?? ''}
                onChange={(e) => {
                  const req = companyRequests.find((r) => r.id === e.target.value)
                  setSelectedRequest(req ?? null)
                }}
              >
                {companyRequests.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.targetCountry} — {new Date(r.createdAt).toLocaleDateString()}
                  </option>
                ))}
              </Select>
            )}
          </div>

          {company.status !== 'approved' ? (
            <div className="p-8 flex-1 flex items-center justify-center">
              <EmptyState
                title="Process locked"
                description="An admin must approve your application first."
              />
            </div>
          ) : !paid ? (
            <div className="p-8 flex-1 flex flex-col items-center justify-center text-center">
              <EmptyState title="Pay for a tier" description="Localization steps unlock after you purchase a GCC market package." />
              <Link to="/company/pricing" className="mt-4">
                <Button>View tiers</Button>
              </Link>
            </div>
          ) : !marketsReady ? (
            <div className="p-8 flex-1 flex flex-col items-center justify-center text-center">
              <EmptyState
                title="Choose your GCC markets"
                description="Confirm your countries to start the localization process and directory listings."
              />
              <Link to="/company/markets" className="mt-4">
                <Button>Choose countries</Button>
              </Link>
            </div>
          ) : !selectedRequest ? (
            <LocalizationProcessEmpty />
          ) : (
            <LocalizationProcessPanel companyId={company.id} request={selectedRequest} />
          )}
        </section>
      </div>
    </div>
  )
}
