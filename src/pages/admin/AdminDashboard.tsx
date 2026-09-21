import { useState } from 'react'
import type { FormEvent } from 'react'
import { useAppStore } from '../../store/useAppStore'
import type { CompanyDomain, CompanyStatus, GccCountry, RoadmapExtraFactors } from '../../types'
import { DOMAINS, GCC_COUNTRIES, STATUS_LABELS } from '../../data/constants'
import { Badge, Button, DataTable, EmptyState, FieldLabel, Input, PageHeader, Select } from '../../components/ui'

type Tab = 'overview' | 'companies' | 'customers' | 'packages' | 'roadmaps' | 'operations'

export function AdminDashboard() {
  const companies = useAppStore((s) => s.companies)
  const users = useAppStore((s) => s.users)
  const packages = useAppStore((s) => s.packages)
  const roadmapRequests = useAppStore((s) => s.roadmapRequests)
  const updateCompanyStatus = useAppStore((s) => s.updateCompanyStatus)
  const setCustomerRestricted = useAppStore((s) => s.setCustomerRestricted)
  const removeCustomer = useAppStore((s) => s.removeCustomer)
  const updatePackage = useAppStore((s) => s.updatePackage)
  const resetDemoData = useAppStore((s) => s.resetDemoData)
  const adminCreateRoadmapRequest = useAppStore((s) => s.adminCreateRoadmapRequest)
  const localizationSubmissions = useAppStore((s) => s.localizationSubmissions)
  const updateLocalizationSubmissionStatus = useAppStore((s) => s.updateLocalizationSubmissionStatus)

  const [tab, setTab] = useState<Tab>('overview')
  const [reviewId, setReviewId] = useState<string | null>(null)
  const customers = users.filter((u) => u.role === 'customer')
  const approvedCompanies = companies.filter((c) => c.status === 'approved')
  const reviewCompany = reviewId ? companies.find((c) => c.id === reviewId) : undefined

  const stats = {
    companies: companies.length,
    customers: customers.length,
    pending: companies.filter((c) => c.status === 'pending').length,
    activePackages: companies.filter((c) => c.packageTier !== 'basic').length,
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <PageHeader
        eyebrow="Administration"
        title="Platform control"
        description="Moderate listings, tune packages, and review localization activity."
        actions={
          <Button variant="secondary" onClick={() => resetDemoData()}>
            Reset demo data
          </Button>
        }
      />

      <div className="flex flex-wrap gap-2 mb-8 border-b border-border pb-4">
        {(
          [
            ['overview', 'Overview'],
            ['companies', 'Applications'],
            ['customers', 'Customers'],
            ['packages', 'Packages'],
            ['roadmaps', 'Roadmap log'],
            ['operations', 'Operations queue'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`text-sm px-3 py-1.5 rounded-sm border transition-colors ${
              tab === id
                ? 'bg-ink text-surface-raised border-ink'
                : 'bg-transparent text-ink-muted border-border hover:border-ink-muted'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Companies', value: stats.companies },
            { label: 'Customers', value: stats.customers },
            { label: 'Pending approvals', value: stats.pending },
            { label: 'Paid-tier companies', value: stats.activePackages },
          ].map((card) => (
            <div key={card.label} className="border border-border bg-surface-raised p-5 rounded-sm">
              <p className="text-xs uppercase tracking-wide text-ink-muted">{card.label}</p>
              <p className="mt-2 font-display text-3xl text-ink">{card.value}</p>
            </div>
          ))}
        </div>
      )}

      {tab === 'companies' && (
        <>
          <p className="text-sm text-ink-muted mb-4 max-w-3xl">
            Review submitted forms, set approval status, then deliver localization requirements under
            the Roadmap log tab (company sees steps only after they subscribe post-approval).
          </p>
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
            <tbody className="divide-y divide-border">
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
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap justify-end gap-1">
                      <Button
                        size="sm"
                        variant={reviewId === c.id ? 'primary' : 'secondary'}
                        onClick={() => setReviewId(c.id)}
                      >
                        Review
                      </Button>
                      {(['approved', 'pending', 'rejected', 'suspended'] as CompanyStatus[]).map(
                        (status) => (
                          <Button
                            key={status}
                            size="sm"
                            variant={c.status === status ? 'primary' : 'ghost'}
                            onClick={() => updateCompanyStatus(c.id, status)}
                          >
                            {status}
                          </Button>
                        ),
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </DataTable>
          {reviewCompany && (
            <div className="mt-6 border border-border bg-surface-raised p-6 rounded-sm">
              <h2 className="font-display text-xl text-ink">Application: {reviewCompany.name}</h2>
              <dl className="mt-4 grid sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="text-ink-muted">Problem solved</dt>
                  <dd className="mt-1">{reviewCompany.problemSolved}</dd>
                </div>
                <div>
                  <dt className="text-ink-muted">Target customers</dt>
                  <dd className="mt-1">{reviewCompany.targetCustomerType}</dd>
                </div>
                <div>
                  <dt className="text-ink-muted">Origin country</dt>
                  <dd className="mt-1">{reviewCompany.originCountry}</dd>
                </div>
                <div>
                  <dt className="text-ink-muted">GCC targets</dt>
                  <dd className="mt-1">{reviewCompany.targetCountries.join(', ')}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-ink-muted">Pitch</dt>
                  <dd className="mt-1 leading-relaxed">{reviewCompany.pitch}</dd>
                </div>
              </dl>
              {reviewCompany.status === 'approved' && (
                <p className="mt-4 text-sm text-teal-dark">
                  Approved — use <strong>Roadmap log</strong> to generate and attach localization
                  requirements. The company pays before viewing the full step list.
                </p>
              )}
            </div>
          )}
        </>
      )}

      {tab === 'customers' && (
        <>
          {customers.length === 0 ? (
            <EmptyState title="No customers" description="Seed data includes demo customer accounts." />
          ) : (
            <DataTable>
              <thead className="bg-sand/50 text-ink-muted uppercase text-xs tracking-wide">
                <tr>
                  <th className="px-4 py-3 font-semibold">Name</th>
                  <th className="px-4 py-3 font-semibold">Email</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {customers.map((u) => (
                  <tr key={u.id}>
                    <td className="px-4 py-3 font-medium">{u.name}</td>
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
        </>
      )}

      {tab === 'packages' && (
        <div className="grid lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <PackageEditor key={pkg.id} pkg={pkg} onSave={updatePackage} />
          ))}
        </div>
      )}

      {tab === 'operations' && (
        <OperationsQueue
          submissions={localizationSubmissions}
          companies={companies}
          onStatusChange={updateLocalizationSubmissionStatus}
        />
      )}

      {tab === 'roadmaps' && (
        <>
          <AdminAddRoadmapForm
            companies={approvedCompanies}
            onCreate={adminCreateRoadmapRequest}
          />
          {roadmapRequests.length === 0 ? (
            <EmptyState
              title="No roadmap requests yet"
              description="Add one above or wait for companies to submit from their dashboard."
            />
          ) : (
            <DataTable>
              <thead className="bg-sand/50 text-ink-muted uppercase text-xs tracking-wide">
                <tr>
                  <th className="px-4 py-3 font-semibold">Date</th>
                  <th className="px-4 py-3 font-semibold">Company</th>
                  <th className="px-4 py-3 font-semibold">Domain</th>
                  <th className="px-4 py-3 font-semibold">Country</th>
                  <th className="px-4 py-3 font-semibold">Steps</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {roadmapRequests.map((r) => {
                  const company = companies.find((c) => c.id === r.companyId)
                  return (
                    <tr key={r.id}>
                      <td className="px-4 py-3 text-ink-muted whitespace-nowrap">
                        {new Date(r.createdAt).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 font-medium">{company?.name ?? r.companyId}</td>
                      <td className="px-4 py-3">{r.domain}</td>
                      <td className="px-4 py-3">{r.targetCountry}</td>
                      <td className="px-4 py-3">{r.generatedSteps.length}</td>
                    </tr>
                  )
                })}
              </tbody>
            </DataTable>
          )}
        </>
      )}
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
        title="No localization filings yet"
        description="When companies complete every process step and submit, their choices appear here."
      />
    )
  }

  return (
    <div className="space-y-4">
      {sorted.map((sub) => {
        const company = companies.find((c) => c.id === sub.companyId)
        const expanded = expandedId === sub.id
        return (
          <article key={sub.id} className="border border-border bg-surface-raised rounded-sm">
            <header className="p-4 flex flex-wrap items-center justify-between gap-3 border-b border-border">
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
              <dl className="p-4 grid gap-3 text-sm">
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

function AdminAddRoadmapForm({
  companies,
  onCreate,
}: {
  companies: ReturnType<typeof useAppStore.getState>['companies']
  onCreate: ReturnType<typeof useAppStore.getState>['adminCreateRoadmapRequest']
}) {
  const [companyId, setCompanyId] = useState(companies[0]?.id ?? '')
  const [domain, setDomain] = useState<CompanyDomain>('Manufacturing')
  const [targetCountry, setTargetCountry] = useState<GccCountry>('Bahrain')
  const [extra, setExtra] = useState<RoadmapExtraFactors>({
    companySize: 'small',
    needsLocalPartner: false,
    productType: 'physical',
  })
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    if (!companyId) {
      setError('Select a company.')
      return
    }
    const result = onCreate(companyId, domain, targetCountry, extra)
    if (!result.ok) {
      setError(result.reason)
      return
    }
    const name = companies.find((c) => c.id === companyId)?.name ?? 'Company'
    setSuccess(
      `Requirements delivered for ${name} (${result.request.generatedSteps.length} steps). Visible to the company after they subscribe.`,
    )
  }

  if (companies.length === 0) {
    return (
      <p className="mb-6 text-sm text-ink-muted border border-border bg-surface-raised p-4 rounded-sm">
        No approved applications yet — approve a business under Applications before delivering
        requirements.
      </p>
    )
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mb-8 border border-border bg-surface-raised p-5 md:p-6 rounded-sm space-y-4"
    >
      <div>
        <h2 className="font-display text-lg text-ink">Deliver requirements (approved businesses)</h2>
        <p className="mt-1 text-sm text-ink-muted">
          Generate localization steps after you approve an application. Companies unlock the detail
          once they pay.
        </p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="md:col-span-2 lg:col-span-1">
          <FieldLabel htmlFor="adm-co">Company</FieldLabel>
          <Select id="adm-co" value={companyId} onChange={(e) => setCompanyId(e.target.value)}>
            {companies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.status})
              </option>
            ))}
          </Select>
        </div>
        <div>
          <FieldLabel htmlFor="adm-dom">Domain</FieldLabel>
          <Select id="adm-dom" value={domain} onChange={(e) => setDomain(e.target.value as CompanyDomain)}>
            {DOMAINS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <FieldLabel htmlFor="adm-cty">Target country</FieldLabel>
          <Select
            id="adm-cty"
            value={targetCountry}
            onChange={(e) => setTargetCountry(e.target.value as GccCountry)}
          >
            {GCC_COUNTRIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <FieldLabel htmlFor="adm-size">Company size</FieldLabel>
          <Select
            id="adm-size"
            value={extra.companySize}
            onChange={(e) =>
              setExtra({ ...extra, companySize: e.target.value as RoadmapExtraFactors['companySize'] })
            }
          >
            <option value="solo">Solo</option>
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </Select>
        </div>
        <div>
          <FieldLabel htmlFor="adm-prod">Product type</FieldLabel>
          <Select
            id="adm-prod"
            value={extra.productType}
            onChange={(e) =>
              setExtra({ ...extra, productType: e.target.value as RoadmapExtraFactors['productType'] })
            }
          >
            <option value="physical">Physical</option>
            <option value="digital">Digital</option>
            <option value="hybrid">Hybrid</option>
          </Select>
        </div>
        <div className="flex items-end">
          <label className="flex items-center gap-2 text-sm text-ink-muted pb-2">
            <input
              type="checkbox"
              checked={!!extra.needsLocalPartner}
              onChange={(e) => setExtra({ ...extra, needsLocalPartner: e.target.checked })}
              className="accent-teal"
            />
            Needs local partner
          </label>
        </div>
      </div>
      {error && <p className="text-sm text-danger">{error}</p>}
      {success && <p className="text-sm text-success">{success}</p>}
      <Button type="submit">Generate &amp; attach roadmap</Button>
    </form>
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

function PackageEditor({
  pkg,
  onSave,
}: {
  pkg: ReturnType<typeof useAppStore.getState>['packages'][0]
  onSave: (id: string, patch: { name?: string; price?: number; features?: string[] }) => void
}) {
  const [name, setName] = useState(pkg.name)
  const [price, setPrice] = useState(String(pkg.price))
  const [featuresText, setFeaturesText] = useState(pkg.features.join('\n'))

  return (
    <div className="border border-border bg-surface-raised p-5 rounded-sm flex flex-col gap-4">
      <div>
        <p className="text-xs uppercase tracking-wide text-teal font-semibold capitalize">{pkg.tier}</p>
        <FieldLabel htmlFor={`name-${pkg.id}`}>Display name</FieldLabel>
        <Input id={`name-${pkg.id}`} value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div>
        <FieldLabel htmlFor={`price-${pkg.id}`}>Price (USD / {pkg.billingPeriod})</FieldLabel>
        <Input id={`price-${pkg.id}`} type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
      </div>
      <div>
        <FieldLabel htmlFor={`feat-${pkg.id}`}>Features (one per line)</FieldLabel>
        <textarea
          id={`feat-${pkg.id}`}
          className="w-full min-h-[120px] bg-surface-raised border border-border rounded-sm px-3 py-2 text-sm"
          value={featuresText}
          onChange={(e) => setFeaturesText(e.target.value)}
        />
      </div>
      <Button
        onClick={() =>
          onSave(pkg.id, {
            name,
            price: Number(price) || 0,
            features: featuresText.split('\n').map((f) => f.trim()).filter(Boolean),
          })
        }
      >
        Save package
      </Button>
    </div>
  )
}
