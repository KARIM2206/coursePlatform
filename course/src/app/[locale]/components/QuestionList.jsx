'use client'
import React, { useContext, useEffect, useState } from 'react'
import { getProgress, getQuestions, postProgress } from '../lib/server'
import { Context } from '../CONTEXT/ContextProvider'
import { FiLoader } from 'react-icons/fi'
import { useRouter } from 'next/navigation'

const QuestionList = ({ locale, dist, quizId, courseId }) => {

  const { token } = useContext(Context)
  const [questionData, setQuestionData] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedOptions, setSelectedOptions] = useState({})
  const [score, setScore] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const [timer, setTimer] = useState(0)
  const [answered, setAnswered] = useState({})
  const [timerActive, setTimerActive] = useState(true)
const [answers,setAnswers]=useState([])
  const [progressData, setProgressData] = useState(null)
  const [alreadySubmitted, setAlreadySubmitted] = useState(false)
  
const router=useRouter()
// const [progressId,setProgressId]=useState(null)
  const isRTL = locale === 'ar' // Check if Arabic language

  const getAllQuestions = async () => {
  try {
    setLoading(true)
    const resQuestions = await getQuestions(quizId, token, 0, 10)
    setQuestionData(resQuestions?.questions || [])

    try {
      // جلب التقدم لهذا المستخدم وهذا الكويز
      const progressRes = await getProgress(quizId, token)
      // تحقق أن هناك تقدم حقيقي (مثلاً: يوجد score أو submitted)
      if (
        progressRes &&
        progressRes.progress &&
        typeof progressRes.progress.score === 'number'
      ) {
        setProgressData(progressRes.progress)
        setShowResults(true)
        setAlreadySubmitted(true)
      } else {
        setShowResults(false)
        setAlreadySubmitted(false)
      }
    } catch (err) {
      // لا يوجد تقدم سابق، تجاهل الخطأ
      setShowResults(false)
      setAlreadySubmitted(false)
    }
  } catch (error) {
    alert(isRTL ? 'فشل تحميل الأسئلة' : 'Failed to load questions')
  } finally {
    setLoading(false)
  }
}

  useEffect(() => {
    if (token) getAllQuestions()
  }, [token, quizId])

  useEffect(() => {
    let interval
    if (timerActive) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [timerActive])


  const handleOptionSelect = (questionId, optionIndex) => {
    console.log(questionId);
    const answerArray=questionData[currentQuestion].options[optionIndex]

     setAnswers(prev => {
  const existingAnswer=questionData.findIndex(q=>q._id==questionId)
  const newAnswer=[...prev]
  newAnswer[existingAnswer]=answerArray
  return newAnswer
  });
    
    setSelectedOptions(prev => ({
      ...prev,
      [questionId]: optionIndex
    }))
    setAnswered(prev => ({
      ...prev,
      [questionId]: true
    }))
  }

  const handleSubmit = async () => {
    setTimerActive(false)
    let progressId = null
    try {
      // إذا كان المستخدم قد حل الكويز بالفعل، لا ترسل الطلب
      if (alreadySubmitted) {
        alert(isRTL ? "لقد قمت بحل هذا الكويز من قبل" : "You have already submitted this quiz.")
        return
      }
      console.log(answers,"en question list");
      
      const result = await postProgress(quizId, token, answers)
      console.log(result);
      
      if (result && result.success) {
        progressId = result.progress._id
        setProgressData(result.progress)
        setShowResults(true)
        setAlreadySubmitted(true)
      } else if (result && result.message && result.message.includes('already')) {
        setAlreadySubmitted(true)
        alert(isRTL ? "لقد قمت بحل هذا الكويز من قبل" : "You have already submitted this quiz.")
        router.push(`/${locale}/course/${courseId}`)
        // يمكنك جلب التقدم هنا إذا أردت
      }
    } catch (error) {
      if (error.message && error.message.includes('already')) {
        setAlreadySubmitted(true)
        alert(isRTL ? "لقد قمت بحل هذا الكويز من قبل" : "You have already submitted this quiz.")
          router.push(`/${locale}/course/${courseId}`);
      } else {
        alert(isRTL ? "حدث خطأ أثناء تسليم الكويز" : "Error submitting quiz")
      }
    }
  }

const handlePreviousOptions=()=>{
  setCurrentQuestion(prev=>Math.max(0,prev-1))
  
}
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
  }

  if (!token) return (
    <div className="flex justify-center items-center h-64">
      <FiLoader className="animate-spin text-2xl text-blue-500" />
    </div>
  )

  if (loading) return (
    <div className={`p-6 space-y-6 ${isRTL ? 'text-right' : 'text-left'}`}>
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-gray-200 p-4 rounded-lg mb-4 h-32 animate-pulse"></div>
      ))}
    </div>
  )

  return (
    <div className={`bg-gray-50 min-h-screen p-4 md:p-8 ${isRTL ? 'text-right' : 'text-left'}`}>
      <div className="max-w-3xl mx-auto">
        <div className={`flex ${isRTL ? 'flex-row-reverse' : ''} justify-between items-center mb-6`}>
          <h1 className="text-2xl font-bold text-gray-800">
            {isRTL ? 'أسئلة الاختبار' : 'Quiz Questions'}
          </h1>
          <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            {isRTL ? 'الوقت: ' : 'Time: '}{formatTime(timer)}
          </div>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
          <div 
            className="bg-indigo-600 h-2.5 rounded-full" 
            style={{ width: `${((currentQuestion + 1) / questionData.length) * 100}%` }}
          ></div>
        </div>

        {questionData.length > 0 && (
          <div 
            className={`mb-6 bg-white p-6 rounded-lg shadow-md ${isRTL ? 'text-right' : 'text-left'}`}
          >
            <div className={`flex ${isRTL ? 'flex-row-reverse' : ''} items-start mb-4`}>
              <span className="bg-indigo-100 text-indigo-800 font-bold rounded-full w-8 h-8 flex items-center justify-center mx-3">
                {currentQuestion + 1}
              </span>
              <h2 className="text-xl font-semibold text-gray-800">
                {questionData[currentQuestion]?.questionText}
              </h2>
            </div>

            <div className="space-y-3">
              {questionData[currentQuestion]?.options?.map((option, i) => (
                <div 
                  key={i}
                  className={`p-3 rounded-lg border border-gray-200 cursor-pointer transition-all ${
                    selectedOptions[questionData[currentQuestion]?._id] === i 
                      ? 'bg-indigo-50 border-indigo-300' 
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => handleOptionSelect(questionData[currentQuestion]._id, i)}
                >
                  <div className={`flex ${isRTL ? 'flex-row-reverse' : ''} items-center`}>
                    <div className={`w-5 h-5 rounded-full border-2 ${
                      selectedOptions[questionData[currentQuestion]?._id] === i 
                        ? 'border-indigo-600 bg-indigo-600' 
                        : 'border-gray-300'
                    } flex items-center justify-center mr-2`}>
                      {selectedOptions[questionData[currentQuestion]?._id] === i && (
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      )}
                    </div>
                    <span className={`${isRTL ? 'mr-2' : 'ml-2'} text-gray-700`}>{option}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className={`flex ${isRTL ? 'flex-row-reverse' : ''} justify-between mt-6`}>
              <button
                onClick={() => handlePreviousOptions()}
                disabled={currentQuestion === 0}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50"
              >
                {isRTL ? 'السابق' : 'Previous'}
              </button>
              
              {currentQuestion < questionData.length - 1 ? (
                <button
                  onClick={() => setCurrentQuestion(prev => prev + 1)}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                  disabled={!answered[questionData[currentQuestion]?._id]}
                >
                  {isRTL ? 'التالي' : 'Next'}
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  {isRTL ? 'تسليم الاختبار' : 'Submit Quiz'}
                </button>
              )}
            </div>
          </div>
        )}

        {showResults && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white max-h-[600px] overflow-y-auto scrollbar rounded-lg p-6 max-w-md w-full">
              <h2 className="text-2xl font-bold mb-4">
                {isRTL ? 'نتائج الاختبار' : 'Quiz Results'}
              </h2>
              
              <div className="flex justify-center mb-6">
                <div className="relative w-32 h-32">
                  <svg className="w-full h-full" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#e6e6e6"
                      strokeWidth="3"
                    />
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke={progressData.score / progressData.total > 0.7 ? '#52c41a' : progressData.score / progressData.total > 0.4 ? '#faad14' : '#f5222d'}
                      strokeWidth="3"
                      strokeDasharray={`${(progressData.score / progressData.total) * 100}, 100`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-2xl font-bold">
                      {progressData.score}/{progressData.total}
                    </span>
                    <span className="text-sm text-gray-500">
                      {isRTL ? 'نقاط' : 'Points'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {questionData.map((question, i) => (
                  <div key={i} className={`flex ${isRTL ? 'flex-row-reverse' : ''} items-start`}>
                    {selectedOptions[question._id] === question.options.indexOf(question.correctAnswer) ? (
                      <span className="text-green-500 mt-1">✓</span>
                    ) : (
                      <span className="text-red-500 mt-1">✗</span>
                    )}
                    <div className={`${isRTL ? 'mr-2' : 'ml-2'}`}>
                      <p className="font-medium">{question.questionText}</p>
                      <p className="text-sm text-gray-600">
                        {isRTL ? 'الإجابة الصحيحة: ' : 'Correct answer: '}
                        {question.correctAnswer}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  setShowResults(false)
                 router.push(`/${locale}/course/${courseId}`)                      
                  
                }}
                className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                {isRTL ? 'إغلاق' : 'Close'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default QuestionList