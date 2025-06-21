import React from 'react'
import ViewCourse from '../../components/ViewCourse';
import { getDictionary } from '@/i18n/server';
import { Breadcrumb } from 'antd';
import Breadcrumbs from '../../components/BreadCrumb';

 const page = async({params}) => {
    const {locale, id} = params;
   const dict=await getDictionary(locale);
 
  return (
    <div className=' '>
      <div className='max-w-6xl mx-auto p-4'>
        <Breadcrumbs/>
      </div>
      
      <ViewCourse dict={dict.createCourse} id={id} locale={locale} /> 
    </div>

  )
}

export default page
