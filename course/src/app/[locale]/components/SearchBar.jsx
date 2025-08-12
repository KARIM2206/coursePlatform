'use client'
import React, { useEffect, useRef } from 'react'
import { FiSearch } from 'react-icons/fi'
import { getAllCourses } from '../lib/server'
import { Context } from '../CONTEXT/ContextProvider'
import SearchResult from './SearchResult'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

const SearchBar = (params) => {
     const modalRef = useRef(null)
  const loc = usePathname()
  const { locale } = params
  const [searchValue, setSearchValue] = React.useState('')    
  const [isOpen, setIsOpen] = React.useState(false)    
  const [courses, setCourses] = React.useState([])    
  const { token } = React.useContext(Context)
   useEffect(() => {
      const handleClickOutside = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
         setIsOpen(false) 
        }
      }
  
      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside)
      }
  
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }, [isOpen, setIsOpen])
  const handleSearch = async(value) => {
    setSearchValue(value)
    setIsOpen(true)
    try {
      const data = await getAllCourses(token, 1, 5, '', value)
      if (!data.ok) {
        throw new Error(data.message || 'Failed to fetch courses')
      }
      setCourses(data.courses)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className='relative w-full max-w-lg mx-auto'>
      {/* Search Input */}
      <div className='flex items-center justify-between border-2 focus-within:border-blue-600 bg-white rounded-full shadow-lg px-3 py-1 md:p-3 w-full'>
        <input 
          type="text" 
          value={searchValue} 
          onChange={(e) => handleSearch(e.target.value)} 
          placeholder="Search courses..." 
          id='search' 
          className='bg-transparent border-none outline-none px-4 w-full' 
        />
        <label htmlFor="search" className='cursor-pointer'>
          <FiSearch size={20} className='text-gray-500'/>
        </label>
      </div>
      
      {/* Search Results Dropdown */}
      <AnimatePresence>
        {searchValue && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            ref={modalRef}
            className="absolute top-full left-0 mt-4 w-full bg-white shadow-xl rounded-lg overflow-hidden z-50"
          >
            {courses?.length > 0  ? (
              <motion.ul
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                className="divide-y divide-gray-100"
              >
                { isOpen && courses.map((course) => (
                  <motion.li
                    key={course._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <SearchResult
                      poster={course.image}
                      locale={loc.split('/')[1]}
                      title={course.title}
                      courseId={course._id}
                    />
                  </motion.li>
                ))}
              </motion.ul>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 text-center text-gray-500"
              >
                No courses found
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default SearchBar