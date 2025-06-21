

import { getDictionary } from '@/i18n/server'

import React from 'react'

import CreateCourse from '../components/CreateCourse';

 export default async function  CreateCoursePage ({ params }){

    const locale = params?.locale || "en";
   
    
const dict=await getDictionary(locale)


  return <CreateCourse dict={dict.createCourse} locale={locale} />;
}


