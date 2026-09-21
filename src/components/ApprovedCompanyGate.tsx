import { Link } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'
import { Button, EmptyState } from './ui'

/** Pricing and paid unlock flows are only available after admin approval. */
export function ApprovedCompanyGate({ children }: { children: React.ReactNode }) {
  const session = useAppStore((s) => s.session)
  const getCompanyForUser = useAppStore((s) => s.getCompanyForUser)
  const company = session.userId ? getCompanyForUser(session.userId) : undefined

  if (!company) {
    return (
      <div className="max-w-lg mx-auto px-4 sm:px-6 py-16">
        <EmptyState
          title="Submit your application first"
          description="Complete the business application form before choosing a package."
        />
        <div className="mt-6 text-center">
          <Link to="/company/onboarding">
            <Button>Application form</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (company.status !== 'approved') {
    return (
      <div className="max-w-lg mx-auto px-4 sm:px-6 py-16">
        <EmptyState
          title="Awaiting admin approval"
          description="Packages and detailed localization requirements unlock only after your application is approved."
        />
        <div className="mt-6 text-center">
          <Link to="/company/dashboard">
            <Button variant="secondary">Back to dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
