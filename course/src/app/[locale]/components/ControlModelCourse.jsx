'use client'
import React, { useEffect, useRef, useState } from 'react'
import ImageDropzone from './ImageDropzone'
import { FiLoader, FiX, FiCheck, FiDollarSign, FiEdit2, FiToggleLeft, FiToggleRight } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'

const ControlModelCourse = ({
  course,
  setCourse,
  setImage,
  editModalVisible,
  updateModel,
  titleModel,
  formLabel,
  isVideo,
  isQuiz,
  setEditModalVisible
}) => {
  const modalRef = useRef(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Close modal when clicking outside
  useEffect(() => {
    if (!course?.title) return
    
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal()
      }
    }

    if (editModalVisible) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [editModalVisible, setEditModalVisible])

  const closeModal = () => {
    setEditModalVisible(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await updateModel()
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!editModalVisible) return null
  // if (!course?.title) return (
  //   <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
  //     <FiLoader className="animate-spin text-2xl text-white" />
  //   </div>
  // )

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm"
      >
        <motion.div
          ref={modalRef}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          transition={{ type: 'spring', damping: 25 }}
          className="bg-white w-full max-w-lg p-6 rounded-xl shadow-2xl overflow-y-auto max-h-[90vh] relative"
        >
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close modal"
          >
            <FiX className="text-gray-500 text-xl" />
          </button>

          <form onSubmit={handleSubmit}>
            <h4 className="text-xl font-bold mb-6 text-gray-800">{titleModel}</h4>

            <div className="space-y-5">
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {formLabel.title}
                </label>
                <input
                  type="text"
                  value={course?.title || ''}
                  onChange={(e) => setCourse({ ...course, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  required
                />
              </motion.div>

              {!isVideo && !isQuiz && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {formLabel.description}
                  </label>
                  <textarea
                    value={course.description || ''}
                    onChange={(e) =>
                      setCourse((prev) => ({ ...prev, description: e.target.value }))
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all min-h-[100px]"
                    rows={3}
                  />
                </motion.div>
              )}

              {course.price && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="relative"
                >
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {formLabel.price}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiDollarSign className="text-gray-400" />
                    </div>
                    <input
                      type="number"
                      value={course.price}
                      onChange={(e) => setCourse({ ...course, price: e.target.value })}
                      className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                  </div>
                </motion.div>
              )}

              {course.isPublished && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {formLabel.publishStatus}
                  </label>
                  <button
                    type="button"
                    className={`flex items-center w-14 h-8 rounded-full p-1 transition-colors duration-300 ${course.isPublished ? 'bg-blue-500 justify-end' : 'bg-gray-300 justify-start'}`}
                    onClick={() => setCourse({ ...course, isPublished: !course.isPublished })}
                  >
                    <motion.span
                      layout
                      className="w-6 h-6 bg-white rounded-full shadow-md"
                    />
                  </button>
                  <span className="ml-2 text-sm text-gray-600">
                    {course.isPublished ? 'Published' : 'Unpublished'}
                  </span>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Course Image
                </label>
                <ImageDropzone
                  initialFile={course.image ? `http://localhost:5000/${course.image}` : course.poster ? `http://localhost:5000/${course.poster}` : null}
                  setFile={setImage}
                />
              </motion.div>
            </div>

            <div className="mt-8 flex justify-end space-x-3">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={closeModal}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className={`px-4 py-2 rounded-lg text-white ${isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} transition-colors flex items-center`}
              >
                {isSubmitting ? (
                  <>
                    <FiLoader className="animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <FiCheck className="mr-2" />
                    Save Changes
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default ControlModelCourse