import { Link } from 'react-router-dom'
import { Button, EmptyState } from '../../components/ui'

export function VisitorRestricted() {
  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-16">
      <EmptyState
        title="Account restricted"
        description="Your visitor access has been limited by a platform administrator."
      />
      <div className="mt-6 text-center">
        <Link to="/">
          <Button variant="secondary">Return home</Button>
        </Link>
      </div>
    </div>
  )
}
