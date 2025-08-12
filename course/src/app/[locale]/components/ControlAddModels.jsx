'use client'
import React, { useRef, useEffect, useState } from 'react'
import ImageDropzone from './ImageDropzone'
import MediaUploader from './MediaUploader'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiSave, FiVideo, FiImage, FiFileText } from 'react-icons/fi'

const ControlAddModel = ({
  course,
  setCourse,
  setImage,
  isVideo,
  videoFile,
  setVideoFile,
  editModalVisible,
  updateModel,
  titleModel,
  formLabel,
  poster,
  isQuiz,
  setEditModalVisible
}) => {
  const modalRef = useRef(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleImageChange = (file) => {
    setImage(file)
  }

  // Close modal when clicking outside
  useEffect(() => {
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
      await updateModel(e)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {editModalVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <motion.div
            ref={modalRef}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
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
              <div className="flex items-center gap-3 mb-6">
                {isVideo ? (
                  <FiVideo className="text-blue-500 text-2xl" />
                ) : isQuiz ? (
                  <FiFileText className="text-purple-500 text-2xl" />
                ) : (
                  <FiImage className="text-green-500 text-2xl" />
                )}
                <h4 className="text-xl font-bold text-gray-800">{titleModel}</h4>
              </div>

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
                    value={course.title || ''}
                    onChange={(e) =>
                      setCourse((prev) => ({ ...prev, title: e.target.value }))
                    }
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

                {!isQuiz &&isVideo && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Video File
                    </label>
                    <ImageDropzone
                      accept={'video'}
                      setFile={ setVideoFile }
                      className="border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 transition-colors"
                    />
                  </motion.div>
                )}
                {!isQuiz && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Course Image
                    </label>
                    <ImageDropzone
                      accept={ "image"}
                      setFile={ setImage}
                      className="border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 transition-colors"
                    />
                  </motion.div>
                )}
              </div>

              <div className="mt-8 flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-5 py-2.5 rounded-lg text-white ${isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} transition-colors flex items-center gap-2`}
                >
                  <FiSave />
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ControlAddModel