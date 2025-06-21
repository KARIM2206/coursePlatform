'use client'
import { use, useContext, useEffect, useState } from 'react'
import { Context } from '../CONTEXT/ContextProvider'
import Image from 'next/image'
import { 
  Skeleton, Card, Tag, Button, message, Divider, Typography, 
  Modal, Collapse, Space, List, Avatar, Table,
  Form
} from 'antd'
import { 
  DollarOutlined, UserOutlined, EyeInvisibleOutlined, 
  PlayCircleOutlined, OrderedListOutlined, LinkOutlined
} from '@ant-design/icons'
import { toast } from 'react-toastify'
import Link from 'next/link'
import CoursePlaylists from './CoursePlaylists'
import { enrollCourse, getEnrollments, getQuestions, getQuiz } from '../lib/server'

const { Title, Text, Paragraph } = Typography
const { Panel } = Collapse

const ViewCourse = ({ dict, locale, id }) => {
  const [form] = Form.useForm()
  const { token } = useContext(Context)
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [enrollmentData, setEnrollmentData] = useState(null)
  const [playlistData, setPlaylistData] = useState([])
const [refreshEnrollment, setRefreshEnrollment] = useState(false)
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
 const enrollCourseHandle = async (e) => {
  e.preventDefault();
  try {
    console.log(id, token);

  const enrolledCourse =  await enrollCourse(id, token);
if (!enrolledCourse.success) {
  throw new Error(enrolledCourse.error);
}
    toast.success('Enrolled Successfully');
setRefreshEnrollment(p=>!p);
  } catch (error) {
      toast.error(error.message);
    console.error('Error enrolling course:', error);
    throw new Error(error.message);
  
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
        <Card className="text-center">
          <Title level={4}>Error Loading Course</Title>
          <Text type="danger">{error}</Text>
          <div className="mt-4">
            <Button type="primary" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <Card className="text-center">
          <Title level={4}>Course Not Found</Title>
          <Text>The requested course could not be found.</Text>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-2 md:p-4">
      {/* Main Course View */}
      <div className="flex flex-col gap-4 md:gap-6">
        {/* Course Card */}
        <Card
          cover={
            course.image ? (
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
                <Text type="secondary">No Image Available</Text>
              </div>
            )
          }
          className="shadow-lg mb-4"
        >
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
            {/* Course Info */}
            <div className="flex-1 min-w-0">
              <Title level={2} className="!mb-4">{course.title}</Title>
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Tag icon={<DollarOutlined />} color="green">
                  Price: ${course.price}
                </Tag>
                <Tag icon={<UserOutlined />} color="blue">
                  Instructor ID: {course.teacher}
                </Tag>
              </div>
              <Divider orientation="left">Description</Divider>
              <Paragraph className="text-gray-700 whitespace-pre-line break-words">
                {course.description || 'No description provided'}
              </Paragraph>
            </div>
            
            {/* Stats Card */}
            <div className="md:w-72 w-full flex-shrink-0">
              <Card className="sticky top-4">
                <Title level={4} className="mb-4 flex items-center gap-2">
                  <OrderedListOutlined /> Course Details
                </Title>
                <div className="space-y-3 mb-6">
                  <div>
                    <Text strong>Status:</Text>
                    <div className="mt-1">
                      {enrollmentData?.status ? (
                        <Tag color="green">Available</Tag>
                      ) : (
                        <Tag color="orange">Unavailable</Tag>
                      )}
                    </div>
                  </div>
                  <div>
                    <Text strong>Price:</Text>
                    <div className="mt-1">
                      <Text>${course.price}</Text>
                    </div>
                  </div>
                  <div>
                    <Text strong>Content:</Text>
                    <div className="mt-1">
                      <Text>{playlistData?.length || 0} playlists</Text>
                    </div>
                  </div>
                </div>
           {    !enrollmentData?.status && <Button 
                  type="primary" 
                  block
                  onClick={enrollCourseHandle}
                  disabled={!course.isPublished}
                >
                  Enroll Now
                </Button>}
              </Card>
            </div>
          </div>
        </Card>

        {/* Playlist Section */}
        {/* <Card
          title={
            <div className="flex items-center gap-2">
              <PlayCircleOutlined /> Course Content
            </div>
          }
          className="shadow-lg"
        >
          {playlistData?.length > 0 ? (
            <Collapse accordion>
              {playlistData.map(playlist => (
                <Panel 
                  header={playlist.title} 
                  key={playlist._id}
                  extra={
                    <span className="text-gray-500">
                      {playlist.videos?.length || 0} videos
                    </span>
                  }
                >
                  <List
                    dataSource={playlist.videos || []}
                    renderItem={video => (
                      <List.Item key={video._id}>
                        <div className="flex items-center gap-4 w-full">
                          <Avatar
                            shape="square"
                            src={
                              video.poster
                                ? `http://localhost:5000/${video.poster?.replace(/..\//, '')}`
                                : undefined
                            }
                            icon={<PlayCircleOutlined />}
                            size={64}
                          />
                          <div className="flex-1">
                            <Link
                              href={`http://localhost:4000/${locale}/dashboard/course/${id}/playlist/${playlist._id}/video/${video._id}`}
                              className="text-lg font-medium hover:text-blue-600"
                            >
                              {video.title}
                            </Link>
                            <div className="text-gray-500 text-sm">
                              Video content
                            </div>
                          </div>
                          <Button 
                            type="primary" 
                            icon={<PlayCircleOutlined />}
                            href={`http://localhost:4000/${locale}/dashboard/course/${id}/playlist/${playlist._id}/video/${video._id}`}
                          >
                            Watch
                          </Button>
                        </div>
                      </List.Item>
                    )}
                  />
                </Panel>
              ))}
            </Collapse>
          ) : (
            <div className="text-center py-8">
              <Text type="secondary">No content available for this course yet</Text>
            </div>
          )}
        </Card> */}
     <Card
  title={
    <div className="flex items-center gap-2">
      <PlayCircleOutlined /> Course Content
    </div>
  }
  className="shadow-lg"
>
  {enrollmentData.status ?( playlistData?.length > 0 ? (
    <CoursePlaylists playlistData={playlistData} locale={locale} courseId={id} single={false}/>
  ) : (
    <div className="text-center py-8">
      <Text type="secondary">No content available for this course yet</Text>
    </div>
  )):(
    <div className="text-center py-8">
      <Text type="secondary">You are not enrolled in this course</Text>
      <Button onClick={enrollCourseHandle} >Enroll Now</Button>
    </div>
  )}
</Card>
      </div>
    </div>
  )
}

export default ViewCourse