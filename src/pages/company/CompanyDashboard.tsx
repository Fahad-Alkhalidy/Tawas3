import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { STATUS_LABELS } from '../../data/constants'
import { useAppStore } from '../../store/useAppStore'
import type { RoadmapRequest } from '../../types'
import {
  canViewRequirements,
  companyHasPaid,
  companyMarketsConfigured,
} from '../../utils/companyAccess'
import {
  LocalizationProcessEmpty,
  LocalizationProcessPanel,
} from '../../components/LocalizationProcessPanel'
import { Badge, Button, EmptyState, PageHeader, Select } from '../../components/ui'

export function CompanyDashboard() {
  const session = useAppStore((s) => s.session)
  const getCompanyForUser = useAppStore((s) => s.getCompanyForUser)
  const roadmapRequests = useAppStore((s) => s.roadmapRequests)

  const company = session.userId ? getCompanyForUser(session.userId) : undefined
  const paid = company ? companyHasPaid(company) : false
  const marketsReady = company ? companyMarketsConfigured(company) : false
  const canView = company ? canViewRequirements(company) : false

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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <PageHeader
        title={company.name}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={statusTone}>{STATUS_LABELS[company.status]}</Badge>
            <Link to="/company/onboarding">
              <Button variant="secondary" size="sm">
                Edit application
              </Button>
            </Link>
            {company.status === 'approved' && !paid && (
              <Link to="/company/pricing">
                <Button size="sm">Subscribe</Button>
              </Link>
            )}
            {paid && !marketsReady && (
              <Link to="/company/markets">
                <Button size="sm">Markets</Button>
              </Link>
            )}
          </div>
        }
      />

      <section className="bg-surface-raised rounded-lg shadow-soft min-h-[420px] flex flex-col">
        <div className="px-5 py-4 border-b border-border/50 flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-display text-lg">Localization</h2>
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
                  {r.targetCountry} · {new Date(r.createdAt).toLocaleDateString()}
                </option>
              ))}
            </Select>
          )}
        </div>

        {company.status !== 'approved' ? (
          <div className="p-8 flex-1 flex items-center justify-center">
            <EmptyState title="Process locked" description="An admin must approve your application first." />
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
  )
}
