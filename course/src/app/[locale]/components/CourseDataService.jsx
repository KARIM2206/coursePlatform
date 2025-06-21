
'use client'
import { useContext, useEffect, useState } from 'react'
import { Context } from '../CONTEXT/ContextProvider'
import { Form } from 'antd'
import { toast } from 'react-toastify'

const CourseDataService = ({ id }) => {
  const { token } = useContext(Context)
  const [form] = Form.useForm()
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [playlistModalVisible, setPlaylistModalVisible] = useState(false)
  const [videoModalVisible, setVideoModalVisible] = useState(false)
  const [editPlaylistModalVisible, setEditPlaylistModalVisible] = useState(false)
  const [editVideoModalVisible, setEditVideoModalVisible] = useState(false)
  const [newVideoTitle, setNewVideoTitle] = useState('')
  const [playListTitle, setPlayListTitle] = useState('')
  const [playListDescription, setPlayListDescription] = useState('')
  const [poster, setPoster] = useState(null)
  const [posterPlaylist, setPosterPlaylist] = useState(null)
  const [videoFile, setVideoFile] = useState(null)
  const [videoPoster, setVideoPoster] = useState(null)
  const [playlistId, setPlaylistId] = useState(null)
  const [editPlaylistId, setEditPlaylistId] = useState(null)
  const [editVideoId, setEditVideoId] = useState(null)
  const [editVideo, setEditVideo] = useState(null)
  const [posterPreview, setPosterPreview] = useState(null)
  const [playlistData, setPlaylistData] = useState([])
  const [refresh, setRefresh] = useState(false)

  const getCourse = async (id) => {
    try {
      setLoading(true)
      const response = await fetch(`http://localhost:5000/api/course/teacher/${id}`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Failed to fetch course data')
      setCourse(data.course || data)
      form.setFieldsValue({
        title: data.course?.title || data.title,
        description: data.course?.description || data.description,
        price: data.course?.price || data.price,
        isPublished: data.course?.isPublished || data.isPublished
      })
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
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (!response.ok) throw new Error('Failed to fetch playlists')
      const data = await response.json()
      const playlistsWithVideos = await Promise.all(
        data.playLists.map(async (playlist) => {
          let videos = []
          try {
            const res = await fetch(`http://localhost:5000/api/video/playlist/${playlist._id}/videos`, {
              method: 'GET',
              headers: { 'Authorization': `Bearer ${token}` }
            })
            if (res.ok) {
              const videoData = await res.json()
              videos = videoData.videos || []
            }
          } catch (err) {}
          return { ...playlist, videos }
        })
      )
      setPlaylistData(playlistsWithVideos)
    } catch (error) {
      console.error('Error fetching playlists:', error)
    }
  }

  const updateCourse = async (values) => {
    try {
      const formData = new FormData()
      Object.entries(values).forEach(([key, value]) => {
        if (key !== 'image') formData.append(key, value)
      })
      if (poster && typeof poster !== 'string') formData.append('image', poster)
      const response = await fetch(`http://localhost:5000/api/course/${id}/update`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      })
      if (!response.ok) throw new Error('Failed to update course')
      const data = await response.json()
      setCourse(data.course || data)
      toast.success('Course updated successfully')
      setEditModalVisible(false)
    } catch (error) {
      console.error('Error updating course:', error)
      toast.error(error.message)
    }
  }

  const addNewPlaylist = async () => {
    try {
      const formData = new FormData()
      formData.append('title', playListTitle)
      formData.append('description', playListDescription)
      formData.append('poster', posterPlaylist)
      formData.append('course', id)
      const response = await fetch(`http://localhost:5000/api/playlist/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'courseToken': `Bearer ${localStorage?.getItem('courseToken')}`
        },
        body: formData
      })
      if (!response.ok) throw new Error('Failed to add playlist')
      const data = await response.json()
      localStorage.setItem('playlistToken', data.playlistToken)
      setPlayListTitle('')
      setPlayListDescription('')
      setPosterPlaylist(null)
      setPosterPreview(null)
      setRefresh(!refresh)
      setPlaylistModalVisible(false)
      toast.success('Playlist added successfully')
    } catch (error) {
      console.error('Error adding playlist:', error)
      toast.error(error.message)
    }
  }

  const deletePlaylist = async (playlistId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/playlist/${playlistId}/delete`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (!response.ok) throw new Error('Failed to delete playlist')
      setPlaylistData((prevData) => prevData.filter((playlist) => playlist._id !== playlistId))
      toast.success('Playlist deleted successfully')
    } catch (error) {
      console.error('Error deleting playlist:', error)
      toast.error(error.message)
    }
  }

  const updatePlaylist = async (playlistId) => {
    try {
      const formData = new FormData()
      formData.append('title', playListTitle)
      formData.append('description', playListDescription)
      if (posterPlaylist && typeof posterPlaylist !== 'string') {
        formData.append('poster', posterPlaylist)
      }
      formData.append('course', id)
      const response = await fetch(`http://localhost:5000/api/playlist/${playlistId}/update`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'courseToken': `Bearer ${localStorage?.getItem('courseToken')}`
        },
        body: formData
      })
      if (!response.ok) throw new Error('Failed to update playlist')
      const data = await response.json()
      setPlaylistData((prevData) =>
        prevData.map((playlist) =>
          playlist._id === playlistId ? { ...playlist, ...data } : playlist
        )
      )
      toast.success('Playlist updated successfully')
    } catch (error) {
      console.error('Error updating playlist:', error)
      toast.error(error.message)
    }
  }

  const addVideoToPlaylist = async () => {
    if (!newVideoTitle || !videoPoster || !videoFile) {
      toast.error('Please fill all fields')
      return
    }
    try {
      const formData = new FormData()
      formData.append('title', newVideoTitle)
      formData.append('video', videoFile)
      formData.append('poster', videoPoster)
      formData.append('playList', playlistId)
      const response = await fetch(`http://localhost:5000/api/video/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      })
      if (!response.ok) throw new Error('Failed to add video to playlist')
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
      const response = await fetch(`http://localhost:5000/api/course/teacher/${id}/playlist/${videoId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (!response.ok) throw new Error('Failed to delete video from playlist')
      setRefresh(!refresh)
      getPlaylists()
      toast.success('Video removed from playlist successfully')
    } catch (error) {
      console.error('Error deleting video:', error)
      toast.error(error.message)
    }
  }

  const handleEditPlaylist = (playlist) => {
    setEditPlaylistId(playlist._id)
    setPlayListTitle(playlist.title)
    setPlayListDescription(playlist.description)
    setPosterPlaylist(playlist.poster ? `http://localhost:5000/${playlist.poster.replace(/..\//, '')}` : null)
    setPosterPreview(playlist.poster ? `http://localhost:5000/${playlist.poster.replace(/..\//, '')}` : null)
    setEditPlaylistModalVisible(true)
  }

  const handleEditVideo = (video) => {
    setNewVideoTitle(video.title)
    setVideoPoster(video.poster ? `http://localhost:5000/${video.poster.replace(/..\//, '')}` : null)
    setEditVideo(video)
    setEditVideoId(video._id)
    setEditVideoModalVisible(true)
  }

  const updateVideo = async (videoId) => {
    try {
      const formData = new FormData()
      formData.append('title', newVideoTitle)
      if (videoPoster && typeof videoPoster !== 'string') {
        formData.append('poster', videoPoster)
      }
      const response = await fetch(`http://localhost:5000/api/video/${videoId}/update`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      })
      if (!response.ok) throw new Error('Failed to edit video details')
      const data = await response.json()
      setPlaylistData((prevData) =>
        prevData.map((playlist) =>
          playlist.videos.some((video) => video._id === videoId)
            ? {
                ...playlist,
                videos: playlist.videos.map((video) =>
                  video._id === videoId
                    ? { ...video, title: newVideoTitle, poster: data.videoCourse.poster ? `http://localhost:5000/${data.videoCourse.poster.replace(/..\//, '')}` : video.poster }
                    : video
                ),
              }
            : playlist
        )
      )
      setEditVideoModalVisible(false)
      getPlaylists()
      toast.success('Video updated successfully')
    } catch (error) {
      console.error('Error editing video:', error)
      toast.error(error.message)
    }
  }

  const togglePublishStatus = async () => {
    await updateCourse({ isPublished: !course.isPublished })
  }

  const deleteCourse = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/course/${id}/delete`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (!response.ok) throw new Error('Failed to delete course')
      toast.success('Course deleted successfully')
      window.location.href = '/courses'
    } catch (error) {
      console.error('Error deleting course:', error)
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (!token) return
    getCourse(id).catch((error) => {
      console.error('Error in useEffect:', error)
      setError(error.message)
    })
    getPlaylists()
  }, [id, token, refresh])

  return {
    course, loading, error, playlistData, form,
    editModalVisible, setEditModalVisible,
    playlistModalVisible, setPlaylistModalVisible,
    videoModalVisible, setVideoModalVisible,
    editPlaylistModalVisible, setEditPlaylistModalVisible,
    editVideoModalVisible, setEditVideoModalVisible,
    newVideoTitle, setNewVideoTitle,
    playListTitle, setPlayListTitle,
    playListDescription, setPlayListDescription,
    poster, setPoster,
    posterPlaylist, setPosterPlaylist,
    videoFile, setVideoFile,
    videoPoster, setVideoPoster,
    playlistId, setPlaylistId,
    editPlaylistId, setEditPlaylistId,
    editVideoId, setEditVideoId,
    editVideo, setEditVideo,
    posterPreview, setPosterPreview,
    updateCourse, addNewPlaylist, deletePlaylist,
    handleEditPlaylist, updatePlaylist,
    addVideoToPlaylist, deleteVideoFromPlaylist,
    handleEditVideo, updateVideo, togglePublishStatus,
    deleteCourse
  }
}

export default CourseDataService