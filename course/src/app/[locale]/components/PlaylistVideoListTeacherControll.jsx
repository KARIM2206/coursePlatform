
import { Edit, Trash } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import { FiVideo } from 'react-icons/fi'

const PlaylistVideoListTeacherControll = ({
    videos,
   onEditVideo,
    onDeleteVideo,
    courseId,
    playlistId
}) => {
  return (
    <div className=' bg-gray-100 rounded-lg shadow-md mb-4'>

   <div className='flex items-center justify-between bg-grey-100 p-4 rounded-lg mt-2'>
    <div className='flex gap-2 items-start'>
      <div className='relative w-16 h-10 rounded-md overflow-hidden'>
               <Image src={`http://localhost:5000/${videos.poster}`} alt={videos.title} fill className="rounded-md object-fit" /> 
      </div>
        <div className="flex flex-col gap-1">
            <h4 className="text-sm font-semibold">{videos?.title}</h4>
            <p className="text-xs text-gray-500">{videos.description||'No description available'}</p>
    </div> 
    </div>
        <div className="flex items-center gap-2">
          <button className="bg-transparent text-white px-4 py-2 rounded" onClick={() => onEditVideo(videos, videos._id)}><Edit size={20} color='blue'/></button>
            <button className="bg-transparent text-red-500 px-4 py-2 rounded" onClick={() => onDeleteVideo(videos._id)}><Trash size={20}/></button>
        </div>
  
    </div>
    </div>
  )
}

export default PlaylistVideoListTeacherControll
