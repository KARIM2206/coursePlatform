'use client'
import { use, useContext, useEffect, useState } from 'react'
import { Context } from '../CONTEXT/ContextProvider'
import Image from 'next/image'


import { 
  Skeleton, Card, Tag, Button, message, Divider, Typography, 
  Modal, Form, Input, InputNumber, Switch, Upload, Collapse, 
  Space, Popconfirm, List, Avatar, 
  Table
} from 'antd'
import { 
  DollarOutlined, UserOutlined, EyeInvisibleOutlined, 
  EditOutlined, DeleteOutlined, PlusOutlined, 
  UploadOutlined, PlayCircleOutlined, OrderedListOutlined, 
  LinkOutlined
} from '@ant-design/icons'
import { toast } from 'react-toastify'
import Link from 'next/link'
import { addQuestion, addQuiz, deleteQuestionInServer, deleteQuiz, editQuestionInServer, getQuestions, getQuiz } from '../lib/server'
import PlaylistSection from './PlaylistSection'
// import { s } from 'framer-motion/dist/types.d-CtuPurYT'

const { Title, Text, Paragraph } = Typography
const { Panel } = Collapse
const { TextArea } = Input

const ViewCourseTeacher = ({ dict, locale, id }) => {
  const [form] = Form.useForm()
  const { token } = useContext(Context)
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [playlistModalVisible, setPlaylistModalVisible] = useState(false)
  const [videoModalVisible, setVideoModalVisible] = useState(false)
  const [newVideoTitle, setNewVideoTitle] = useState('')
  const [newVideoUrl, setNewVideoUrl] = useState('')
  const [playListTitle, setPlayListTitle] = useState('')
  const [playListDescription, setPlayListDescription] = useState('')
  const [poster, setPoster] = useState('')
  const [posterPlaylist, setPosterPlaylist] = useState('')
  const [videoFile, setVideoFile] = useState(null);
  const [videoPoster, setVideoPoster] = useState(null);
  const [playlistId, setPlaylistId] = useState(null);
  const [videoInPlaylist, setVideoInPlaylist] = useState(null);
const [editPlaylistModalVisible, setEditPlaylistModalVisible] = useState(false);
const [editVideoModalVisible, setEditVideoModalVisible] = useState(false);
const [editPlaylistId, setEditPlaylistId] = useState(null);
const [editVideoId, setEditVideoId] = useState(null);
const [editVideo,setEditVideo]=useState(null);
const [posterPreview, setPosterPreview] = useState(null);
const [quizData, setQuizData] = useState([]);
  const [quizTitle, setQuizTitle] = useState('');
  const [quizModalVisible, setQuizModalVisible] = useState(false);
  const [currentQuizPlaylistId, setCurrentQuizPlaylistId] = useState(null);
 const[currentQuizId, setCurrentQuizId] = useState(null);
 const [questionModelVisable, setQuestionModalVisible] = useState(false);
  const [playlistData, setPlaylistData] = useState([])
const [questionText, setQuestionText] = useState('');
const [options, setOptions] = useState(['', '', '', '']);
const [correctAnswer, setCorrectAnswer] = useState('');
const [currentQuestionId,setCurrentQuestionId]=useState(null);
const [editVisible, setEditVisible] = useState(false)
const[editQuestionData,setEditQuestionData]=useState([])
const [refresh, setRefresh] = useState(false)

  const getCourse = async (id) => {
  
    
    try {
      setLoading(true)
      const response = await fetch(`http://localhost:5000/api/course/teacher/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
         
        } 
      })

    //   if (!response.ok) {
    //     throw new Error(response.statusText || 'Failed to fetch course data')
    //   }
      
      const data = await response.json()
      console.log(data);
      setCourse(data.course || data) // Use data.course if it exists, otherwise use data directly
      return data
    } catch (error) {
      console.error('Error fetching course:', error)
      setError(error.message)
      return null
    } finally {
      setLoading(false)
    }
  }

const addNewPlaylist = async () => {
    try {
      const formData = new FormData()
      console.log(poster,playListDescription,playListTitle,localStorage?.getItem('courseToken'));
      formData.append('title', playListTitle)
      formData.append('description', playListDescription)
      formData.append('poster', poster)
      formData.append('course', id)
      
      const response = await fetch(`http://localhost:5000/api/playlist/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'courseToken': `Bearer ${localStorage?.getItem('courseToken')}`,
        
        },
        body: formData
      })

      if (!response.ok) {
        throw new Error('Failed to add video to playlist')
      }

      const data = await response.json()
      console.log(data);
      localStorage.setItem('playlistToken', data.playlistToken)
      setCourse(data)
      setPlayListDescription('')
      setPlayListTitle('')
      setPoster(null)
      setRefresh(!refresh)
      setPlaylistModalVisible(false)
      toast.success('Video added to playlist successfully')
    } catch (error) {
      console.error('Error adding video:', error)
      toast.error(error.message)
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
    if (!response.ok) {
      throw new Error('Failed to fetch playlists');
    }
    const data = await response.json();


    const playlistsWithData = await Promise.all(
      data.playLists.map(async (playlist) => {
        let videos = [];
        let quizzes = [];

        // جلب الفيديوهات
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
          // يمكن تجاهل الخطأ أو طباعته
        }

        // جلب الكويزات مع الأسئلة
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

        return { ...playlist, videos, quizzes };
      })
    );
    setPlaylistData(playlistsWithData);
  } catch (error) {
    console.error('Error fetching playlists:', error);
  }
};
const deletePlaylist = async (playlistId) => {
  try {
    const response = await fetch(`http://localhost:5000/api/playlist/${playlistId}/delete`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    }); 
    if (!response.ok) {
      throw new Error('Failed to delete playlist');
    }
    console.log(response);
    
    const data = await response.json();
    setPlaylistData((prevData) => prevData.filter((playlist) => playlist._id !== playlistId));
    toast.success('Playlist deleted successfully');
  } catch (error) {
    console.error('Error deleting playlist:', error);
    toast.error(error.message);
  }
};
const handleEditPlaylist = (playlist) => {
  setEditPlaylistId(playlist._id);
  setPlayListTitle(playlist.title);
  setPlayListDescription(playlist.description);
  setPosterPlaylist(playlist.poster ? `http://localhost:5000/${playlist.poster.replace(/..\//, '')}` : null);
  setPosterPreview(playlist.poster ? `http://localhost:5000/${playlist.poster.replace(/..\//, '')}` : null);
 
   // Or set to playlist.poster if you want to show current poster
  setEditPlaylistModalVisible(true);
};
const updatePlaylist = async (playlistId) => {
  try {
    const formData = new FormData()
      console.log(poster,playListDescription,playListTitle,localStorage?.getItem('courseToken'));
      formData.append('title', playListTitle)
      formData.append('description', playListDescription)
       if (posterPlaylist && typeof posterPlaylist !== 'string') {
      formData.append('poster', posterPlaylist);
    }
      formData.append('course', id)
    const response = await fetch(`http://localhost:5000/api/playlist/${playlistId}/update`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'courseToken': `Bearer ${localStorage?.getItem('courseToken')}`,
        
        },
        body: formData
      
    }); 
    if (!response.ok) {
      throw new Error('Failed to delete playlist');
    }
    console.log(response);
    
    const data = await response.json();
    console.log(data);
    
    setPlaylistData((prevData) => prevData.filter((playlist) => playlist._id !== playlistId));
    toast.success('Playlist deleted successfully');
  } catch (error) {
    console.error('Error deleting playlist:', error);
    toast.error(error.message);
  }
};

  
useEffect(() => {
  if (token == null) return;  
  
  getPlaylists()
 
//   getCourse(id)
// getVideoInPlaylist(playlistId)

  
}, [id, token, refresh])
// useEffect(() => {
//   if (token == null) return;
//   console.log(playlistId);
  
//   if (playlistId) {
//     (playlistId)
//   }
// }, [playlistId, refresh,token])

const handlePosterChange = (info) => {
  if (info.fileList && info.fileList.length > 0) {
    const file = info.fileList[0].originFileObj;
    setPosterPlaylist(file);
    setPosterPreview(URL.createObjectURL(file)); // توليد معاينة مؤقتة
  } else {
    setPosterPlaylist(null);
    setPosterPreview(null);
  }
};
const updateCourse = async (values) => {
  try {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
 
      
       if (key !== 'image')formData.append(key, value);
    });
  if (poster && typeof poster !== 'string') {
      formData.append('image', poster);
    }
    const response = await fetch(`http://localhost:5000/api/course/${id}/update`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData
    });

    if (!response.ok) {
      console.log(response);
      
      throw new Error('Failed to update course');
    }

    const data = await response.json();
    // تحقق من شكل البيانات
    setCourse(data.course || data); // استخدم data.course إذا كان موجودًا
   console.log(data);
   
    toast.success('Course updated successfully');
    setEditModalVisible(false);
    // يمكنك أيضًا إعادة جلب البيانات من السيرفر للتأكد
    // getCourse(id);
  } catch (error) {
    console.error('Error updating course:', error);
    toast.error(error.message);
  }
};


const deleteCourse = async () => {
  try {
    const response = await fetch(`http://localhost:5000/api/course/${id}/delete`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });
    if (!response.ok) {
      throw new Error('Failed to delete course');
    }
    toast.success('Course deleted successfully');
    // يمكنك إعادة التوجيه لصفحة الدورات أو الرئيسية بعد الحذف
    window.location.href = '/courses'; // عدل المسار حسب مشروعك
  } catch (error) {
    console.error('Error deleting course:', error);
    toast.error(error.message);
  }
};





const handleAddVideo=(playlistId)=>{
             setNewVideoTitle('');
                        setVideoFile(null);
                        setPlaylistId(playlistId);
                        setVideoModalVisible(true);
}

  const addVideoToPlaylist = async () => {
    console.log(newVideoTitle, videoPoster, videoFile);
    
    if (!newVideoTitle || !videoPoster || !videoFile) {
      toast.error('Please fill all fields')
      return
    }

    try {
      const formData = new FormData()
      formData.append('title', newVideoTitle)
      formData.append('video', videoFile)
      formData.append('poster', videoPoster)
      formData.append('playList', playlistId) // Assuming you store the playlist token in localStorage
      const response = await fetch(`http://localhost:5000/api/video/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          
        },
        body: formData
      })
console.log(response);

      if (!response.ok) {
        throw new Error('Failed to add video to playlist')
      }

      const data = await response.json()
    
      setNewVideoTitle('')
      setVideoFile(null)
      setVideoPoster(null)
      setVideoModalVisible(false)
      setRefresh(!refresh)
      getPlaylists()
      toast.success('Video added to playlist successfully')
    } catch (error) {
      console.error('Error adding video:', error)
      toast.error(error.message)
    }
  }

  const deleteVideoFromPlaylist = async (videoId) => {
    try {
      console.log("video id in delete api calling",videoId);
      
      const response = await fetch(`http://localhost:5000/api/video/${videoId}/delete`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          // 'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Failed to delete video from playlist')
      }

    setRefresh(r=>!r)
          
     toast.success('Video removed from playlist successfully')
    } catch (error) {
      console.error('Error deleting video:', error)
    
    }
  }
const handleEditvideo=(video,videoId)=>{
setNewVideoTitle(video.title);
setVideoPoster(video.poster ? `http://localhost:5000/${video.poster.replace(/..\//, '')}` : null);
  setEditVideo(video);
  setEditVideoId(videoId);
  setEditVideoModalVisible(true);
}
const updateVideo = async () => {
  try {
    const formData = new FormData();
    formData.append('title', newVideoTitle);

    // إذا كان المستخدم رفع بوستر جديد أرسله، وإلا أرسل الرابط القديم (إذا كان موجود)
    if (videoPoster && typeof videoPoster !== 'string') {
      formData.append('poster', videoPoster);
    }

    // إذا كنت تريد تحديث الـ playlistId أضفه هنا (حسب الحاجة)
    // formData.append('playList', playlistId);
console.log('video id => ',editVideoId);

    const response = await fetch(`http://localhost:5000/api/video/${editVideoId}/update`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error('Failed to edit video details');
    }

    const data = await response.json();
    // تحديث بيانات الفيديو في الواجهة مباشرة (اختياري)
    setPlaylistData((prevData) =>
      prevData.map((playlist) =>
        playlist.videos.some((video) => video._id === editVideoId)
          ? {
              ...playlist,
              videos: playlist.videos.map((video) =>
                video._id === editVideoId
                  ? { ...video, title: newVideoTitle, poster: data.videoCourse.poster ? `http://localhost:5000/${data.videoCourse.poster.replace(/..\//, '')}` : video.poster }
                  : video
              ),
            }
          : playlist
      )
    );

    setEditVideoModalVisible(false);
    getPlaylists(); // جلب البيانات من السيرفر لضمان التحديث
    toast.success('Video updated successfully');
  } catch (error) {
    console.error('Error editing video:', error);
    toast.error(error.message);
  }
};
  const togglePublishStatus = async () => {
 updateCourse({isPublished: !course.isPublished})
  }

  useEffect(() => {
    if (token==null) return;
    getCourse(id).then((data) => {
      if (data.course) {
        setCourse(data.course)
        form.setFieldsValue({
          title: data.course.title,
          description: data.course.description,
          price: data.course.price,
          isPublished: data.course.isPublished
        })
      } else {
        message.error('Failed to load course data')
      }
    }).catch((error) => {
      console.error('Error in useEffect:', error)
      setError(error.message)
    })
  }, [id,token])
// quiz api calling
  const handleAddQuiz = async (playlistId) => {
    setCurrentQuizPlaylistId(playlistId);
    setQuizModalVisible(true);
  };

    const submitQuiz = async () => {
    if (!quizTitle) {
      toast.error('Please enter quiz title');
      return;
    }
    try {
      await addQuiz(currentQuizPlaylistId, token, quizTitle);
      toast.success('Quiz added successfully');
      setQuizModalVisible(false);
      setQuizTitle('');
      setCurrentQuizPlaylistId(null);
      setRefresh(r => !r); 
    } catch (error) {
      toast.error(error.message || 'Failed to add quiz');
    }
  };
const handleDeleteQuiz = async (quizId) => {
  try {
    await deleteQuiz(quizId, token);
    toast.success('Quiz deleted successfully');
    setRefresh(r => !r); // لإعادة تحميل البيانات
  } catch (error) {
    toast.error(error.message || 'Failed to delete quiz');
  }
}
const handleEditQuiz =(quizId)=>{
  console.log(quizId);
  
}
const handleOptionChange = (value, idx) => {
  const newOptions = [...options];
  newOptions[idx] = value;
  setOptions(newOptions);
};

const handleAddQuestion= (quizId)=>{
  console.log(quizId);
  
  setCurrentQuizId(quizId);
  setQuestionModalVisible(true);
  setCorrectAnswer("")
  setQuestionText("")
  setOptions(["", "", "", ""]);
  setEditVisible(false);
}


const submitQuestion = async () => {
   if (
    !questionText.trim() ||
    options.some(opt => !opt.trim()) ||
    !correctAnswer.trim()
  ) {
    // يمكنك عرض رسالة خطأ هنا
    return;
  }
   try {
     const questionData = {
    questionText,
    options,
    correctAnswer,
  };
  console.log(currentQuizId);
  
await addQuestion(currentQuizId, token, questionData);
toast.success('Question added successfully');
  setQuestionText('');
  setOptions(['', '', '', '']);
  setCorrectAnswer('');
  setQuestionModalVisible(false);
setRefresh(r => !r);
   } catch (error) {
    
   }
}
const handleEditQuestion= (questionId,question)=>{
  console.log(questionId);
  setEditQuestionData(question)
  setCurrentQuestionId(questionId);
  setQuestionModalVisible(true);
  setEditVisible(true);
  setCorrectAnswer(question.correctAnswer)
  options.forEach((option, index) => {
    options[index] = question.options[index];

  })
  setQuestionText(question.questionText)
}

const editQuestion = async () => {
   if (
    !questionText.trim() ||
    options.some(opt => !opt.trim()) ||
    !correctAnswer.trim()
  ) {
    // يمكنك عرض رسالة خطأ هنا
    return;
  }
   try {
     const questionData = {
    questionText,
    options,
    correctAnswer,
  };
  console.log(currentQuestionId,questionData);
  
await editQuestionInServer(currentQuestionId, token, questionData);
toast.success('Question edited successfully');
  setQuestionText('');
  setOptions(['', '', '', '']);
  setCorrectAnswer('');
  setQuestionModalVisible(false);
setRefresh(r => !r);
setEditVisible(false)
   } catch (error) {
    console.log({error});
    
   }
}
const handleDeleteQuestion= async(questionId)=>{
   try {
   
  
  
await deleteQuestionInServer(questionId, token);
toast.success('Question deleted successfully');

setRefresh(r => !r);


   } catch (error) {
    console.log({error});
    
   }

  
}

 
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
 <div className="max-w-6xl mx-auto p-2 md:p-4">      {/* Edit Course Modal */}
<Modal
  title="Edit Course Details"
  open={editModalVisible}
  onCancel={() => setEditModalVisible(false)}
  onOk={() => form.submit()}
  okText="Save Changes"
  footer={null}
  width={800}
>
  <Form
    form={form}
    layout="vertical"
    onFinish={updateCourse}
    initialValues={{
      title: course.title,
      description: course.description,
      price: course.price,
      isPublished: course.isPublished
    }}
  >
    <Form.Item
      label="Course Title"
      name="title"
      rules={[{ required: true, message: 'Please input course title!' }]}
    >
      <Input />
    </Form.Item>

    <Form.Item
      label="Description"
      name="description"
      rules={[{ required: true, message: 'Please input course description!' }]}
    >
      <TextArea rows={4} />
    </Form.Item>

    <Form.Item
      label="Price ($)"
      name="price"
      rules={[{ required: true, message: 'Please input course price!' }]}
    >
      <InputNumber min={0} style={{ width: '100%' }} />
    </Form.Item>

    <Form.Item
      label="Publish Status"
      name="isPublished"
      valuePropName="checked"
    >
      <Switch />
    </Form.Item>

    <Form.Item label="Course Image">
      {/* عرض صورة الكورس الحالية إذا كانت موجودة */}
      {course.image && typeof course.image === 'string' && (
        <div style={{ marginBottom: 12 }}>
          <Avatar
            shape="square"
            src={`http://localhost:5000/${course?.image}`}
            size={80}
            alt="Current Course Image"
            style={{ border: '1px solid #eee' }}
          />
        </div>
      )}
      <Upload
        name="image"
        listType="picture"
        beforeUpload={() => false}
        maxCount={1}
        onChange={info => {
          if (info.fileList && info.fileList.length > 0) {
            setPoster(info.fileList[0].originFileObj);
          } else {
            setPoster(null);
          }
        }}
      >
        <Button icon={<UploadOutlined />}>Click to upload</Button>
      </Upload>
    </Form.Item>

    <Form.Item>
      <Button type="primary" htmlType="submit">
        Save Changes
      </Button>
    </Form.Item>
  </Form>
</Modal>
      {/* Add PlayList Modal */}
      <Modal
        title="Add New  Playlist"
        open={playlistModalVisible}
        onCancel={() => setPlaylistModalVisible(false)}
        onOk={addNewPlaylist}
        okText="Add Playlist"
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <Input
            placeholder="Video Title"
            value={playListTitle}
            onChange={(e) => setPlayListTitle(e.target.value)}
          />
          <Input
            placeholder="Video URL (YouTube, Vimeo, etc.)"
            value={playListDescription}
            onChange={(e) => setPlayListDescription(e.target.value)}
          />
          <Upload
            name="poster"
            listType="picture"
            beforeUpload={() => false}
            maxCount={1}
           onChange={()=> {
            if (info.fileList && info.fileList.length > 0) {
              setPosterPlaylist(info.fileList[0].originFileObj);
            } else {
              setPosterPlaylist(null);
            }
          }}
          >
            <Button icon={<UploadOutlined />} >Upload Poster</Button>
          </Upload>
        </Space>
      </Modal>
      <Modal
        title="Add New  Playlist"
        open={playlistModalVisible}
        onCancel={() => setPlaylistModalVisible(false)}
        onOk={addNewPlaylist}
        okText="Add Playlist"
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <Input
            placeholder="Video Title"
            value={playListTitle}
            onChange={(e) => setPlayListTitle(e.target.value)}
          />
          <Input
            placeholder="Video URL (YouTube, Vimeo, etc.)"
            value={playListDescription}
            onChange={(e) => setPlayListDescription(e.target.value)}
          />
          <Upload
            name="poster"
            listType="picture"
            beforeUpload={() => false}
            maxCount={1}
           onChange={handlePosterChange}
          >
            <Button icon={<UploadOutlined />} >Upload Poster</Button>
          </Upload>
        </Space>
      </Modal>
      {/* //edit Playlist model */}
      <Modal
        title="Edit Playlist"
        open={editPlaylistModalVisible}
        onCancel={() => setEditPlaylistModalVisible(false)}
      onOk={async () => {
    await updatePlaylist(editPlaylistId);
    setEditPlaylistModalVisible(false);
    setPlayListTitle('');
    setPlayListDescription('');
    setPoster(null);
    setRefresh(r => !r);
  }}
  okText="Update Playlist"
      >
       <Form layout="vertical">
    <Form.Item
      label="Playlist Title"
      required
    >
      <Input
        value={playListTitle}
        onChange={e => setPlayListTitle(e.target.value)}
        placeholder="Enter playlist title"
      />
    </Form.Item>
    <Form.Item
      label="Playlist Description"
      required
    >
      <Input
        value={playListDescription}
        onChange={e => setPlayListDescription(e.target.value)}
        placeholder="Enter playlist description"
      />
    </Form.Item>
    <Form.Item label="Poster">
  {posterPreview && (
    <div style={{ marginBottom: 12 }}>
      <Avatar
        shape="square"
        src={posterPreview}
        size={80}
        alt="Current Poster"
        style={{ border: '1px solid #eee' }}
      />
    </div>
  )}
  <Upload
        name="poster"
        listType="picture"
        beforeUpload={() => false}
        maxCount={1}
        onChange={info => {
          if (info.fileList && info.fileList.length > 0) {
            setPosterPlaylist(info.fileList[0].originFileObj);
          } else {
            setPosterPlaylist(null);
          }
        }}
      >
        <Button icon={<UploadOutlined />}>Upload Poster</Button>
   
      </Upload>
    </Form.Item>
  </Form>
      </Modal>
      {/* add vedio model */}
      <Modal
        title="Add New Playlist Video"
        open={videoModalVisible}
        onCancel={() => setVideoModalVisible(false)}
        onOk={addVideoToPlaylist}
        okText="Add Playlist Video"
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <Input
            placeholder="Video Title"
            value={newVideoTitle}
            onChange={(e) => setNewVideoTitle(e.target.value)}
          />
          {/* <Input
            placeholder="Video URL (YouTube, Vimeo, etc.)"
            value={playListDescription}
            onChange={(e) => setPlayListDescription(e.target.value)}
          /> */}
          <Upload
            name="poster"
            listType="picture"
            beforeUpload={() => false}
            maxCount={1}
            onChange={info => {
    if (info.fileList && info.fileList.length > 0) {
      setVideoPoster(info.fileList[0].originFileObj); // تأكد من تعريف useState للـ videoFile
    } 
    else {
      setVideoPoster(null);
    }
  }}
          >
            <Button icon={<UploadOutlined />} >Upload Poster</Button>
          </Upload>
        <Upload
  name="video"
  accept="video/*"
  listType="text"
  beforeUpload={() => false}
  maxCount={1}
  onChange={info => {
    if (info.fileList && info.fileList.length > 0) {
      setVideoFile(info.fileList[0].originFileObj); // تأكد من تعريف useState للـ videoFile
    } else {
      setVideoFile(null);
    }
  }}
>
  <Button icon={<UploadOutlined />}>Upload Video</Button>
</Upload>
         
        </Space>
      </Modal>
  {/* //edit Playlist model */}
      <Modal
        title="Edit Video"
        open={editVideoModalVisible}
        onCancel={() => setEditVideoModalVisible(false)}
      onOk={async () => {
    await updateVideo(editVideoId);
    setEditPlaylistModalVisible(false);
   setNewVideoTitle("")
    setVideoPoster(null);
    setRefresh(r => !r);
  }}
  okText="Update Video Details"
      >
       <Form layout="vertical">
    <Form.Item
      label="Video Title"
      required
    >
      <Input
        value={newVideoTitle}
        onChange={e => setNewVideoTitle(e.target.value)}
        placeholder="Enter video title"
      />
    </Form.Item>
  
    <Form.Item label="Poster">
            {videoPoster && typeof videoPoster === 'string' && (
          
    <div style={{ marginBottom: 12 }}>
      <Avatar
        shape="square"
        src={videoPoster}
        size={80}
        alt="Current Poster"
        style={{ border: '1px solid #eee' }}
      />
    </div>
  )}
      <Upload
        name="poster"
        listType="picture"
        beforeUpload={() => false}
        maxCount={1}
        onChange={handlePosterChange}
      >
        <Button icon={<UploadOutlined />}>Upload Poster</Button>
   
      </Upload>
    </Form.Item>
  </Form>
      </Modal>
       <Modal
        title="Add Quiz"
        open={quizModalVisible}
        onCancel={() => setQuizModalVisible(false)}
        onOk={submitQuiz}
        okText="Add Quiz"
      >
        <Input
          placeholder="Quiz Title"
          value={quizTitle}
          onChange={e => setQuizTitle(e.target.value)}
        />
      </Modal>

{/* // add question model  || edit question     */}
    <Modal
  title={editVisible ? 'Edit Question' : 'Add Question'}
  open={questionModelVisable}
  onCancel={() => setQuestionModalVisible(false)}
  onOk={editVisible?editQuestion:submitQuestion}
  okText={editVisible ? 'Edit Question' : 'Add Question'}
>
    <Input
    placeholder="نص السؤال"
    value={questionText}
    onChange={e => setQuestionText(e.target.value)}
    className="mb-3"
  />
  <Space direction="vertical" style={{ width: '100%' }}>
    {
    options.map((opt, idx) => (
      <Input
        key={idx}
        placeholder={`option ${idx + 1}`}
         value={opt}
        onChange={e => handleOptionChange(e.target.value, idx)}
      />
    ))}
  </Space>
  <Input
    placeholder="Correct Answer"
  value={correctAnswer}  
    onChange={e => setCorrectAnswer(e.target.value)}
    className="mt-3"
  />
      </Modal>
      {/* Main Course View */}


    {/* Main Course View */}
    <div className="flex flex-col gap-4 md:gap-6">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-4">
        <Title level={2} className="!mb-0">Course Management</Title>
        <Space wrap>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => setPlaylistModalVisible(true)}
          >
            Add PlayList
          </Button>
          <Button 
            icon={<EditOutlined />}
            onClick={() => setEditModalVisible(true)}
          >
            Edit Course
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this course?"
            onConfirm={deleteCourse}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />}>
              Delete Course
            </Button>
          </Popconfirm>
        </Space>
      </div>

      {/* Course Card */}
      <Card
        cover={
          course.image ? (
            <div className="relative w-full h-48  bg-primary sm:h-64 md:h-96 overflow-hidden">
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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
              <Title level={2} className="!mb-0">{course.title}</Title>
              <Switch
                checkedChildren="Published"
                unCheckedChildren="Unpublished"
                checked={course.isPublished}
                onChange={togglePublishStatus}
                className='!mt-2 sm:!mt-0 w-fit px-2'
              />
            </div>
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Tag icon={<DollarOutlined />} color="green">
                Price: ${course.price}
              </Tag>
              <Tag icon={<UserOutlined />} color="blue">
                Teacher ID: {course.teacher}
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
                <OrderedListOutlined /> Course Stats
              </Title>
              <div className="space-y-3 mb-6">
                <div>
                  <Text strong>Status:</Text>
                  <div className="mt-1">
                    {course.isPublished ? (
                      <Tag color="green">Published</Tag>
                    ) : (
                      <Tag color="orange">Unpublished</Tag>
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
                  <Text strong>PlayLists:</Text>
                  <div className="mt-1">
                    <Text>{playlistData?.length || 0} playlist</Text>
                  </div>
                </div>
              </div>
              <Button 
                type="primary" 
                block 
                icon={<PlusOutlined />}
                onClick={() => setPlaylistModalVisible(true)}
              >
                Add playList
              </Button>
            </Card>
          </div>
        </div>
      </Card>

      {/* Playlist Section */}
      <Card
        title={
          <div className="flex items-center gap-2">
            <PlayCircleOutlined /> Course Playlists
          </div>
        }
        className="shadow-lg"
      >
        {playlistData?.length > 0 ? (
          <Table
            dataSource={playlistData}
            rowKey={pl => pl._id}
            pagination={false}
            scroll={{ x: true }}
            expandable={{
              expandedRowRender: (playlist) => (
      
                <PlaylistSection
  playlist={playlist}
  locale={locale}
  courseId={id}
 onDeleteQuiz={handleDeleteQuiz}   // دالة حذف كويز
  onAddQuiz={handleAddQuiz}           // دالة تفتح مودال إضافة كويز
  onAddQuestion={handleAddQuestion}   // دالة تفتح مودال إضافة سؤال
  onEditQuestion={handleEditQuestion} // دالة تفتح مودال تحديث سؤال
  onEditQuiz={handleEditQuiz} // دالة تفتح مودال تحديث كويز
  onDeleteQuestion={handleDeleteQuestion}  
    onEditVideo={handleEditvideo}
    onDeleteVideo={deleteVideoFromPlaylist}
    onAddVideo={handleAddVideo}
/>
              ),
              expandRowByClick: true,
              expandIcon: ({ expanded, onExpand, record }) =>
                <Button
                  type="link"
                  icon={expanded ? <EyeInvisibleOutlined /> : <PlayCircleOutlined />}
                  onClick={e => { e.stopPropagation(); onExpand(record, e); }}
                />
            }}
            columns={[
              {
                title: 'Playlist Title',
                dataIndex: 'title',
                key: 'title',
              },
              {
                title: 'Description',
                dataIndex: 'description',
                key: 'description',
               render: (text) => {
    // قص النص إلى 40 حرف مع إضافة ... إذا كان أطول
    const shortText = text && text.length > 40 ? text.slice(0, 40) + '...' : text;
    return shortText;
  },
              },
  {
  title: 'Poster',
  dataIndex: 'poster',
  key: 'poster',
      


  render: (poster) =>
    poster && typeof poster === "string" && poster.trim() !== "" ? (
      <Avatar
        shape="square"
        src={`http://localhost:5000/${poster.replace(/^(\.\.\/)+/, '')}`}
        alt="Poster"
      />
    ) : (
      <Avatar shape="square" src="/images/sana-avatar.png" alt="Default Avatar" />
    ),
},
              {
                title: 'Actions',
                key: 'actions',
                render: (_, playlist) => (
                  <Space>
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={() => handleAddVideo(playlist._id)}
                    >
                      Add Video
                    </Button>
                    <Button
                      icon={<EditOutlined />}
                      onClick={() => handleEditPlaylist(playlist)}
                    >
                      Edit
                    </Button>
                       <Button
        type="dashed"
        icon={<PlusOutlined />}
        onClick={() => handleAddQuiz(playlist._id)}
      >
        Add Quiz
      </Button>
                    <Popconfirm
                      title="Delete this playlist?"
                      onConfirm={() => deletePlaylist(playlist._id)}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Button type="link" danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                  </Space>
                ),
              },
            ]}
          />
        ) : (
          <div className="text-center py-8">
            <Text type="secondary">No playlists added to this course yet</Text>
            <div className="mt-4">
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setPlaylistModalVisible(true)}
              >
                Add First Playlist
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>

    </div>
  )
}

export default ViewCourseTeacher
