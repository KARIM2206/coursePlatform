'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { locales } from '../../i18n/config';

export default function LanguageSwitcher() {
  const pathname = usePathname();
  
  const redirectedPathName = (locale) => {
    if (!pathname) return '/';
    const segments = pathname.split('/');
    segments[1] = locale;
    return segments.join('/');
  };

  return (
    <div className="flex gap-4">
      {locales.map((locale) => (
        <Link
          key={locale}
          href={redirectedPathName(locale)}
          className="px-4 py-2 bg-gray-200 rounded"
        >
          {locale.toUpperCase()}
        </Link>
      ))}
    </div>
  );
}