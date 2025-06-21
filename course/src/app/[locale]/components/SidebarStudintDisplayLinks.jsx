'use client'
import { usePathname } from 'next/navigation'
import SidebarStudentLink from './SidebarStudentLinkt'


const links = [
  { href: '', label: 'profile' },
  { href: 'courses', label: 'courses' },
  { href: 'wishlist', label: 'wishlist' },
  { href: 'secure', label: 'security and time of login and log out' },
  { href: 'watchlist', label: 'watchlist' },
  { href: 'resultOfQuiz', label: 'results' },
]

const SidebarStudintDisplayLinks = ({ locale }) => {
  const pathname = usePathname()

  return (
    <div className='flex flex-col gap-4 items-center'>
      {links.map((link) => (
        <SidebarStudentLink
          key={link.href }
          locale={locale}
          link={link.href}
          text={link.label}
          currentPath={pathname}
        />
      ))}
    </div>
  )
}

export default SidebarStudintDisplayLinks
