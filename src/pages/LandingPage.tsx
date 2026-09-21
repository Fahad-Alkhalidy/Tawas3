import { BrandLogo } from '../components/BrandLogo'

export function LandingPage() {
  return (
    <div>
      <section className="pattern-gulf border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-24 grid md:grid-cols-[1.1fr_0.9fr] gap-12 items-end">
          <div>
            <BrandLogo className="h-10 md:h-12 mb-6" linkToHome={false} />
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-teal mb-4">
              Bahrain · GCC
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl text-ink text-balance leading-[1.05]">
              Where global brands meet Gulf market reality.
            </h1>
            <p className="mt-6 text-lg text-ink-muted max-w-xl leading-relaxed">
              Tawas3 helps companies localize with clarity—licensing, labor, customs, and sector rules—
              while connecting buyers to providers who already solve the problem.
            </p>
            <p className="mt-4 text-sm text-ink-muted">
              Choose <strong className="text-ink">Admin</strong> or <strong className="text-ink">Company</strong> in
              the top bar to explore the demo.
            </p>
          </div>
          <div className="relative md:pl-8">
            <div className="absolute -left-2 top-0 bottom-0 w-px bg-terracotta hidden md:block" />
            <dl className="grid gap-6">
              <div>
                <dt className="font-display text-2xl text-teal-dark">Guidance</dt>
                <dd className="mt-1 text-sm text-ink-muted">
                  Rules-based roadmaps by industry × country—structured for real compliance work.
                </dd>
              </div>
              <div>
                <dt className="font-display text-2xl text-teal-dark">Marketplace</dt>
                <dd className="mt-1 text-sm text-ink-muted">
                  Curated directory of approved companies, searchable by need and geography.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>
    </div>
  )
}
