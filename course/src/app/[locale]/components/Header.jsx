'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import LanguageSwitcher from './languegeHandler';
import { AnimatePresence, motion } from 'framer-motion';
import { Context } from '../CONTEXT/ContextProvider';
import { FiMenu, FiX, FiHome, FiLogOut, FiUser, FiBook, FiInfo, FiUsers, FiMessageSquare } from 'react-icons/fi';

export default function Header({ dict, locale }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, token, fetchUser, refresh } = useContext(Context);
  const [avatarPreview, setAvatarPreview] = useState('/logo.jpg');
  const [loading, setLoading] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

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

  const addLocaleToPath = (path) => {
    if (!locale) return path;
    if (!path.startsWith('/')) path = '/' + path;
    if (path === '/' || path === `/${locale}`) {
      return `/${locale}`;
    }
    return `/${locale}${path}`;
  };


  // Navigation items with icons
  const navItems = [
    { key: 'courses', icon: <FiBook className="mr-1" /> },
    { key: 'about', icon: <FiInfo className="mr-1" /> },
    { key: 'instructors', icon: <FiUsers className="mr-1" /> },
    { key: 'blog', icon: <FiMessageSquare className="mr-1" /> },
    { key: 'contact', icon: <FiMessageSquare className="mr-1" /> }
  ];

  return (
    <header
  className={`bg-white sticky  top-0 z-50 transition-all duration-300 ${
    isScrolled ? 'shadow-md' : 'shadow-sm'
  }`}
>
  <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-screen-2xl overflow-hidden">
    <div className="flex h-16 items-center justify-between w-full">
      {/* Logo Section */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <Link href={addLocaleToPath('/')} className="flex items-center">
          <Image
            src="/logo.jpg"
            width={40}
            height={40}
            alt="Logo"
            className="rounded-lg w-10 h-10 object-cover"
          />
          <span className="ml-3 text-xl font-bold text-gray-900 hidden sm:block truncate">
            {dict.siteName}
          </span>
        </Link>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center space-x-6 flex-shrink">
        {navItems.map((item) => (
          <Link
            key={item.key}
            href={addLocaleToPath(`/${item.key}`)}
            className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors"
          >
            {item.icon}
            {dict[item.key]}
          </Link>
        ))}
      </nav>

   {/* Desktop Actions */}
<div className="hidden md:flex items-center space-x-4 flex-shrink-0" style={{ overflow: 'visible' }}>
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
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 origin-top-right z-50"
          style={{ overflow: 'visible' }}>
          <Link
            href={addLocaleToPath('/profile')}
            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
          >
            <FiUser className="mr-2" />
            {dict.register}
          </Link>
          <Link
            href={addLocaleToPath('/logout')}
            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
          >
            <FiLogOut className="mr-2 bg-black" />
            {dict.logout}
          </Link>
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
      <div className="md:hidden flex items-center flex-shrink-0">
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