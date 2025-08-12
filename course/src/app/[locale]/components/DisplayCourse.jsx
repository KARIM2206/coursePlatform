'use client'

import React, { useContext, useEffect, useState } from 'react'
import { Context } from '../CONTEXT/ContextProvider'
import { FiLoader } from 'react-icons/fi'
import { toast } from 'react-toastify'
import CourseCard from './CourseCard'
import { motion } from 'framer-motion'
import { getAllCourses } from '../lib/server'
import About from './About'



const DisplayCourse = ({ locale, dict }) => {
  const { token,user } = useContext(Context)
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
const limit = 99999
const [skip,setSkip]=useState(0)
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

  const getAllCoursesData = async () => {
    try {
      setLoading(true)
      setError(null)
  const data=await getAllCourses(token,skip,limit,"","")    
  
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
    getAllCoursesData()
  }, [token]) 

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
            onClick={getAllCoursesData}
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
            onClick={getAllCoursesData}
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
        id='list'
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {courses.map((course, index) => (
          <motion.div key={course._id} variants={fadeInUp} className="course-card">
            <CourseCard course={course} locale={locale} dict={dict} courseId={course._id} isAddToCart={course?.subscribers?.includes(user?._id)|| course?.teacher===user?._id?false:true}/>
          </motion.div>
        ))}
      </motion.div>

      <About />
    </div>
  )
}

export default DisplayCourse