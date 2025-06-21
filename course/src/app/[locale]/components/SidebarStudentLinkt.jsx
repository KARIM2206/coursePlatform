'use client'
import Link from 'next/link'
import React from 'react'

const SidebarStudentLink = ({ locale, link, text, currentPath }) => {

  
  // نحصل على الجزء بعد `/student/`
  const currentSection = currentPath.split('/')[3] || ''
// console.log(currentSection,link);

  const isActive = currentSection === link
console.log(isActive);

  return (
    <Link
      href={`/${locale}/student/${link}`}
      className={` border-gray-300 w-full whitespace-nowrap 
        border-2 px-2 py-3 rounded-xl hover:bg-blue-400 hover:scale-105
        ${isActive==true? 'bg-blue-600 text-white' : ''}
        hover:text-white transition-transform duration-300`}
    >
      {text}
    </Link>
  )
}

export default SidebarStudentLink
