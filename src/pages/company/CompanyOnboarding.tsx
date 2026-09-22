import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { DOMAINS, GCC_COUNTRIES } from '../../data/constants'
import { useAppStore } from '../../store/useAppStore'
import type { CompanyDomain, GccCountry } from '../../types'
import { Button, FieldLabel, Input, PageHeader, Select, TextArea } from '../../components/ui'

export function CompanyOnboarding() {
  const navigate = useNavigate()
  const session = useAppStore((s) => s.session)
  const getCompanyForUser = useAppStore((s) => s.getCompanyForUser)
  const createOrUpdateCompanyProfile = useAppStore((s) => s.createOrUpdateCompanyProfile)

  const existing = session.userId ? getCompanyForUser(session.userId) : undefined

  const [name, setName] = useState('')
  const [logoUrl, setLogoUrl] = useState('')
  const [domain, setDomain] = useState<CompanyDomain>('Manufacturing')
  const [pitch, setPitch] = useState('')
  const [problemSolved, setProblemSolved] = useState('')
  const [targetCustomerType, setTargetCustomerType] = useState('')
  const [originCountry, setOriginCountry] = useState('')
  const [targetCountries, setTargetCountries] = useState<GccCountry[]>(['Bahrain'])

  useEffect(() => {
    if (!existing) return
    setName(existing.name)
    setLogoUrl(existing.logoUrl)
    setDomain(existing.domain)
    setPitch(existing.pitch)
    setProblemSolved(existing.problemSolved)
    setTargetCustomerType(existing.targetCustomerType)
    setOriginCountry(existing.originCountry)
    setTargetCountries(existing.targetCountries)
  }, [existing])

  const toggleCountry = (country: GccCountry) => {
    setTargetCountries((prev) =>
      prev.includes(country) ? prev.filter((c) => c !== country) : [...prev, country],
    )
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!session.userId) return
    createOrUpdateCompanyProfile(session.userId, {
      name,
      logoUrl,
      domain,
      pitch,
      problemSolved,
      targetCustomerType,
      originCountry,
      targetCountries,
    })
    navigate('/company/dashboard')
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <PageHeader
        eyebrow="Business application"
        title={existing ? 'Update your application' : 'Apply to join Tawas3'}
        actions={
          <Link to="/company/dashboard">
            <Button variant="secondary">Back to dashboard</Button>
          </Link>
        }
      />

      <form onSubmit={onSubmit} className="space-y-6 bg-surface-raised p-6 md:p-8 rounded-lg shadow-soft">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <FieldLabel htmlFor="name">Company name</FieldLabel>
            <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <FieldLabel htmlFor="domain">Industry / domain</FieldLabel>
            <Select id="domain" value={domain} onChange={(e) => setDomain(e.target.value as CompanyDomain)}>
              {DOMAINS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div>
          <FieldLabel htmlFor="logo">Logo URL (optional)</FieldLabel>
          <Input id="logo" value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} placeholder="https://..." />
        </div>

        <div>
          <FieldLabel htmlFor="pitch">Short pitch</FieldLabel>
          <TextArea id="pitch" required value={pitch} onChange={(e) => setPitch(e.target.value)} />
        </div>

        <div>
          <FieldLabel htmlFor="problem">Problem solved</FieldLabel>
          <TextArea
            id="problem"
            required
            value={problemSolved}
            onChange={(e) => setProblemSolved(e.target.value)}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <FieldLabel htmlFor="target">Target buyer type</FieldLabel>
            <Input
              id="target"
              required
              value={targetCustomerType}
              onChange={(e) => setTargetCustomerType(e.target.value)}
            />
          </div>
          <div>
            <FieldLabel htmlFor="origin">Country of origin</FieldLabel>
            <Input id="origin" required value={originCountry} onChange={(e) => setOriginCountry(e.target.value)} />
          </div>
        </div>

        <fieldset>
          <legend className="text-xs font-semibold uppercase tracking-wide text-ink-muted mb-2">
            GCC localization targets
          </legend>
          <div className="flex flex-wrap gap-2">
            {GCC_COUNTRIES.map((country) => {
              const active = targetCountries.includes(country)
              return (
                <button
                  key={country}
                  type="button"
                  onClick={() => toggleCountry(country)}
                  className={`text-sm px-3 py-1.5 rounded-sm border transition-colors ${
                    active
                      ? 'bg-teal text-white border-teal-dark'
                      : 'bg-surface border-border text-ink-muted hover:border-teal'
                  }`}
                >
                  {country}
                </button>
              )
            })}
          </div>
        </fieldset>

        <div className="pt-4 border-t border-border flex justify-end gap-2">
          <Button type="submit">{existing ? 'Update application' : 'Submit application'}</Button>
        </div>
      </form>
    </div>
  )
}
