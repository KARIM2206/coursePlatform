'use client'
import Image from 'next/image'
import React, { useContext, useEffect, useState } from 'react'
import { FiArrowDown, FiArrowRight, FiMail } from 'react-icons/fi'
import { FaUserGraduate } from 'react-icons/fa'
import PercentageCircle from '../components/PercantageStudent'
import { getStudentStatsPerCourse } from '../lib/server'
import { Context } from '../CONTEXT/ContextProvider'

const Page = ({ params }) => {
  const { locale } = params
  const { user, token } = useContext(Context)
  const [statsPercentage, setStatsPercentage] = useState([])
  const [loading, setLoading] = useState(true)
  const [openIndex, setOpenIndex] = useState(null)
  const [openPlaylist, setOpenPlaylist] = useState({})

  const getStudentStatsHandle = async () => {
    try {
      const studentStats = await getStudentStatsPerCourse(user?._id, token)
      if (studentStats?.stats && studentStats.stats.length > 0) {
        setStatsPercentage(studentStats.stats)
      }
    } catch (error) {
      setStatsPercentage([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user?._id && token) getStudentStatsHandle()
  }, [user, token])

  return (
    <div className='w-full'>
      <div className='flex gap-6'>
        <div className='md:w-64 md:h-48 w-full h-auto border-[8px] border-black rounded-lg relative'>
          <Image src={`/img-card.png`} alt='no image' fill className='object-cover ' />
        </div>
        <div className='flex-1 w-full'>
          <div className='flex gap-6 flex-col w-full'>
            <span className='text-2xl font-semibold '>{user?.name}</span>
            <div className='w-full h-0.5 bg-gray-400'></div>
          </div>
          <div className='flex flex-col gap-2 mt-12'>
            <div className='flex gap-2 items-center'>
              <FaUserGraduate size={20} color='blue' />
              <span>{user?.role}</span>
            </div>
            <div className='flex gap-2 items-center'>
              <FiMail size={20} color='blue' />
              <span>{user?.email}</span>
            </div>
          </div>
        </div>
      </div>

      <div className='w-full h-0.5 bg-blue-400 my-12'></div>
      {
        statsPercentage.length > 0 ? (
          statsPercentage.map((course, index) => (
            <div key={index} className='w-full my-12'>
              <div
                className='flex items-center justify-between px-4 cursor-pointer'
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <h3 className='text-2xl font-semibold '>{course.courseTitle || course.title}</h3>
                {openIndex === index
                  ? <FiArrowDown size={20} color='blue' />
                  : <FiArrowRight size={20} color='blue' />
                }
              </div>
              {openIndex === index && (
                <div className='w-full my-4'>
                  {course.playlistsStats?.length > 0 ? (
                    course.playlistsStats.map((playlist, pIdx) => (
                      <div key={playlist.playlistId} className='mb-8 border rounded-lg p-4 bg-gray-50'>
                        <div
                          className='flex items-center justify-between cursor-pointer'
                          onClick={() =>
                            setOpenPlaylist(prev => ({
                              ...prev,
                              [playlist.playlistId]: !prev[playlist.playlistId]
                            }))
                          }
                        >
                          <h4 className='text-lg font-semibold'>{playlist.playlistTitle}</h4>
                          {openPlaylist[playlist.playlistId]
                            ? <FiArrowDown size={18} color='blue' />
                            : <FiArrowRight size={18} color='blue' />
                          }
                        </div>
                        {openPlaylist[playlist.playlistId] && (
                          <div className='flex flex-wrap gap-8 mt-4'>
                            <PercentageCircle
                              value={loading ? 0 : playlist.watchedPercent}
                              size={120}
                              primaryColor="#10b981"
                              secondaryColor="#d1fae5"
                              label="Watch %"
                              animationDuration={1.5}
                            />
                            <PercentageCircle
                              value={loading ? 0 : playlist.quizzesPercent}
                              size={120}
                              primaryColor="#3b82f6"
                              secondaryColor="#dbeafe"
                              label="Quizzes %"
                              animationDuration={1.5}
                            />
                            <PercentageCircle
                              value={loading ? 0 : playlist.avgQuizDegree}
                              size={120}
                              primaryColor="#f59e42"
                              secondaryColor="#fef3c7"
                              label="Avg Quiz Degree"
                              animationDuration={1.5}
                            />
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className='text-center text-gray-500'>No Playlists</div>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className='flex justify-center items-center h-[200px] w-full text-center text-2xl font-semibold'>
            No Courses
          </div>
        )
      }
    </div>
  )
}

export default Page