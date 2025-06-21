'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function TeacherHeroSection({ teacher,locale }) {
  const [isImageLoaded, setIsImageLoaded] = useState(teacher.imgLoaded);
const router=useRouter()
  return (
    <section className="bg-gradient-to-br from-blue-50 via-white to-blue-100 
    p-6 md:p-10 lg:p-12 rounded-3xl shadow-sm border
     border-blue-100 mb-8 h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center
         justify-between gap-8 md:gap-12 padding-x padding-y">
          {/* Left: Text */}
          <motion.div
            className="md:w-2/3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="mb-6">
              <motion.h1 
                className="text-4xl md:text-5xl font-bold text-blue-900 mb-4"
                initial={{ y: 10 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.1 }}
              >
                أهلاً بك، {teacher.name} <motion.span 
                  className="inline-block"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                >👋</motion.span>
              </motion.h1>
              <motion.p 
                className="text-gray-700 text-lg md:text-xl leading-relaxed max-w-2xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                نتمنى لك يومًا دراسيًا مميزًا! يمكنك البدء في إدارة دوراتك أو إضافة دورة جديدة الآن.
              </motion.p>
            </div>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <motion.button
                whileHover={{ 
                  scale: 1.03,
                  boxShadow: "0 10px 20px -5px rgba(5, 150, 105, 0.2)"
                }}
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-8 py-3.5 rounded-xl font-semibold hover:shadow-md transition-all padding-input duration-300 flex items-center gap-2"
                aria-label="إنشاء دورة جديدة"
                onClick={() => router.push (`/${locale}/create-course`)}
              >
                <span>إنشاء دورة جديدة</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
              </motion.button>
              <motion.button
                whileHover={{ 
                  scale: 1.03,
                  boxShadow: "0 10px 20px -5px rgba(5, 150, 105, 0.1)"
                }}
                whileTap={{ scale: 0.98 }}
                className="bg-white text-blue-600 border-2 padding-input border-blue-200 px-8 py-3.5 rounded-xl font-semibold hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 flex items-center gap-2"
                aria-label="عرض كل الدورات"
              >
                <span>عرض كل الدورات</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right: Image */}
          <motion.div
            className="relative w-40 h-40 md:w-56 md:h-56 rounded-full overflow-hidden border-[5px] border-white shadow-lg"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              duration: 0.6, 
              delay: 0.3,
              type: "spring",
              stiffness: 100,
              damping: 10
            }}
            whileHover={{ scale: 1.03 }}
          >
            {!isImageLoaded && (
              <div className="absolute inset-0 bg-gradient-to-br from-blue-200 to-blue-100 animate-pulse" />
            )}
            <img
              src={teacher.image || '/logo.png'}
              alt={`صورة ${teacher.name}`}
              className={`w-full h-full object-cover transition-all duration-500 ${isImageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
              onLoad={() => setIsImageLoaded(true)}
              onError={() => setIsImageLoaded(true)}
            />
            {isImageLoaded && (
              <motion.div 
                className="absolute inset-0 rounded-full border-[12px] border-blue-50 opacity-70"
                initial={{ scale: 1.1 }}
                animate={{ scale: 1.2 }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}