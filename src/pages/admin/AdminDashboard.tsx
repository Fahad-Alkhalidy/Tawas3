import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../../store/useAppStore'
import type { CompanyStatus } from '../../types'
import { DEMO_COMPANY_ID } from '../../data/seed'
import { STATUS_LABELS } from '../../data/constants'
import {
  companyMarketsConfigured,
  companyHasPaid,
  isListedForCustomers,
} from '../../utils/companyAccess'
import { buildPresentationSteps, getDemoCompany } from '../../utils/presentationFlow'
import { enterDemoSession } from '../../utils/demoSession'
import { Badge, Button, DataTable, EmptyState, PageHeader } from '../../components/ui'

type Tab = 'overview' | 'companies' | 'customers' | 'operations'

export function AdminDashboard() {
  const navigate = useNavigate()
  const companies = useAppStore((s) => s.companies)
  const users = useAppStore((s) => s.users)
  const roadmapRequests = useAppStore((s) => s.roadmapRequests)
  const updateCompanyStatus = useAppStore((s) => s.updateCompanyStatus)
  const adminPrepareLocalizationForCompany = useAppStore((s) => s.adminPrepareLocalizationForCompany)
  const setCustomerRestricted = useAppStore((s) => s.setCustomerRestricted)
  const removeCustomer = useAppStore((s) => s.removeCustomer)
  const resetDemoData = useAppStore((s) => s.resetDemoData)
  const setRole = useAppStore((s) => s.setRole)
  const localizationSubmissions = useAppStore((s) => s.localizationSubmissions)
  const updateLocalizationSubmissionStatus = useAppStore((s) => s.updateLocalizationSubmissionStatus)

  const [tab, setTab] = useState<Tab>('overview')
  const [reviewId, setReviewId] = useState<string | null>(DEMO_COMPANY_ID)
  const [actionMsg, setActionMsg] = useState<string | null>(null)

  const customers = users.filter((u) => u.role === 'customer')
  const demoCompany = getDemoCompany(companies)
  const reviewCompany = reviewId ? companies.find((c) => c.id === reviewId) : undefined

  const steps = useMemo(
    () => buildPresentationSteps(demoCompany, roadmapRequests, localizationSubmissions),
    [demoCompany, roadmapRequests, localizationSubmissions],
  )

  const currentStep = steps.find((s) => s.current)

  useEffect(() => {
    if (companies.length === 1 && !reviewId) {
      setReviewId(companies[0].id)
    }
  }, [companies, reviewId])

  const restartPresentation = () => {
    resetDemoData()
    setReviewId(DEMO_COMPANY_ID)
    setActionMsg('Presentation reset — one fresh application, step 1.')
    setTab('overview')
    navigate('/')
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <PageHeader
        eyebrow="Administration"
        title="Presentation mode"
        description="One example company (Gulf Thread Manufacturing), starting right after they submit their survey. Follow the steps below, then switch roles in the header."
        actions={
          <Button variant="secondary" onClick={restartPresentation}>
            Restart presentation
          </Button>
        }
      />

      {actionMsg && (
        <p className="mb-6 text-sm text-teal-dark bg-teal-soft/50 rounded-lg px-4 py-3 shadow-card">
          {actionMsg}
        </p>
      )}

      <div className="flex flex-wrap gap-2 mb-8 pb-4">
        {(
          [
            ['overview', 'Walkthrough'],
            ['companies', 'Applications'],
            ['customers', 'Customers'],
            ['operations', 'Operations queue'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`text-sm px-3 py-1.5 rounded-md transition-colors shadow-card ${
              tab === id ? 'bg-ink text-surface-raised' : 'bg-surface-raised text-ink-muted hover:text-ink'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="space-y-6">
          {currentStep && (
            <div className="rounded-xl bg-ink text-sand p-6 md:p-8 shadow-elevated">
              <p className="text-xs uppercase tracking-widest text-teal/90 mb-2">Up next</p>
              <p className="font-display text-2xl md:text-3xl">{currentStep.title}</p>
              <p className="mt-3 text-sand/85 max-w-2xl leading-relaxed">{currentStep.hint}</p>
              <p className="mt-4 text-xs uppercase tracking-wide text-sand/55">
                Switch to:{' '}
                <span className="text-sand capitalize">{currentStep.who}</span>
              </p>
            </div>
          )}

          <ol className="space-y-3">
            {steps.map((step) => (
              <li
                key={step.id}
                className={`rounded-xl px-5 py-4 flex flex-wrap items-start gap-3 shadow-card ${
                  step.current ? 'bg-teal-soft/60 ring-2 ring-teal/25' : 'bg-surface-raised'
                } ${step.done ? 'opacity-80' : ''}`}
              >
                <span
                  className={`font-display text-lg w-8 h-8 flex items-center justify-center rounded-md shrink-0 ${
                    step.done ? 'bg-teal text-ink' : 'bg-sand text-ink-muted'
                  }`}
                >
                  {step.done ? '✓' : step.order}
                </span>
                <div className="flex-1 min-w-[200px]">
                  <p className="font-medium text-ink">{step.title}</p>
                  <p className="text-sm text-ink-muted mt-0.5">{step.hint}</p>
                </div>
                <Badge tone={step.who === 'admin' ? 'teal' : step.who === 'company' ? 'neutral' : 'success'}>
                  {step.who}
                </Badge>
              </li>
            ))}
          </ol>
        </div>
      )}

      {tab === 'companies' && (
        <>
          <p className="text-sm text-ink-muted mb-4 max-w-3xl">
            You should see <strong className="text-ink">one</strong> pending application — Gulf Thread
            Manufacturing. Approve it, then after they subscribe and pick Bahrain, use{' '}
            <strong className="text-ink">Prepare localization steps</strong>.
          </p>
          {companies.length === 0 ? (
            <EmptyState
              title="No application"
              description="Restart presentation or have the company submit the survey."
            />
          ) : (
            <>
              <DataTable>
                <thead className="bg-sand/50 text-ink-muted uppercase text-xs tracking-wide">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Business</th>
                    <th className="px-4 py-3 font-semibold">Domain</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold">Tier / markets</th>
                    <th className="px-4 py-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {companies.map((c) => (
                    <tr key={c.id} className="hover:bg-sand/20">
                      <td className="px-4 py-3">
                        <p className="font-medium text-ink">{c.name}</p>
                        <p className="text-xs text-ink-muted line-clamp-1">{c.pitch}</p>
                      </td>
                      <td className="px-4 py-3 text-ink-muted">{c.domain}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={c.status} />
                      </td>
                      <td className="px-4 py-3 text-ink-muted text-xs">
                        <span className="capitalize block">{c.packageTier ?? 'Not paid'}</span>
                        {c.licensedCountries.length > 0 && (
                          <span className="block mt-1">{c.licensedCountries.join(', ')}</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button
                          size="sm"
                          variant={reviewId === c.id ? 'primary' : 'secondary'}
                          onClick={() => setReviewId(c.id)}
                        >
                          Review
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </DataTable>
              {reviewCompany && (
                <ApplicationReview
                  company={reviewCompany}
                  roadmapCount={roadmapRequests.filter((r) => r.companyId === reviewCompany.id).length}
                  onApprove={() => {
                    updateCompanyStatus(reviewCompany.id, 'approved')
                    setActionMsg('Approved — switch to Company to subscribe and choose Bahrain.')
                  }}
                  onPrepare={() => {
                    const result = adminPrepareLocalizationForCompany(reviewCompany.id)
                    if (!result.ok) {
                      setActionMsg(result.reason)
                      return
                    }
                    setActionMsg(
                      result.created > 0
                        ? `Localization steps sent for ${result.created} market(s). Switch to Company to complete the process.`
                        : 'Steps were already prepared for this company.',
                    )
                  }}
                />
              )}
            </>
          )}
        </>
      )}

      {tab === 'customers' && (
        <>
          <p className="text-sm text-ink-muted mb-4">
            Demo buyer account for the directory. Restrict or remove only if you need to show moderation.
          </p>
          {customers.length === 0 ? (
            <EmptyState title="No customers" description="Restart presentation to restore the demo buyer." />
          ) : (
            <DataTable>
              <thead className="bg-sand/50 text-ink-muted uppercase text-xs tracking-wide">
                <tr>
                  <th className="px-4 py-3 font-semibold">Email</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {customers.map((u) => (
                  <tr key={u.id}>
                    <td className="px-4 py-3 text-ink-muted">{u.email}</td>
                    <td className="px-4 py-3">
                      {u.restricted ? (
                        <Badge tone="danger">Restricted</Badge>
                      ) : (
                        <Badge tone="success">Active</Badge>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right space-x-1">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setCustomerRestricted(u.id, !u.restricted)}
                      >
                        {u.restricted ? 'Unrestrict' : 'Restrict'}
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => removeCustomer(u.id)}>
                        Remove
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </DataTable>
          )}
          {demoCompany && isListedForCustomers(demoCompany) && (
            <div className="mt-6">
              <Button
                variant="secondary"
                onClick={() => {
                  enterDemoSession(setRole, 'customer', navigate)
                  setActionMsg(null)
                }}
              >
                Open directory as customer
              </Button>
            </div>
          )}
        </>
      )}

      {tab === 'operations' && (
        <OperationsQueue
          submissions={localizationSubmissions}
          companies={companies}
          onStatusChange={updateLocalizationSubmissionStatus}
        />
      )}
    </div>
  )
}

function ApplicationReview({
  company,
  roadmapCount,
  onApprove,
  onPrepare,
}: {
  company: NonNullable<ReturnType<typeof getDemoCompany>>
  roadmapCount: number
  onApprove: () => void
  onPrepare: () => void
}) {
  const paid = companyHasPaid(company)
  const markets = companyMarketsConfigured(company)

  return (
    <div className="mt-6 bg-surface-raised rounded-xl p-6 md:p-8 shadow-soft">
      <h2 className="font-display text-xl text-ink">Application: {company.name}</h2>
      <dl className="mt-4 grid sm:grid-cols-2 gap-4 text-sm">
        <div>
          <dt className="text-ink-muted">Problem solved</dt>
          <dd className="mt-1">{company.problemSolved}</dd>
        </div>
        <div>
          <dt className="text-ink-muted">Target customers</dt>
          <dd className="mt-1">{company.targetCustomerType}</dd>
        </div>
        <div>
          <dt className="text-ink-muted">Origin country</dt>
          <dd className="mt-1">{company.originCountry}</dd>
        </div>
        <div>
          <dt className="text-ink-muted">GCC targets</dt>
          <dd className="mt-1">{company.targetCountries.join(', ')}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-ink-muted">Pitch</dt>
          <dd className="mt-1 leading-relaxed">{company.pitch}</dd>
        </div>
      </dl>

      <div className="mt-6 flex flex-wrap gap-2">
        {company.status === 'pending' && (
          <Button onClick={onApprove}>Approve application</Button>
        )}
        {company.status === 'approved' && !markets && (
          <p className="text-sm text-ink-muted w-full">
            Waiting for the company to subscribe and confirm their market (demo: Single GCC → Bahrain).
          </p>
        )}
        {company.status === 'approved' && markets && (
          <Button onClick={onPrepare}>
            {roadmapCount > 0 ? 'Refresh localization steps' : 'Prepare localization steps'}
          </Button>
        )}
        {roadmapCount > 0 && (
          <Badge tone="success">{roadmapCount} market step pack(s) attached</Badge>
        )}
        {paid && !markets && (
          <Badge tone="warning">Paid — markets not confirmed yet</Badge>
        )}
      </div>
    </div>
  )
}

function OperationsQueue({
  submissions,
  companies,
  onStatusChange,
}: {
  submissions: ReturnType<typeof useAppStore.getState>['localizationSubmissions']
  companies: ReturnType<typeof useAppStore.getState>['companies']
  onStatusChange: ReturnType<typeof useAppStore.getState>['updateLocalizationSubmissionStatus']
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const sorted = [...submissions].sort((a, b) => {
    const ta = a.submittedAt ?? a.updatedAt
    const tb = b.submittedAt ?? b.updatedAt
    return tb.localeCompare(ta)
  })

  if (sorted.length === 0) {
    return (
      <EmptyState
        title="Nothing in the queue yet"
        description="After the company submits their localization choices, the filing appears here for you to review."
      />
    )
  }

  return (
    <div className="space-y-4">
      {sorted.map((sub) => {
        const company = companies.find((c) => c.id === sub.companyId)
        const expanded = expandedId === sub.id
        return (
          <article key={sub.id} className="bg-surface-raised rounded-xl shadow-soft overflow-hidden">
            <header className="p-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-medium text-ink">{company?.name ?? sub.companyId}</p>
                <p className="text-sm text-ink-muted">
                  {sub.targetCountry} · {sub.selections.length} choices ·{' '}
                  {sub.submittedAt
                    ? `Submitted ${new Date(sub.submittedAt).toLocaleString()}`
                    : 'Draft (not submitted)'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  tone={
                    sub.status === 'submitted'
                      ? 'warning'
                      : sub.status === 'in_review'
                        ? 'teal'
                        : sub.status === 'completed'
                          ? 'success'
                          : 'neutral'
                  }
                >
                  {sub.status.replace('_', ' ')}
                </Badge>
                <Button size="sm" variant="secondary" onClick={() => setExpandedId(expanded ? null : sub.id)}>
                  {expanded ? 'Hide' : 'View choices'}
                </Button>
                {sub.status === 'submitted' && (
                  <Button size="sm" onClick={() => onStatusChange(sub.id, 'in_review')}>
                    Mark in review
                  </Button>
                )}
                {sub.status === 'in_review' && (
                  <Button size="sm" onClick={() => onStatusChange(sub.id, 'completed')}>
                    Mark completed
                  </Button>
                )}
              </div>
            </header>
            {expanded && (
              <dl className="px-4 pb-4 grid gap-3 text-sm border-t border-border/40 pt-4">
                {sub.selections
                  .slice()
                  .sort((a, b) => a.stepOrder - b.stepOrder)
                  .map((sel) => (
                    <div key={sel.stepOrder} className="border-l-2 border-teal/40 pl-3">
                      <dt className="text-ink-muted">
                        Step {sel.stepOrder}: {sel.stepTitle}
                      </dt>
                      <dd className="font-medium text-ink mt-0.5">{sel.selectedOptionLabel}</dd>
                    </div>
                  ))}
              </dl>
            )}
          </article>
        )
      })}
    </div>
  )
}

function StatusBadge({ status }: { status: CompanyStatus }) {
  const tone =
    status === 'approved'
      ? 'success'
      : status === 'pending'
        ? 'warning'
        : status === 'rejected'
          ? 'danger'
          : 'neutral'
  return <Badge tone={tone}>{STATUS_LABELS[status] ?? status}</Badge>
}
