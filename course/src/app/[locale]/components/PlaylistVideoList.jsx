'use client'
import { List, Avatar, Button } from 'antd'
import { PlayCircleOutlined } from '@ant-design/icons'
import Link from 'next/link'

/**
 * PlaylistVideoList
 * - videos: array of video objects
 * - locale: current locale
 * - courseId: course id
 * - playlistId: playlist id
 * - currentVideoId: (اختياري) id الفيديو الحالي (لتمييزه)
 * - onVideoSelect: (اختياري) دالة عند اختيار فيديو (للتحكم في التنقل)
 */
const PlaylistVideoList = ({
  videos = [],
  locale,
  courseId,
  playlistId,
  currentVideoId,
  onVideoSelect,
  isSmall
}) => (
  <List
    dataSource={videos}
    renderItem={video => {
      const isCurrent = currentVideoId && video._id === currentVideoId
      return (
        <List.Item
          key={video._id}
          className={`transition rounded-lg   ${isCurrent ? 'bg-gray-200' : 'hover:bg-blue-50'}`}
          style={{ cursor: 'pointer' }}
          onClick={() => {
            if (onVideoSelect) onVideoSelect(video._id)
          }}
        >
          <div className="flex items-center px-2 justify-between w-full">
            <Avatar
              shape="square"
              src={
                video.poster
                  ? `http://localhost:5000/${video.poster?.replace(/..\//, '')}`
                  : undefined
              }
              icon={<PlayCircleOutlined />}
              size={64}
              className='flex-shrink-0'
            />
         
            {!isSmall && (
                   <div className="flex-1">
              <Link
                href={`http://localhost:4000/${locale}/dashboard/course/${courseId}/playlist/${playlistId}/video/${video._id}`}
                className={`text-lg font-medium ${isCurrent ? 'text-blue-700' : 'hover:text-blue-600'}`}
              >
                {video.title}
              </Link>
              <div className="text-gray-500 text-sm">
                {video.description ? video.description.slice(0, 40) : 'Video content'}
              </div>
            </div>
            )}
         
            <Button
              type={isCurrent ? 'default' : 'primary'}
              icon={<PlayCircleOutlined />}
              href={`http://localhost:4000/${locale}/dashboard/course/${courseId}/playlist/${playlistId}/video/${video._id}`}
              disabled={isCurrent}
            >
              {isCurrent ? 'تشاهد الآن' : 'مشاهدة'}
            </Button>
          </div>
        </List.Item>
      )
    }}
  />
)

export default PlaylistVideoList