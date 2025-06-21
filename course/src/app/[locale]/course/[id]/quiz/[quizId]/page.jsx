import QuestionList from '@/app/[locale]/components/QuestionList'
import { getDictionary } from '@/i18n/server'
import React from 'react'

const QuestionViewer =async ({params}) => {
   const {locale,id,quizId}=params
   const dict=await getDictionary(locale)
   
  return (
      <div className='max-w-6xl mx-auto p-4'>
   <QuestionList locale={locale} dist={dict} quizId={quizId} courseId={id}/>
    </div>
  )
}

export default QuestionViewer
