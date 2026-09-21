import { useNavigate } from 'react-router-dom'
import { BrandLogo } from '../components/BrandLogo'
import { Button } from '../components/ui'
import { useAppStore } from '../store/useAppStore'
import { enterDemoSession } from '../utils/demoSession'

export function LandingPage() {
  const navigate = useNavigate()
  const setRole = useAppStore((s) => s.setRole)

  const startCompanyApplication = () => {
    enterDemoSession(setRole, 'company', navigate, '/company/onboarding')
  }

  const browseAsCustomer = () => {
    enterDemoSession(setRole, 'customer', navigate)
  }

  return (
    <div>
      <section className="pattern-gulf border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-24">
          <BrandLogo className="h-10 md:h-12 mb-6" linkToHome={false} />
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-teal mb-4">
            GCC · Markets · Matchmaking
          </p>
          <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-12 items-end">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl text-ink text-balance leading-[1.05]">
                Simplify how you enter the Gulf—and who finds you there.
              </h1>
              <p className="mt-6 text-lg text-ink-muted max-w-xl leading-relaxed">
                Tawas3 helps you simplify business applications across the GCC, explore demand in the
                countries you choose, and extend reach to buyers who value what you offer.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button size="md" onClick={startCompanyApplication}>
                  Getting started
                </Button>
                <Button size="md" variant="secondary" onClick={browseAsCustomer}>
                  Browse as customer
                </Button>
              </div>
            </div>
            <div className="relative border-l-0 lg:border-l border-terracotta/40 lg:pl-10">
              <dl className="grid gap-6">
                <div>
                  <dt className="font-display text-2xl text-teal-dark">Apply with clarity</dt>
                  <dd className="mt-1 text-sm text-ink-muted leading-relaxed">
                    Structured onboarding and localization guidance per market—not generic checklists.
                  </dd>
                </div>
                <div>
                  <dt className="font-display text-2xl text-teal-dark">Choose your markets</dt>
                  <dd className="mt-1 text-sm text-ink-muted leading-relaxed">
                    Focus on Bahrain, Saudi Arabia, the UAE, or the full GCC—where demand fits your offer.
                  </dd>
                </div>
                <div>
                  <dt className="font-display text-2xl text-teal-dark">Reach the right buyers</dt>
                  <dd className="mt-1 text-sm text-ink-muted leading-relaxed">
                    Get in front of customers actively looking for providers entering their country.
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-surface-raised">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-20 grid md:grid-cols-2 gap-10 md:gap-14 items-center">
          <div className="order-2 md:order-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-teal mb-3">For businesses</p>
            <h2 className="text-3xl md:text-4xl text-ink text-balance">Apply to operate across the GCC</h2>
            <p className="mt-4 text-ink-muted leading-relaxed">
              Submit your company profile once, then work through approval, market selection, and
              localization steps for each country you target. See where opportunity concentrates before
              you commit—whether that is one market or several.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-ink-muted">
              <li className="flex gap-2">
                <span className="text-teal-dark shrink-0">—</span>
                Guided application and tiered GCC coverage
              </li>
              <li className="flex gap-2">
                <span className="text-teal-dark shrink-0">—</span>
                Country-specific requirements from operations
              </li>
              <li className="flex gap-2">
                <span className="text-teal-dark shrink-0">—</span>
                Directory visibility where you are licensed to trade
              </li>
            </ul>
            <div className="mt-8">
              <Button onClick={startCompanyApplication}>Apply as a business</Button>
            </div>
          </div>
          <div className="order-1 md:order-2 flex justify-center md:justify-end">
            <img
              src="/gcc-map-outline.svg"
              alt=""
              className="w-full max-w-md h-auto"
              width={480}
              height={360}
            />
          </div>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-20 grid md:grid-cols-2 gap-10 md:gap-14 items-center">
          <div className="flex justify-center md:justify-start">
            <img
              src="/customer-browse-illustration.svg"
              alt=""
              className="w-full max-w-md h-auto"
              width={480}
              height={320}
            />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-teal mb-3">For customers</p>
            <h2 className="text-3xl md:text-4xl text-ink text-balance">
              Browse companies entering the GCC
            </h2>
            <p className="mt-4 text-ink-muted leading-relaxed">
              Discover providers expanding into the Gulf—filter by industry, keyword, or a specific
              country such as Bahrain, Saudi Arabia, or the UAE. Listings reflect where each company
              is actively applying and licensed to serve.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-ink-muted">
              <li className="flex gap-2">
                <span className="text-teal-dark shrink-0">—</span>
                Search by problem, sector, and target market
              </li>
              <li className="flex gap-2">
                <span className="text-teal-dark shrink-0">—</span>
                Narrow results to country X or Y
              </li>
              <li className="flex gap-2">
                <span className="text-teal-dark shrink-0">—</span>
                Request introductions to approved listings
              </li>
            </ul>
            <div className="mt-8">
              <Button variant="secondary" onClick={browseAsCustomer}>
                Explore the directory
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
