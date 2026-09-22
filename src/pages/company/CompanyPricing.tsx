import { Link, useNavigate } from 'react-router-dom'
import { GCC_COVERAGE_OPTIONS, PLATFORM_FEATURES } from '../../data/platformFeatures'
import { useAppStore } from '../../store/useAppStore'
import type { PackageTier } from '../../types'
import { Badge, Button, PageHeader } from '../../components/ui'

export function CompanyPricing() {
  const navigate = useNavigate()
  const session = useAppStore((s) => s.session)
  const getCompanyForUser = useAppStore((s) => s.getCompanyForUser)
  const selectPackageForCompany = useAppStore((s) => s.selectPackageForCompany)

  const company = session.userId ? getCompanyForUser(session.userId) : undefined

  const simulatePurchase = (tier: PackageTier) => {
    if (!company) {
      alert('Submit your application first.')
      return
    }
    const result = selectPackageForCompany(company.id, tier)
    if (!result.ok) {
      alert(result.reason)
      return
    }
    if (tier === 'enterprise') {
      alert('Selection saved. All GCC markets are active.')
      navigate('/company/dashboard')
    } else {
      alert('Selection saved. Choose your GCC market(s) next.')
      navigate('/company/markets')
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <PageHeader
        eyebrow="After approval"
        title="Choose your GCC coverage"
        description="Every option below includes the full platform. You only decide how many GCC countries you want to localize in and appear in for visitors."
        actions={
          <Link to="/company/dashboard">
            <Button variant="secondary">Dashboard</Button>
          </Link>
        }
      />

      {!company && (
        <p className="mb-8 text-sm text-terracotta">
          Submit your application first.{' '}
          <Link to="/company/onboarding" className="underline text-teal-dark">
            Application form
          </Link>
        </p>
      )}

      <section className="mb-10 border border-border bg-surface-raised p-6 md:p-8 rounded-sm">
        <h2 className="font-display text-xl text-ink">What Tawas3 provides</h2>
        <p className="mt-2 text-sm text-ink-muted max-w-2xl">
          All plans include the same platform capabilities. Your selection only sets how many GCC
          countries you operate in.
        </p>
        <ul className="mt-6 grid sm:grid-cols-2 gap-x-8 gap-y-3 text-sm text-ink-muted">
          {PLATFORM_FEATURES.map((feature) => (
            <li key={feature} className="flex gap-2">
              <span className="text-teal shrink-0">•</span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </section>

      <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">
        Select coverage
      </h2>
      <div className="grid lg:grid-cols-3 gap-0 border border-border rounded-sm overflow-hidden bg-surface-raised">
        {GCC_COVERAGE_OPTIONS.map((option, index) => {
          const isCurrent = company?.packageTier === option.tier
          return (
            <article
              key={option.tier}
              className={`p-6 md:p-8 flex flex-col ${
                index < GCC_COVERAGE_OPTIONS.length - 1 ? 'lg:border-r border-border' : ''
              } ${index > 0 ? 'border-t lg:border-t-0 border-border' : ''} ${
                isCurrent ? 'bg-teal-soft/30' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-display text-2xl text-ink">{option.label}</h3>
                {isCurrent && <Badge tone="teal">Selected</Badge>}
              </div>
              <p className="mt-3 text-sm text-ink-muted leading-relaxed flex-1">{option.description}</p>
              <Button
                className="mt-8 w-full"
                variant={isCurrent ? 'secondary' : 'primary'}
                disabled={!company}
                onClick={() => simulatePurchase(option.tier)}
              >
                {isCurrent ? 'Continue' : 'Select'}
              </Button>
            </article>
          )
        })}
      </div>
    </div>
  )
}
