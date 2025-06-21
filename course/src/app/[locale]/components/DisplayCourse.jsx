'use client'

import React, { useContext, useEffect, useState } from 'react'
import { Context } from '../CONTEXT/ContextProvider'
import { FiLoader } from 'react-icons/fi'
import { toast } from 'react-toastify'
import CourseCard from './CourseCard'
import { motion } from 'framer-motion'



const DisplayCourse = ({ locale, dict }) => {
  const { token } = useContext(Context)
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const getCourses = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`http://localhost:5000/api/course/all`, {
        method: 'GET',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to fetch courses')
      }

      const data = await response.json()
      setCourses(data.courses || [])
    } catch (error) {
      console.error('Error fetching courses:', error)
      setError(error instanceof Error ? error.message : 'An unknown error occurred')
      toast.error(error instanceof Error ? error.message : 'Failed to load courses')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getCourses()
  }, [token]) // Re-fetch if token changes

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <FiLoader className="w-10 h-10 text-blue-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Available Courses</h1>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg">
          {error}
          <button 
            onClick={getCourses}
            className="ml-4 px-4 py-2 bg-red-100 hover:bg-red-200 rounded-md text-red-700"
          >
            Retry
          </button>
        </div>
      )}

      {courses.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No courses available at the moment</p>
          <button
            onClick={getCourses}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Refresh
          </button>
        </div>
      )}

      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {courses.map((course, index) => (
          <motion.div key={course._id} variants={fadeInUp} className="course-card">
            <CourseCard course={course} locale={locale} dict={dict} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

export default DisplayCourse