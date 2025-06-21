import React from 'react'
import ViewCourseTeacher from '../../../components/ViewCourseTeacher';
import { getDictionary } from '@/i18n/server';

 const page = async({params}) => {
    const {locale,id} = params;
   const dict=await getDictionary(locale);
 
  return (
 <ViewCourseTeacher dict={dict.createCourse} locale={locale} id={id} />
  )
}

export default page

// import CoursePageClient from '../../../components/CoursePageClient'
// import { getDictionary } from '@/i18n/server'

// const Page = async ({ params }) => {
//   const { locale, id } = params
//   const dict = await getDictionary(locale)

//   return <CoursePageClient dict={dict.createCourse} locale={locale} id={id} />
// }

// export default Page
// 
