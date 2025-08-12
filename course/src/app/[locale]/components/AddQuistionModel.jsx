'use client'
import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const AddQuestionModel = ({
  options,
  setOptions,
  questionText,
  correctAnswer,
  setOpenAddQuestionModel,
  setCorrectAnswer,
  setQuestionText,
  onAddQuestion,
  quizId,
  openAddQuestionModel,

}) => {
  const modalRef = React.useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setOpenAddQuestionModel(false)
      }
    }

    if (openAddQuestionModel) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [openAddQuestionModel, setOpenAddQuestionModel])

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  }

  const modalVariants = {
    hidden: { y: -50, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', damping: 25, stiffness: 500 }
    },
    exit: { y: 50, opacity: 0 }
  }

  const inputVariants = {
    focus: { scale: 1.02, boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.5)' }
  }

  return (
    <AnimatePresence>
      {openAddQuestionModel && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={backdropVariants}
        >
          <motion.div
            ref={modalRef}
            className="bg-white w-full max-w-lg p-6 rounded-xl shadow-2xl overflow-y-auto max-h-[90vh]"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Add New Question</h2>
              <button
                onClick={() => setOpenAddQuestionModel(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
                aria-label="Close modal"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault()
              onAddQuestion(quizId)
              
            }}>
              <div className="space-y-4">
                {/* Question Input */}
                <motion.div 
                  className="flex flex-col gap-1"
                  whileHover={{ scale: 1.01 }}
                  whileFocus={{ scale: 1.01 }}
                >
                  <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-1">
                    Question Text
                  </label>
                  <motion.textarea
                    id="question"
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    name="question"
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    rows={3}
                    required
                    variants={inputVariants}
                    whileFocus="focus"
                  />
                </motion.div>

                {/* Options */}
                <div className="space-y-3">
                  <p className="text-sm font-medium text-gray-700">Options</p>
                  {options.map((option, index) => (
                    <motion.div 
                      key={index} 
                      className="flex items-center gap-2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex-1">
                        <label htmlFor={`option${index + 1}`} className="sr-only">
                          Option {index + 1}
                        </label>
                        <motion.input
                          type="text"
                          id={`option${index + 1}`}
                          value={option}
                          onChange={(e) => {
                            const newOptions = [...options]
                            newOptions[index] = e.target.value
                            setOptions(newOptions)
                          }}
                          name={`option${index + 1}`}
                          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          required
                          variants={inputVariants}
                          whileFocus="focus"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const newOptions = [...options]
                          newOptions.splice(index, 1)
                          setOptions(newOptions)
                        }}
                        className="p-2 text-red-500 hover:text-red-700 transition-colors"
                        disabled={options.length <= 2}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </motion.div>
                  ))}
                  
                  {options.length < 4 && (
                    <motion.button
                      type="button"
                      onClick={() => setOptions([...options, ''])}
                      className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 mt-2"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add Option
                    </motion.button>
                  )}
                </div>

                {/* Correct Answer */}
                <motion.div 
                  className="flex flex-col gap-1 mt-4"
                  whileHover={{ scale: 1.01 }}
                >
                  <label htmlFor="correctAnswer" className="block text-sm font-medium text-gray-700 mb-1">
                    Correct Answer
                  </label>
                  <select
                    id="correctAnswer"
                    value={correctAnswer}
                    onChange={(e) => setCorrectAnswer(e.target.value)}
                    name="correctAnswer"
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    required
                  >
                    <option value="">Select correct answer</option>
                    {options.map((option, index) => (
                      <option key={index} value={option}>
                        Option {index + 1}: {option || '[Empty]'}
                      </option>
                    ))}
                  </select>
                </motion.div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <motion.button
                  type="button"
                  onClick={() => setOpenAddQuestionModel(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Add Question
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default AddQuestionModel