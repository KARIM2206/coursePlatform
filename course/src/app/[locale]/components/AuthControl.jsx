'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { FiHome, FiLogOut, FiLoader } from 'react-icons/fi';

import { useContext } from 'react';
import { Context } from '../CONTEXT/ContextProvider';
import { toast } from 'react-toastify';

const AuthControl = ({ locale, dashboard, logout ,role}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { logout: contextLogout } = useContext(Context); // Using context logout if available

  const handleLogout = async () => {
    try {
      setLoading(true);
      
      // Clear local storage
      localStorage.removeItem('login-token');
      
      // If using context, call the context logout function
      if (contextLogout) {
        await contextLogout();
      }
      console.log(role);
      
      // Show success message
      toast.success('Logged out successfully');
      
      // Redirect to login page
      router.push(`/${locale}/login`);
      
      // Optional: Refresh to ensure clean state
      setTimeout(() => window.location.reload(), 500);
      
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full py-4 flex justify-between sm:justify-center
     items-center gap-6 px-4 md:px-8 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm">
      <Link 
        href={`${role=="teacher"?`/${locale}/dashboard`:`/${locale}/student`}`}
        className="flex items-center whitespace-nowrap gap-2 text-primary-600 hover:text-primary-700 transition-colors duration-200 group"
      >
        <div className="p-2 rounded-full bg-primary-50 group-hover:bg-primary-100 transition-colors duration-200">
          <FiHome className="w-5 h-5" />
        </div>
        <span className="font-medium  text-sm md:text-base">
          {dashboard}
        </span>
      </Link>
      
      <button 
        onClick={handleLogout}
        disabled={loading}
        className="flex items-center gap-2 whitespace-nowrap  text-red-600 hover:text-red-700 transition-colors duration-200 group"
      >
        <div className="p-2 rounded-full bg-red-50 group-hover:bg-red-100 transition-colors duration-200">
          {loading ? (
            <FiLoader className="w-5 h-5 animate-spin" />
          ) : (
            <FiLogOut className="w-5 h-5" />
          )}
        </div>
        <span className="font-medium text-sm  md:text-base">
          {logout}
        </span>
      </button>
    </div>
  );
};

export default AuthControl;