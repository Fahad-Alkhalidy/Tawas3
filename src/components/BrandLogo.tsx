import { Link } from 'react-router-dom'

type BrandLogoProps = {
  /** Swapped palette for navy header (transparent SVG) */
  onDark?: boolean
  className?: string
  linkToHome?: boolean
}

export function BrandLogo({ onDark = false, className = '', linkToHome = true }: BrandLogoProps) {
  const img = (
    <img
      src={onDark ? '/logo-on-dark.svg' : '/logo.svg'}
      alt="Tawas3"
      className={`h-8 md:h-9 w-auto block ${className}`}
      width={160}
      height={38}
    />
  )

  if (!linkToHome) return img

  return (
    <Link
      to="/"
      className="inline-flex shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal rounded-sm"
    >
      {img}
    </Link>
  )
}
