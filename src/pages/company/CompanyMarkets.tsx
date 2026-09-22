import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { GCC_COUNTRIES } from '../../data/constants'
import { useAppStore } from '../../store/useAppStore'
import type { GccCountry } from '../../types'
import { companyHasPaid, companyMarketLimit } from '../../utils/companyAccess'
import { allGccMarkets } from '../../utils/tierMarkets'
import { Button, EmptyState, FieldLabel, PageHeader } from '../../components/ui'

export function CompanyMarkets() {
  const navigate = useNavigate()
  const session = useAppStore((s) => s.session)
  const getCompanyForUser = useAppStore((s) => s.getCompanyForUser)
  const getPackageByTier = useAppStore((s) => s.getPackageByTier)
  const setLicensedCountries = useAppStore((s) => s.setLicensedCountries)

  const company = session.userId ? getCompanyForUser(session.userId) : undefined
  const limit = company ? companyMarketLimit(company) : 0
  const pkg = company?.packageTier ? getPackageByTier(company.packageTier) : undefined

  const [selected, setSelected] = useState<GccCountry[]>(company?.licensedCountries ?? [])

  useEffect(() => {
    if (company?.packageTier === 'enterprise') {
      setSelected(allGccMarkets())
    } else if (company?.licensedCountries.length) {
      setSelected(company.licensedCountries)
    }
  }, [company?.licensedCountries, company?.packageTier])

  if (!company) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16">
        <EmptyState title="No application" description="Submit your business form first." />
      </div>
    )
  }

  if (company.status !== 'approved') {
    return (
      <div className="max-w-lg mx-auto px-4 py-16">
        <EmptyState title="Not approved yet" description="Wait for admin approval before choosing markets." />
      </div>
    )
  }

  if (!companyHasPaid(company)) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16">
        <EmptyState title="Select a tier first" description="Pay for a plan to choose your GCC markets." />
        <div className="mt-6 text-center">
          <Link to="/company/pricing">
            <Button>View tiers</Button>
          </Link>
        </div>
      </div>
    )
  }

  const toggle = (country: GccCountry) => {
    if (company.packageTier === 'enterprise') return
    setSelected((prev) => {
      if (prev.includes(country)) return prev.filter((c) => c !== country)
      if (prev.length >= limit) return prev
      return [...prev, country]
    })
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const result = setLicensedCountries(company.id, selected)
    if (!result.ok) {
      alert(result.reason)
      return
    }
    navigate('/company/dashboard')
  }

  const needExact = limit

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <PageHeader
        eyebrow="GCC markets"
        title="Choose your markets"
        description={
          pkg
            ? `${pkg.name}: select exactly ${needExact} ${needExact === 1 ? 'country' : 'countries'}. Localization and directory listings apply only to these markets.`
            : undefined
        }
      />

      <form onSubmit={onSubmit} className="border border-border bg-surface-raised p-6 rounded-sm space-y-6">
        {company.packageTier === 'enterprise' ? (
          <p className="text-sm text-ink-muted">
            Full GCC tier includes all markets: {allGccMarkets().join(', ')}.
          </p>
        ) : (
          <>
            <FieldLabel>Select {needExact} countries ({selected.length}/{needExact})</FieldLabel>
            <div className="flex flex-wrap gap-2">
              {GCC_COUNTRIES.map((country) => {
                const active = selected.includes(country)
                const disabled = !active && selected.length >= limit
                return (
                  <button
                    key={country}
                    type="button"
                    disabled={disabled}
                    onClick={() => toggle(country)}
                    className={`text-sm px-3 py-1.5 rounded-sm border transition-colors ${
                      active
                        ? 'bg-teal text-ink border-teal-dark'
                        : disabled
                          ? 'opacity-40 border-border cursor-not-allowed'
                          : 'bg-surface border-border text-ink-muted hover:border-teal'
                    }`}
                  >
                    {country}
                  </button>
                )
              })}
            </div>
          </>
        )}

        <div className="flex justify-end gap-2 pt-4 border-t border-border">
          <Link to="/company/dashboard">
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </Link>
          <Button type="submit">Confirm markets</Button>
        </div>
      </form>
    </div>
  )
}
