import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { DOMAINS, GCC_COUNTRIES } from '../../data/constants'
import { useAppStore } from '../../store/useAppStore'
import type { CompanyDomain, GccCountry } from '../../types'
import { isListedForCustomers, isListedInCountry } from '../../utils/companyAccess'
import { Badge, EmptyState, FieldLabel, Input, PageHeader, Select } from '../../components/ui'

export function CustomerBrowse() {
  const companies = useAppStore((s) => s.companies)
  const packages = useAppStore((s) => s.packages)
  const listed = useMemo(() => companies.filter(isListedForCustomers), [companies])

  const [keyword, setKeyword] = useState('')
  const [domain, setDomain] = useState<CompanyDomain | 'all'>('all')
  const [country, setCountry] = useState('all')

  const listings = useMemo(() => {
    let list = listed
    const q = keyword.trim().toLowerCase()
    if (q) {
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.pitch.toLowerCase().includes(q) ||
          c.problemSolved.toLowerCase().includes(q),
      )
    }
    if (domain !== 'all') list = list.filter((c) => c.domain === domain)
    if (country !== 'all') {
      list = list.filter((c) => isListedInCountry(c, country as GccCountry))
    }

    const tierRank = (tier: typeof list[0]['packageTier']) =>
      tier === 'enterprise' ? 0 : tier === 'growth' ? 1 : tier === 'basic' ? 2 : 3
    return list.sort((a, b) => tierRank(a.packageTier) - tierRank(b.packageTier))
  }, [listed, keyword, domain, country])

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <PageHeader
        eyebrow="Directory"
        title="Find a company that fits the problem"
        description="Search companies active in a GCC market — listings appear only where they paid to operate."
      />

      <div className="grid lg:grid-cols-[280px_1fr] gap-8">
        <aside className="border border-border bg-surface-raised p-5 rounded-sm h-fit space-y-4">
          <div>
            <FieldLabel htmlFor="kw">Keyword</FieldLabel>
            <Input
              id="kw"
              placeholder="e.g. video, manufacturing"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
          <div>
            <FieldLabel htmlFor="dom">Domain</FieldLabel>
            <Select id="dom" value={domain} onChange={(e) => setDomain(e.target.value as CompanyDomain | 'all')}>
              <option value="all">All industries</option>
              {DOMAINS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <FieldLabel htmlFor="cty">Target country</FieldLabel>
            <Select id="cty" value={country} onChange={(e) => setCountry(e.target.value)}>
              <option value="all">Any listed market</option>
              {GCC_COUNTRIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </div>
        </aside>

        <div>
          {listings.length === 0 ? (
            <EmptyState
              title="No matches"
              description="Try broadening filters or check back after more companies are approved."
            />
          ) : (
            <ul className="space-y-3">
              {listings.map((c) => {
                const pkg = c.packageTier ? packages.find((p) => p.tier === c.packageTier) : undefined
                const featured = pkg?.limits.featured
                const top = pkg?.limits.topFeatured
                return (
                  <li key={c.id}>
                    <Link
                      to={`/customer/company/${c.id}`}
                      className="block border border-border bg-surface-raised p-5 rounded-sm hover:border-teal transition-colors group"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <h2 className="font-display text-xl text-ink group-hover:text-teal-dark transition-colors">
                            {c.name}
                          </h2>
                          <p className="text-sm text-ink-muted mt-1">{c.domain}</p>
                        </div>
                        <div className="flex gap-2">
                          {top && <Badge tone="teal">Top featured</Badge>}
                          {!top && featured && <Badge tone="warning">Featured</Badge>}
                        </div>
                      </div>
                      <p className="mt-3 text-sm text-ink-muted line-clamp-2">{c.pitch}</p>
                      <p className="mt-2 text-xs text-ink-muted">
                        Listed in:{' '}
                        <span className="text-ink">{c.licensedCountries.join(', ')}</span>
                      </p>
                      <p className="mt-1 text-xs text-ink-muted">
                        Solves: <span className="text-ink">{c.problemSolved}</span>
                      </p>
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
