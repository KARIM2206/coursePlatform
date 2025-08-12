'use client'
import Link from 'next/link';
import Image from 'next/image';
import { FiPlayCircle } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import NoData from './NoData';
import { motion } from 'framer-motion';

const PlaylistVideoList = ({
  videos = [],
  locale,
  courseId,
  playlistId,
  currentVideoId,
  isEnroll
}) => {
  const router = useRouter();

  return (
    <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    
     className="space-y-4 mb-2">
      {
      videos?.length>0?videos.map((video) => (
        <div
          key={video._id}
          className={`flex justify-between  items-center cursor-pointer px-4 py-3 rounded-xl shadow-sm border transition-all 
            ${video._id === currentVideoId&&isEnroll ? 'bg-blue-100 border-blue-400 cursor-pointer' : 'hover:bg-blue-50  border-gray-200'} `}
          onClick={() =>
            router.push(`/${locale}/dashboard/course/${courseId}/playlist/${playlistId}/video/${video._id}`)
          }
        >
          {/* Left: Thumbnail + Title */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 shrink-0">
              <Image
                src={`http://localhost:5000/${video.poster}`}
                alt={video.title}
                width={56}
                height={56}
                className="rounded-full object-cover w-full h-full border"
              />
            </div>
            <div className="text-gray-800 font-medium text-sm md:text-base">
              <Link
                href={`/${locale}/dashboard/course/${courseId}/playlist/${playlistId}/video/${video._id}`}
                className={`hover:underline ${isEnroll==true?'pointer-events-none':'cursor-pointer'} `}
                
              >
                {video.title}
              </Link>
            </div>
          </div>

          {/* Right: Watch Button */}
      {
        isEnroll?  <Link target='_blank'
            href={`/${locale}/dashboard/course/${courseId}/playlist/${playlistId}/video/${video._id}`}
            className="flex items-center cursor-pointer gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
          >
            <FiPlayCircle className="w-5 h-5" />
            <span>Watch</span>
          </Link> : <div></div>
      }
        
        </div>
        
      ))
      :
      <NoData data={'videos'}/>
    }
    </motion.div>
  );
};

export default PlaylistVideoList;
