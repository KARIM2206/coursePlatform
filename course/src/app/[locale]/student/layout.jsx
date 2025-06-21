'use client'
import Image from "next/image";
import SidebarStudintDisplayLinks from "../components/SidebarStudintDisplayLinks";
import { FiUser } from "react-icons/fi";
import { usePathname } from "next/navigation";
import { use } from "react";

export default  function RootLayout({children,params}) {
  const {locale}=use(params)
const pathname = usePathname();

const path=pathname.split('/')[2];
  return (
 <div className='px-12 pt-12'>

     <div className='w-full h-80   -z-10 sticky  top-4'>
      <Image src="/student-bg-2.jpeg" alt="logo" fill className='object-cover w-full h-64 rounded-lg' />
     </div>
       
     <div className='bg-white mx-auto w-[96%] px-4 py-4 -mt-24 flex flex-col gap-6 rounded-lg shadow-lg relative'>
    <div className='flex-1 flex items-center justify-center'>
      <div className='w-fit pl-4 rounded-full bg-white border border-gray-300 flex justify-between items-center'>
        <span className='text-xl font-semibold mr-4'>Profile</span>
        <span className='text-2xl bg-blue-600 text-white w-16 h-12 flex justify-center items-center
         rounded-full'><FiUser /></span>
      </div>
    </div>

       <div className='p-8 relative w-full h-full mb-4 flex z-20 gap-4 md:gap-8 lg:gap-12 '>
    {/* Sidebar على اليسار في الشاشات الكبيرة، فوق في الشاشات الصغيرة */}
    <div className='w-full lg:w-1/4 mb-6 lg:mb-0'>
      <SidebarStudintDisplayLinks locale={locale} path={path}/>
    </div>
    
    {children}

  </div> 
  
    </div>
  

    </div>
  );
}
