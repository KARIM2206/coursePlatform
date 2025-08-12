'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import LanguageSwitcher from './languegeHandler';
import { AnimatePresence, motion } from 'framer-motion';
import { Context } from '../CONTEXT/ContextProvider';
import { FiMenu, FiX, FiHome, FiLogOut, FiUser, FiBook, FiInfo, FiUsers, FiMessageSquare, FiShoppingCart, FiLogIn } from 'react-icons/fi';
import { Search } from 'lucide-react';
import SearchBar from './SearchBar';
import { Link as ScrollLink } from "react-scroll";


export default function Header({ dict, locale }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, token, fetchUser, refresh,cart,logout } = useContext(Context);
  const [avatarPreview, setAvatarPreview] = useState('/logo.jpg');
  const [loading, setLoading] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
const router = useRouter()
  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch user data
  useEffect(() => {
    if (token) {
      setLoading(true);
      fetchUser()
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [token, fetchUser, refresh]);

  // Update avatar preview
  useEffect(() => {
    if (user?.avatar) {
      const avatarPath = user.avatar.startsWith('http') 
        ? user.avatar 
        : `http://localhost:5000/${user.avatar.replace(/^\/+/, '')}`;
      setAvatarPreview(avatarPath);
    } else {
      setAvatarPreview('/logo.jpg');
    }
  }, [user]);

      console.log('Cart updated:', cart);
      

  const addLocaleToPath = (path) => {
    if (!locale) return path;
    if (!path.startsWith('/')) path = '/' + path;
    if (path === '/' || path === `/${locale}`) {
      return `/${locale}`;
    }
    return `/${locale}${path}`;
  };

const addLocaleToPathWithHash = (fullPath) => {
  // تقسيم الرابط ل path و hash
  const [pathPart, hashPart] = fullPath.split('#');

  // تطبيق دالتك الأصلية على ال path فقط
  let localizedPath = addLocaleToPath(pathPart);

  // إعادة تجميع ال path مع ال hash (لو موجود)
  return hashPart ? `${localizedPath}#${hashPart}` : localizedPath;
};

  // Navigation items with icons
 const navItems = [
  { name:'courses',key: 'list', icon: <FiBook className="mr-1" /> },
  { name:'about',key: 'about', icon: <FiInfo className="mr-1" /> },
  { name:'contact',key: 'contact', icon: <FiMessageSquare className="mr-1" /> }
];

  return (
    <header
  className={`bg-white sticky  top-0 z-50 transition-all duration-300 ${
    isScrolled ? 'shadow-md' : 'shadow-sm'
  }`}
>
  <div className="mx-auto px-8 md:px-4 sm:px-6 lg:px-8 max-w-screen-2xl ">
    <div className="flex h-16 items-center justify-between w-full">
      {/* Logo Section */}
      <div className="flex items-center relative  flex-shrink-0">
        <Link href={addLocaleToPath('/')} className="flex md:w-10 md:h-10 w-8 h-8  releative items-center">
          <Image
            src="/logo.jpg"
           fill
            alt="Logo"
            className="rounded-lg md:w-10 md:h-10 w-8 h-8 absolute left-0 top-0 object-cover"
          />
          <span className="ml-3  text-xl font-bold text-gray-900 hidden sm:block truncate">
            {dict.siteName}
          </span>
        </Link>
      </div>

      {/* Desktop Navigation */}
<nav className="hidden lg:flex items-center space-x-6 flex-shrink">
  {navItems.map((item) => (
  <ScrollLink
  key={item.key}
  to={item.key} // لازم الـ id يكون "courses" أو أي اسم مطابق
  smooth={true}
  duration={800}
  offset={-160}
  activeClass="text-blue-500"
  spy={true}
  className="text-gray-700 cursor-pointer hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors"
>
  {item.icon}
  {dict[item.name]}
</ScrollLink>

  ))}
</nav>


    <SearchBar />
   {/* Desktop Actions */}
<div className="hidden md:flex items-center space-x-4 flex-shrink-0" style={{ overflow: 'visible' }}>
 <div
  className="relative cursor-pointer"
  onClick={() => router.push(`${addLocaleToPath('/cart')}`)}
>
  <FiShoppingCart className="h-8 w-8 text-blue-600" />
  <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 rounded-full text-center text-white" >
    {cart?.length || 0}
    </span>
</div>

  <LanguageSwitcher />

  {token ? (
    <>
     

      <div className="relative group" style={{ overflow: 'visible' }}>
        <Link href={`${addLocaleToPath('/profile')}`} className="flex items-center space-x-2 focus:outline-none">
          <div className="relative">
            {loading ? (
              <div className="w-12 h-12 mr-4 rounded-full bg-gray-200 flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <Image
                src={avatarPreview}
                alt="Profile"
                width={36}
                height={36}
                className="rounded-full mr-4 object-cover w-12 h-12"
                onError={(e) => {
                  e.target.src = '/logo.jpg';
                }}
              />
            )}
          </div>
        </Link>
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 py-1 opacity-0
         invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 origin-top-right z-50"
          style={{ overflow: 'visible' }}>
            
            {
              token ?(
                <Link
                  href={user?.role=='teacher'?addLocaleToPath('/dashboard'):addLocaleToPath('/student')}
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                >
                  <FiHome className="mr-2" />
                  {dict.dashboard}
                </Link>
              ):
              (
                <Link
                  href={addLocaleToPath('/register')}
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                >
                  <FiLogIn className="mr-2" />
                  {dict.register}
                </Link>
              )
            }
  {     !token?   <Link
            href={ addLocaleToPath('/login')}
            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
          >
            <FiLogIn className="mr-2" />
            {dict.login}
          </Link>
         : <button
           onClick={logout}
            className="px-4 py-2 text-sm text-gray-700 w-full hover:bg-gray-100 flex items-center"
          >
            <FiLogOut className="mr-2 bg-black" />
            {dict.logout}
          </button>}
        </div>
      </div>
    </>
  ) : (
    <>
      <Link
        href={addLocaleToPath('/login')}
        className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
      >
        {dict.login}
      </Link>
      <Link
        href={addLocaleToPath('/register')}
        className="px-4 py-2 rounded-md text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 transition-colors"
      >
        {dict.register}
      </Link>
    </>
  )}

</div>

      {/* Mobile Menu Button */}
      <div className="md:hidden flex items-center ">
        <LanguageSwitcher />
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-100 focus:outline-none ml-2"
          aria-expanded="false"
        >
          <span className="sr-only">Open main menu</span>
          {mobileMenuOpen ? (
            <FiX className="h-6 w-6" />
          ) : (
            <FiMenu className="h-6 w-6" />
          )}
        </button>
      </div>
    </div>
  </div>

  {/* Mobile Menu */}
  <AnimatePresence>
    {mobileMenuOpen && (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.2 }}
        className="md:hidden bg-white shadow-lg overflow-hidden"
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={addLocaleToPath(`/${item.key}`)}
              className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.icon}
              {dict[item.key]}
            </Link>
          ))}
        </div>
        <div className="pt-4 pb-3 border-t border-gray-200">
          {token ? (
            <div className="px-5 space-y-3">
              <Link
                href={addLocaleToPath('/dashboard')}
                className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FiHome className="mr-2" />
                {dict.dashboard}
              </Link>
              <Link
                href={addLocaleToPath('/profile')}
                className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FiUser className="mr-2" />
                {dict.profile}
              </Link>
              <Link
                href={addLocaleToPath('/logout')}
                className="flex items-center w-full px-3 py-2
                 rounded-md text-base font-medium text-red-700 hover:text-red-600 hover:bg-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FiLogOut className="mr-2" />
                {dict.logout}
              </Link>
            </div>
          ) : (
            <div className="px-5 space-y-3">
              <Link
                href={addLocaleToPath('/login')}
                className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                {dict.login}
              </Link>
              <Link
                href={addLocaleToPath('/register')}
                className="flex items-center justify-center w-full px-3 py-2 rounded-md text-base font-medium text-white bg-primary-600 hover:bg-primary-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                {dict.register}
              </Link>
            </div>
          )}
        </div>
      </motion.div>
    )}
  </AnimatePresence>
</header>

  );
}