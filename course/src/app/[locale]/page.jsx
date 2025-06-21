
// import { useRouter } from 'next/navigation';
import { getDictionary } from '../../i18n/server';
import DisplayCourse from './components/DisplayCourse';
import Hero from './components/Hero';
import { redirect } from 'next/dist/server/api-utils';

export default function Home({ params: { locale } }) {
  // No need to await since we're using synchronous imports
  const dict = getDictionary(locale);

  return (
     <main className="bg-gradient-to-r from-white via-blue-50 to-blue-100 min-h-screen">
      <div className=" mx-auto px-4 sm:px-6 lg:px-12 py-4">
  <Hero />
  <DisplayCourse  locale={locale} dict={dict} />
      </div>
  </main>
  );
}
   
export const getStaticParams = () => [
  { locale: 'en' },
  { locale: 'ar' },
];
