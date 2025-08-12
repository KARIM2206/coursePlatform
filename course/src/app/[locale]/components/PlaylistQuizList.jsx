'use client'
import React from 'react'
import NoData from './NoData';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
const PlaylistQuizList = ({ quizzes, locale, courseId, playlistId,isEnroll }) => {
    const router = useRouter();
    
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
         className="space-y-3">
            {quizzes?.length > 0 ? (
                quizzes.map((quiz) => (
                    <div
                        key={quiz._id}
                        role="button"
                        tabIndex={0}
                        aria-label={`Quiz: ${quiz.title}. Press enter to start.`}
                        className={`
                            flex justify-between items-center 
                            px-4 py-3 
                            rounded-lg 
                            shadow-xs 
                            border border-gray-200 
                            transition-all 
                            ${isEnroll ? 'bg-blue-100 border-blue-400 cursor-pointer' : 'hover:bg-blue-50 pointer-events-none border-gray-200'}
                           
                            bg-white 
                            hover:bg-gray-50 
                            active:bg-gray-100 
                            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
                        `}
                        onClick={() => router.push(`/${locale}/course/${courseId}/quiz/${quiz._id}`)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                router.push(`/${locale}/course/${courseId}/quiz/${quiz._id}`);
                            }
                        }}
                    >
                        <span className="font-medium text-gray-800 truncate max-w-[70%]">
                            {quiz.title}
                        </span>
                        
                        <Link 
                            href={`/${locale}/course/${courseId}/quiz/${quiz._id}`}
                            className={`
                                px-4 py-2 
                                rounded-md 
                                text-white 
                                bg-blue-600 
                                hover:bg-blue-700 
                                active:bg-blue-800 
                                ${isEnroll ? 'cursor-pointer' : 'pointer-events-none'}
                                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                                transition-colors
                                text-sm font-medium
                            `}
                            onClick={(e) => e.stopPropagation()}
                        >
                            Start
                        </Link>
                    </div>
                ))
            ) : (
                <NoData data={'Quizzes'} />
            )}
        </motion.div>
    )
}

export default PlaylistQuizList