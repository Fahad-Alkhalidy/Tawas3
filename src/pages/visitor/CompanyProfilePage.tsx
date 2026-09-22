import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAppStore } from '../../store/useAppStore'
import { isListedForVisitors } from '../../utils/companyAccess'
import { Badge, Button, EmptyState, FieldLabel, Input, PageHeader, TextArea } from '../../components/ui'

export function CompanyProfilePage() {
  const { id } = useParams<{ id: string }>()
  const company = useAppStore((s) => s.companies.find((c) => c.id === id && isListedForVisitors(c)))

  const [showContact, setShowContact] = useState(false)
  const [sent, setSent] = useState(false)

  useEffect(() => {
    if (!id) return
    const c = useAppStore.getState().companies.find((x) => x.id === id)
    if (c && isListedForVisitors(c)) useAppStore.getState().incrementProfileView(id)
  }, [id])

  if (!company) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <EmptyState title="Listing unavailable" description="This company may be pending review or removed." />
        <div className="mt-6 text-center">
          <Link to="/visitor/browse">
            <Button variant="secondary">Back to directory</Button>
          </Link>
        </div>
      </div>
    )
  }

  const onContact = (e: FormEvent) => {
    e.preventDefault()
    setSent(true)
    setShowContact(false)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <PageHeader
        eyebrow={company.domain}
        title={company.name}
        description={company.pitch}
        actions={
          <Link to="/visitor/browse">
            <Button variant="secondary">Directory</Button>
          </Link>
        }
      />

      <div className="border border-border bg-surface-raised rounded-sm divide-y divide-border">
        <section className="p-6">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Problem solved</h2>
          <p className="mt-2 text-ink leading-relaxed">{company.problemSolved}</p>
        </section>
        <section className="p-6 grid sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-ink-muted">Target buyer type</p>
            <p className="mt-1 font-medium">{company.targetCustomerType}</p>
          </div>
          <div>
            <p className="text-ink-muted">Origin</p>
            <p className="mt-1 font-medium">{company.originCountry}</p>
          </div>
          <div className="sm:col-span-2">
            <p className="text-ink-muted">Active GCC markets (paid listing)</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {company.licensedCountries.map((c) => (
                <Badge key={c} tone="neutral">
                  {c}
                </Badge>
              ))}
            </div>
          </div>
        </section>
        <section className="p-6 flex flex-wrap gap-3">
          <Button onClick={() => setShowContact(true)}>Request introduction</Button>
          <a href={`mailto:hello@${company.name.toLowerCase().replace(/\s+/g, '')}.example`}>
            <Button variant="secondary">Email (mock)</Button>
          </a>
        </section>
      </div>

      {sent && (
        <p className="mt-4 text-sm text-success bg-teal-soft border border-teal/20 px-4 py-3 rounded-sm">
          Introduction request recorded locally (MVP, no backend delivery).
        </p>
      )}

      {showContact && (
        <div className="fixed inset-0 bg-ink/50 flex items-end sm:items-center justify-center p-4 z-50">
          <form
            onSubmit={onContact}
            className="w-full max-w-md bg-surface-raised border border-border rounded-sm p-6 shadow-lg"
          >
            <h2 className="font-display text-xl">Request introduction</h2>
            <p className="mt-1 text-sm text-ink-muted">We&apos;ll route this to {company.name} in a production build.</p>
            <div className="mt-4 space-y-3">
              <div>
                <FieldLabel htmlFor="cn">Your name</FieldLabel>
                <Input id="cn" required placeholder="Your name or team" />
              </div>
              <div>
                <FieldLabel htmlFor="em">Email</FieldLabel>
                <Input id="em" type="email" required defaultValue="you@company.com" />
              </div>
              <div>
                <FieldLabel htmlFor="msg">Message</FieldLabel>
                <TextArea id="msg" required defaultValue="We're exploring providers for a GCC launch." />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={() => setShowContact(false)}>
                Cancel
              </Button>
              <Button type="submit">Send request</Button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
