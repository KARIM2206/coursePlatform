'use client'
import { useRouter, usePathname } from 'next/navigation'

export default function LanguageSwitcher() {
  const router = useRouter()
  const pathname = usePathname()

  // Detect current locale from the path
  const segments = pathname.split('/')
 
  
  const currentLocale = segments[1] === 'ar' || segments[1] === 'en' ? segments[1] : 'en'

  const changeLanguage = (locale) => {
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000`
    if (segments[1] === 'ar' || segments[1] === 'en') {
      segments[1] = locale
    } else {
      segments.splice(1, 0, locale)
    }
    const newPath = segments.join('/') || '/'
    router.push(newPath)
  }

  return (
    <div className="flex items-center border border-neutral-300 
    rounded-full bg-neutral-50 sm:p-1 shadow-sm">
      <button
        onClick={() => changeLanguage('en')}
        className={`sm:w-12 sm:h-10 w-8 h-8 flex items-center
           justify-center rounded-full  text-sm font-thin
            sm:font-semibold transition-colors duration-300 ${
          currentLocale === 'en'
            ? 'bg-primary-600 text-white shadow-md'
            : 'text-neutral-700 hover:bg-green-100'
        }`}
        aria-label="Switch to English"
      >
        EN
      </button>
      <button
        onClick={() => changeLanguage('ar')}
        className={`sm:w-12 sm:h-10 w-8 h-8 flex items-center
           justify-center rounded-full text-sm font-thin
            sm:font-semibold transition-colors duration-300 ${
          currentLocale === 'ar'
            ? 'bg-primary-600 text-white shadow-md'
            : 'text-neutral-700 hover:bg-green-100'
        }`}
        aria-label="Switch to Arabic"
      >
        AR
      </button>
    </div>
  )
}