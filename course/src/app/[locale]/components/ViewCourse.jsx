'use client'
import { use, useContext, useEffect, useState } from 'react'
import { Context } from '../CONTEXT/ContextProvider'
import Image from 'next/image'
import { 
  Skeleton
} from 'antd'

import { toast } from 'react-toastify'
import Link from 'next/link'
import CoursePlaylists from './CoursePlaylists'
import { checkOutCourse, enrollCourse, getEnrollments, getQuestions, getQuiz } from '../lib/server'
import StarRating from './StarRating'
import { FiDollarSign, FiList, FiUser, FiVideo } from 'react-icons/fi'
import { useRouter } from 'next/navigation'


const ViewCourse = ({ dict, locale, id }) => {

  const { token } = useContext(Context)
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [enrollmentData, setEnrollmentData] = useState(null)
  const [playlistData, setPlaylistData] = useState([])
const [refreshEnrollment, setRefreshEnrollment] = useState(false)
const [productRating, setProductRating] = useState(0);
const router=useRouter()
  const getCourse = async (id) => {
    try {
      setLoading(true)
      const response = await fetch(`http://localhost:5000/api/course/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        } 
      })

      const data = await response.json()
      setCourse(data.course || data)
      return data
    } catch (error) {
      console.error('Error fetching course:', error)
      setError(error.message)
      return null
    } finally {
      setLoading(false)
    }
  }

  const getPlaylists = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/playlist/course/${id}/playlists`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch playlists');
      
      const data = await response.json();
      const playlistsWithVideos = await Promise.all(
        data.playLists.map(async (playlist) => {
          let videos = [];
       let quizzes=[]
          try {
            const res = await fetch(`http://localhost:5000/api/video/playlist/${playlist._id}/videos`, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${token}`,
              }
            });
            if (res.ok) {
              const videoData = await res.json();
              videos = videoData.videos || [];
            }
          } catch (err) {
            console.error('Error fetching videos:', err);
          }
           try {
              const quizData = await getQuiz(playlist._id, token); // يجب أن تعيد مصفوفة الكويزات
              console.log(quizData);
              
    quizzes = await Promise.all(
      (quizData || []).map(async (quiz) => {
        let questions = [];
        try {
          const questionRes = await getQuestions(quiz._id, token);
          questions = questionRes?.questions || [];
        } catch (err) {}
        return { ...quiz, questions };
      })
    );
    
            } catch (err) {
              console.error(err);
            }
          return { ...playlist, videos ,quizzes };
        }
     
      )
      );

      setPlaylistData(playlistsWithVideos);
    } catch (error) {
      console.error('Error fetching playlists:', error);
    }
  };
 const checkoutCourseHandle = async (e) => {
  e.preventDefault();
  try {
    const data=await checkOutCourse(id,token)
    if(!data.ok){
       toast.error(data.error);
      throw new Error(data.error)
     
    }

  router.push(data.url)
  } catch (error) {
    
  }

}

 const addToCartCourseHandle = async (e) => {
  e.preventDefault();
  try {
    
  } catch (error) {
    
  }

}
const getEnrollmentCoursHandle=async()=>{
  try {
    const enrolledCourse =  await getEnrollments(id, token);
    console.log(enrolledCourse);
    
if (!enrolledCourse.success) {
 
  
  throw new Error(enrolledCourse.message);
}
setEnrollmentData(enrolledCourse.enrollment)
 
  } catch (error) {
    console.error('Error enrolling course:', error);
    throw new Error(error);
  
  }
}
  useEffect(() => {
    if (!token) return;  
    getCourse(id);
    getPlaylists();
 
    
  }, [id, token])
  
  useEffect(() => {
    if (!token) return;  
    getEnrollmentCoursHandle();
 console.log(enrollmentData);
 
    
  }, [id, token,refreshEnrollment])


  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <Skeleton active paragraph={{ rows: 8 }} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-primary-700">Error Loading Course</h2>
          <p className='text-red-500'>{error}</p>
          <div className="mt-4">
            <button className="bg-white text-red-600 px-4 py-2 rounded-md" onClick={() => window.location.reload()}>
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="max-w-6xl mx-auto py-4 pl-4">
        <div className="text-center">
          <h2 className='text-3xl font-bold text-primary-700'>Course Not Found</h2>
          <p>The requested course could not be found.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-2 md:p-4">
    
      <div className="flex flex-col gap-4 md:gap-6">
        {/* Course Card */}
        <div
          
       
          
          className="shadow-lg mb-4"
        >
       {        course.image ? (
              <div className="relative w-full h-48 bg-primary sm:h-64 md:h-96 overflow-hidden">
                <Image
                  src={`http://localhost:5000/${course.image}`}
                  alt={course.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            ) : (
              <div className="h-48 sm:h-64 bg-gray-200 flex items-center justify-center">
                <p className="text-gray-500">No Image Available</p>
              </div>
            )}
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6 px-6 py-3">
            {/* Course Info */}
            <div className="flex-1 min-w-0">
              <h2 className="!mb-4">{course.title}</h2>
              
             <div className="flex items-center my-4">
  <div className="w-[15%] border-t border-dotted border-black"></div>
  <span className="mx-4 text-black whitespace-nowrap">Description</span>
  <div className="flex-grow border-t border-black"></div>
</div>

              <p className="text-gray-700 whitespace-pre-line break-words">
                {course.description?.length>100?course.description?.slice(0,100)+"...":course.description || 'No description provided'}
              </p>
            </div>
            
            {/* Stats div */}
            <div className="md:w-72 w-full flex-shrink-0 border-l-2 border-gray-200 px-4 shadow-lg ">
              <div className="sticky top-4 my-2">
                <h4  className="mb-4 flex items-center gap-2">
                  <FiList /> Course Details
                </h4>
                <div className="space-y-3 mb-6">
                  <div>
                    <p >Status:</p>
                    <div className="mt-1">
                      {enrollmentData?.status ? (
                        <span className='text-blue-600'>Available</span>
                      ) : (
                        <span className="text-orange-600">Unavailable</span>
                      )}
                    </div>
                  </div>
                  <div className='flex items-center gap-1 '>
                    <span >Price:</span>
                    <div className="mt-1">
                      <span>${course.price}</span>
                    </div>
                  </div>
                  <div className='flex items-center gap-1 '>
                    <span >Content:</span>
                    <div className="mt-1">
                      <p>{playlistData?.length || 0} playlists</p>
                    </div>
                  </div>
                </div>
                <div className='w-full flex flex-col gap-2'>
                     {    !enrollmentData?.status && <button 
                 className='bg-blue-600 text-white px-4 py-2 rounded-md w-full hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed'
                  block
                  onClick={checkoutCourseHandle}
                  disabled={!course.isPublished}
                >
                  
                  CheckOut 
                </button>}
                     {    !enrollmentData?.status && <button 
                 className='bg-white text-grey-600 px-4 py-2 rounded-md w-full hover:bg-blue-700 hover:border-none  0 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed'
                  block
                  onClick={addToCartCourseHandle}
                  disabled={!course.isPublished}
                >
                  
                  add to cart 
                </button>}
                </div>
        
             { enrollmentData?.status && <div className="">
      <h3 className="text-lg font-medium mb-4">Rate this product</h3>
      <StarRating 
        initialRating={productRating}
        onRatingChange={(rating) => setProductRating(rating)}
       
        courseId={id}
      />
      {productRating > 0 && (
        <p className="mt-2 text-gray-600">
          You rated this product {productRating} star{productRating !== 1 ? 's' : ''}
        </p>
      )}
    </div>}
              </div>
            </div>
          </div>
        </div>

     
     <div
  title={
    <div className="flex items-center gap-2">
      <FiVideo/> Course Content
    </div>
  }
  className="shadow-lg"
>
  {( playlistData?.length > 0 ? (
    <div className='flex flex-col gap-4'>
       <CoursePlaylists playlistData={playlistData} locale={locale} courseId={id} single={false} isEnroll={enrollmentData?.status ?true:false}/>
      
    </div>
   
  ) : (
    <div className="text-center py-8">
      <p >No content available for this course yet</p>
    </div>
  ))
//   :(
//     <div className="flex flex-col gap-4 items-center py-8">
//       <p className='text-orange-600'>You are not enrolled in this course</p>
//       <button onClick={enrollCourseHandle}
//                        className='bg-blue-600 text-white px-4 py-2 rounded-md w-fit hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed'
//  >Enroll Now</button>
//     </div>
//   )
  }
</div>
      </div>
    </div>
  )
}

export default ViewCourse