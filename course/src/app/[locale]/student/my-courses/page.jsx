'use client';
import React, { use, useContext, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getYourCourseStudents } from '../../lib/server';
import { Context } from '../../CONTEXT/ContextProvider';
import { FiLoader, FiBookOpen } from 'react-icons/fi';
import CourseCard from '../../components/CourseCard';

const MyCourses = ({params}) => {
   
    
    const {locale}=use(params)
  const { token } = useContext(Context);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getCourse = async () => {
    try {
      setLoading(true);
      setError(null);
      const courseRes = await getYourCourseStudents(token);
      
      if (courseRes.ok) {
        setCourses(courseRes.courses || []);
      } else {
        setError('Failed to load courses. Please try again.');
      }
    } catch (error) {
      console.error('Error fetching course:', error);
      setError('An unexpected error occurred. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      getCourse();
    }
  }, [token]);


  if (!token) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        >
          <FiLoader className="text-blue-500" size={40} />
        </motion.div>
      </div>
    );
  }

  return (
    <div className=" w-full px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Courses</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          {loading ? 'Loading your courses...' : `You have ${courses.length} course${courses.length !== 1 ? 's' : ''}`}
        </p>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded"
        >
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </motion.div>
      )}

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden h-full"
            >
              <div className="animate-pulse">
                <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
                <div className="p-4 space-y-3">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : courses.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 text-blue-500 mb-4">
            <FiBookOpen size={24} />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">No courses found</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            You haven't enrolled in any courses yet.
          </p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence>
            {courses.map((course, i) => (

              <motion.div
                key={course.id || i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                layout

              >
                <CourseCard course={course} locale={locale} isCourseStudent={true} courseId={course?._id}/>
              </motion.div>
         
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

export default MyCourses;