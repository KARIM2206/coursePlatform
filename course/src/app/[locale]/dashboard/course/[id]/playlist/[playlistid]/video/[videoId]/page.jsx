'use client'

import { FiPlay, FiPause, FiVolume2, FiVolumeX, FiMaximize, FiClock, FiHeart, FiShare2 } from 'react-icons/fi'
import { FaSpinner } from 'react-icons/fa'
import ReactPlayer from 'react-player'
import { use, useContext, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { toast } from 'react-toastify'
import { Context } from '@/app/[locale]/CONTEXT/ContextProvider'
import { PlayCircleOutlined } from '@ant-design/icons'
import { Card, Typography, Avatar } from 'antd'
import { useRouter } from 'next/navigation'
import PlaylistVideoList from '@/app/[locale]/components/PlaylistVideoList'

const VideoPlayerPage = ({ params }) => {
  const { videoId, id, playlistid, locale } = use(params)
  const router = useRouter()
  const { token } = useContext(Context)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [video, setVideo] = useState(null)
  const [playlistId, setPlaylistId] = useState(null)
  const [videos, setVideos] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const playerRef = useRef(null)
  const [videoProgress, setVideoProgress] = useState(null);

  const { Text } = Typography

  // Fetch playlist videos
  const getPlaylist = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/video/playlist/${playlistid}/videos`, {
        headers: { "Authorization": `Bearer ${token}` }
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Failed to fetch playlist')
      setVideos(data.videos)
    } catch (error) {
      console.error("Error fetching playlist:", error)
      toast.error(error.message || 'Error loading playlist')
    }
  }
const getVideoProgress = async () => {
  try {
    const res = await fetch(`http://localhost:5000/api/progress/video/${videoId}`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    const data = await res.json();
    setVideoProgress(data.progress); // تأكد أن الـ API يرجع watchedPercent
  } catch (err) {
    setVideoProgress(null);
  }
};
useEffect(() => {
  if (videoId && token) getVideoProgress();
}, [videoId, token]);
  // Fetch video data
  const getVideo = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/video/${videoId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      if (!response.ok) {
        throw new Error('Failed to fetch video details')
      }
      const data = await response.json()
      setVideo(data.video)
      setPlaylistId(data?.video?.playList?._id)
    } catch (error) {
      console.error('Error fetching video:', error)
      toast.error(error.message || 'Error fetching video details')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!token) return
    if (playlistid) getPlaylist()
    if (videoId && token) getVideo()
    return () => {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(console.error)
      }
    }
  }, [videoId, token, playlistid])

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  // حفظ تقدم الفيديو في قاعدة البيانات
  const saveVideoProgress = async (currentTime, totalDuration) => {
    try {
      await fetch(`http://localhost:5000/api/progress/video/${videoId}/submit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          playlistId: playlistid,
          courseId: id,
          watchedTime: currentTime,
          duration: totalDuration
        })
      })
    } catch (err) {
      console.error('Failed to save video progress', err)
    }
  }

  // عند تحديث وقت الفيديو، احفظ التقدم كل 10 ثوانٍ أو عند النهاية
  const handleProgress = (state) => {
    setProgress(state.playedSeconds)
    if (duration > 0 && (Math.floor(state.playedSeconds) % 10 === 0 || state.playedSeconds >= duration - 1)) {
      saveVideoProgress(state.playedSeconds, duration)
    }
  }

  const formatTime = (seconds) => {
    const date = new Date(seconds * 1000)
    const hh = date.getUTCHours()
    const mm = date.getUTCMinutes()
    const ss = date.getUTCSeconds().toString().padStart(2, "0")
    return hh ? `${hh}:${mm.toString().padStart(2, "0")}:${ss}` : `${mm}:${ss}`
  }

  const handlePlayPause = () => setIsPlaying(prev => !prev)
  const handleMute = () => setIsMuted(prev => !prev)
  const handleSeek = (e) => {
    const seekBar = e.currentTarget
    const seekPosition = e.nativeEvent.offsetX / seekBar.offsetWidth
    const seekTime = seekPosition * duration
    setProgress(seekTime)
    playerRef.current?.seekTo(seekTime)
  }
  const handleDuration = (duration) => setDuration(duration)
  const handleLike = () => setIsLiked(prev => !prev)
  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(console.error)
    } else {
      document.exitFullscreen().catch(console.error)
    }
  }
  const handleVideoSelect = (selectedVideoId) => {
      if (!videoProgress || videoProgress.watchedPercent < 90) {
    alert(`${locale==='ar'?"يجب عليك إكمال مشاهدة الفيديو الحالي قبل الانتقال للفيديو التالي.":"You must watch the current video before moving to the next video."}`);
    return;
  }
  router.push(`/dashboard/course/${id}/playlist/${playlistid}/video/${selectedVideoId}`);
};

  if (!token || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <FaSpinner className="animate-spin text-4xl text-blue-600" />
      </div>
    )
  }

  if (!video) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 text-gray-800">
        <p>Video not found or failed to load</p>
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-gray-50 text-gray-900 ${isFullscreen ? 'p-2' : 'p-4 md:p-8'}`}>
      <div className={`mx-auto ${isFullscreen ? 'w-full h-full' : 'max-w-7xl'}`}>
        {/* Video Player Section */}
        <div className={`relative ${isFullscreen ? 'h-screen' : 'rounded-2xl overflow-hidden shadow-xl bg-black'}`}>
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/10">
              <Image
                src={`http://localhost:5000/${video?.poster?.replace(/^\//, '')}`}
                alt="Video poster"
                fill
                className="object-cover opacity-80 cursor-pointer"
                onClick={() => setIsPlaying(true)}
                priority
              />
              <button 
                onClick={() => setIsPlaying(true)}
                className="absolute z-20 p-4 bg-blue-600 rounded-full hover:bg-blue-700 transition-colors shadow-lg"
                aria-label="Play video"
              >
                <FiPlay size={32} className="text-white" />
              </button>
            </div>
          )}
          
          <ReactPlayer
            ref={playerRef}
            url={`http://localhost:5000/${video?.url?.replace(/^\//, '')}`}
            playing={isPlaying}
            muted={isMuted}
            width="100%"
            height={isFullscreen ? '100%' : 'auto'}
            onProgress={handleProgress}
            onDuration={handleDuration}
            onEnded={() => {
              setIsPlaying(false)
              saveVideoProgress(duration, duration)
            }}
            progressInterval={100}
            config={{
              file: {
                attributes: {
                  crossOrigin: 'anonymous'
                }
              }
            }}
            style={{ aspectRatio: '16/9' }}
            playsinline
          />

          {/* Custom Controls */}
          <div className={`absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300`}>
            {/* Progress Bar */}
            <div 
              className="h-2 bg-gray-600/50 rounded-full w-full mb-3 cursor-pointer group"
              onClick={handleSeek}
            >
              <div 
                className="h-full bg-blue-600 rounded-full relative transition-all duration-200"
                style={{ width: `${(progress / duration) * 100}%` }}
              >
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-4">
                <button 
                  onClick={handlePlayPause}
                  className="text-white hover:text-blue-300 transition-colors p-1.5 rounded-full hover:bg-white/10"
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <FiPause size={22} /> : <FiPlay size={22} />}
                </button>
                
                <button 
                  onClick={handleMute}
                  className="text-white hover:text-blue-300 transition-colors p-1.5 rounded-full hover:bg-white/10"
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <FiVolumeX size={18} /> : <FiVolume2 size={18} />}
                </button>
                
                <div className="text-sm text-gray-300 font-medium">
                  {formatTime(progress)} / {formatTime(duration)}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button 
                  onClick={handleLike}
                  className={`transition-colors p-1.5 rounded-full hover:bg-white/10 ${
                    isLiked ? 'text-red-500' : 'text-white hover:text-blue-300'
                  }`}
                  aria-label="Like"
                >
                  <FiHeart size={18} fill={isLiked ? 'currentColor' : 'none'} />
                </button>
                
                <button 
                  className="text-white hover:text-blue-300 transition-colors p-1.5 rounded-full hover:bg-white/10"
                  aria-label="Share"
                >
                  <FiShare2 size={18} />
                </button>
                
                <button 
                  onClick={handleFullscreen}
                  className="text-white hover:text-blue-300 transition-colors p-1.5 rounded-full hover:bg-white/10"
                  aria-label="Fullscreen"
                >
                  <FiMaximize size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {!isFullscreen && (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Video Details */}
            <div className="lg:col-span-3 space-y-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{video.title}</h1>
                
                <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <Avatar
                    src={video.poster ? `http://localhost:5000/${video.poster.replace(/^\//, '')}` : undefined}
                    shape="square"
                    size={64}
                    icon={<PlayCircleOutlined />}
                    className="border-2 border-blue-200"
                  />
                  <div>
                    <p className="text-blue-600 text-sm uppercase tracking-wider font-medium">Playlist</p>
                    <p className="text-lg font-semibold text-gray-800">{video.playList?.title || 'No playlist'}</p>
                    <div className="flex items-center mt-2 gap-4 text-sm text-blue-500">
                      <span className="flex items-center">
                        <FiClock className="mr-1" /> {new Date(video.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 bg-blue-50/50 p-6 rounded-lg border border-blue-100">
                  <h3 className="text-lg font-semibold mb-3 text-blue-600">Description</h3>
                  <p className="text-gray-700 whitespace-pre-line">
                    {video.description || 'No description available'}
                  </p>
                </div>
              </div>
            </div>

            {/* Playlist Sidebar */}
            <div className="space-y-6">
              <Card
                title={
                  <div className="flex items-center gap-2 text-blue-600">
                    <PlayCircleOutlined /> Playlist Content
                  </div>
                }
                className="shadow-sm border border-gray-200"
                headStyle={{ borderBottom: '1px solid #e5e7eb' }}
                bodyStyle={{ padding: 0 }}
              >
                {videos?.length > 0 ? (
                  <div className="max-h-[600px]  overflow-y-auto">
                   <PlaylistVideoList
                      videos={videos}
                      locale={locale}
                      courseId={id}
                      playlistId={playlistid}
                      currentVideoId={videoId}
                      isSmall={true}
                      onVideoSelect={handleVideoSelect}
                    />
                  </div>
                ) : (
                  <div className="p-4 text-center">
                    <Text type="secondary">No videos in this playlist</Text>
                  </div>
                )}
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default VideoPlayerPage