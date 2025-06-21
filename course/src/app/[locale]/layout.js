import Header from './components/Header';
import { getDictionary } from '../../i18n/server'; // مثلاً
import '../globals.css';
import { ToastContainer } from 'react-toastify';
import ContextProvider, { Context } from './CONTEXT/ContextProvider';
export default async function RootLayout({ params: { locale }, children }) {
  const dict = await getDictionary(locale); // تجيب الديكتشينري للغة المطلوبة

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
     
      <body>
        <ContextProvider>
         <ToastContainer />
        <Header dict={dict.header} locale={locale} />
        {children}
        </ContextProvider>
      </body>
    </html>
  );
}
