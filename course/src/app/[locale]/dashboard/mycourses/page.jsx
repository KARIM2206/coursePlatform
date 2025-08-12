'use client'
import React, { use, useContext, useEffect, useState } from 'react'
import { getAllTeacherCourses } from '../../lib/server';
import { Context } from '../../CONTEXT/ContextProvider';
import { FiLoader } from 'react-icons/fi';
import CourseCard from '../../components/CourseCard';
import Breadcrumbs from '../../components/BreadCrumb';

const MyCourses = ({params}) => {
    const {token}=useContext(Context)
    const {locale}=use(params)
    const [courseTeacher,setCourseTeacher] = useState([]);  
    const getCourseTeacher = async () => {
        try {
            const data=await getAllTeacherCourses(token)
       
            setCourseTeacher(data.courses);
            
        } catch (error) {
            
        }
    }
    useEffect(() => {
      if(!token ) return;
        getCourseTeacher();
 
    },[token])
    if (!token) return <FiLoader className='animate-spin text-2xl' />;
           console.log(locale);
  return (
    <div className='max-w-7xl mx-auto px-4 py-8 flex flex-col gap-4'>
    <Breadcrumbs />

         <div className='grid grid-cols-1   sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full items-stretch' >{
       
        courseTeacher?.map((course,index) => (
     
          <CourseCard 
            key={index} 
            course={course} 
            locale={locale} 
            dict={null} 
            isTeacher={true}
            courseId={course._id}
          />
   
        ))
      } 
          </div>
    </div>
  )
}

export default MyCourses
