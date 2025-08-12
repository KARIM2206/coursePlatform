'use client';
import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../../CONTEXT/ContextProvider';
import { FiLoader } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { getSessionStats } from '../../lib/server';

const SessionStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token, refresh } = useContext(Context);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getSessionStats(token);
        console.log(response);
        
        setStats(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching session stats:', error);
        setLoading(false);
      }
    };

    if (token) {
      fetchStats();
    }
  }, [token,refresh]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        when: "beforeChildren"
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const cardVariants = {
    hover: {
      y: -5,
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
    }
  };

  if (loading || !stats) {
    return (
      <div className="flex justify-center items-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <FiLoader className="text-2xl text-blue-500" />
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-6 p-4 max-w-6xl w-full mx-auto"
    >
      <motion.h1 
        variants={itemVariants}
        className="md:text-3xl text-xl font-bold text-gray-800 dark:text-white"
      >
        Session Statistics
      </motion.h1>
      
      <motion.div 
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <motion.div
          variants={itemVariants}
          whileHover="hover"
          // variants={cardVariants}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700"
        >
          <h2 className="md:text-xl font-light text-sm mb-2  md:font-semibold text-gray-800 dark:text-white md:mb-4">Daily Activity</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-300">Logins:</span>
              <span className="font-medium text-blue-600 dark:text-blue-400">
                {stats.daily.find(s => s._id === 'login')?.count || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-300">Logouts:</span>
              <span className="font-medium text-blue-600 dark:text-blue-400">
                {stats.daily.find(s => s._id === 'logout')?.count || 0}
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          whileHover="hover"
          // variants={cardVariants}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700"
        >
          <h2 className="md:text-xl font-light text-sm mb-2  md:font-semibold text-gray-800 dark:text-white md:mb-4">Weekly Activity</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-300">Logins:</span>
              <span className="font-medium text-blue-600 dark:text-blue-400">
                {stats.weekly.find(s => s._id === 'login')?.count || "dont count"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-300">Logouts:</span>
              <span className="font-medium text-blue-600 dark:text-blue-400">
                {stats.weekly.find(s => s._id === 'logout')?.count || 0}
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700"
      >
        <div className="p-6">
          <h2 className="md:text-xl font-light text-sm mb-2  md:font-semibold text-gray-800 dark:text-white md:mb-4">Device & Browser Information</h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="sm:px-6 sm:py-3 px-2 py-1  text-left text-xs  sm:font-medium text-gray-500 dark:text-gray-300 uppercase sm:tracking-wider">Device Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Browser</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">OS</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Device Name</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Count</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <AnimatePresence>
                  {stats.devices.map((device, index) => (
                    <motion.tr
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                        {device._id.deviceType || 'Unknown'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                        {device._id.browser || 'Unknown'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                        {device._id.os || 'Unknown'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                        {device._id.deviceName || 'Unknown'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-blue-600 dark:text-blue-400">
                        {device.count}
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
        
        {stats.devices.length === 0 && (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            No device information available
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default SessionStats;