'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const Breadcrumbs = () => {
  const pathname = usePathname()

  const formatLabel = (path) => {
    const labelMap = {
      'courses': 'All Courses',
      'dashboard': 'My Dashboard',
      // Add more custom mappings as needed
    }
    return labelMap[path] ||
      path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ')
  }

  const generateBreadcrumbs = () => {
    const paths = pathname.split('/').filter(path => path !== '')
    const breadcrumbs = paths.map((path, index) => {
      const href = `/${paths.slice(0, index + 1).join('/')}`
      return {
        label: formatLabel(path),
        href,
        isCurrent: index === paths.length - 1
      }
    })
    // Add home as first breadcrumb if not already there
    return breadcrumbs[0]?.label !== 'Home'
      ? [{ label: 'Home', href: '/' }, ...breadcrumbs]
      : breadcrumbs
  }

  const breadcrumbs = generateBreadcrumbs()

  if (breadcrumbs.length <= 1) {
    return null // Don't show breadcrumbs if only Home exists
  }

  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2">
        {breadcrumbs.map((crumb, index) => (
          <li key={index} className="inline-flex items-center">
            {index > 0 && (
              <span className="text-gray-400 mx-1">/</span>
            )}
            {crumb.isCurrent ? (
              <span className="text-sm font-medium text-gray-500">
                {crumb.label}
              </span>
            ) : (
              <Link
                href={crumb.href}
                className="text-sm font-medium text-gray-700 hover:text-blue-600"
              >
                {crumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

export default Breadcrumbs