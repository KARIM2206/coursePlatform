import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX } from 'react-icons/fi'

const SearchResult = ({ poster, title, courseId, locale }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="group relative  w-full flex items-center px-4 py-2 hover:bg-blue-50 transition-colors duration-200 rounded-lg"
    >
      <Link href={`/${locale}/course/${courseId}`} className="flex items-center justify-between px-4 py-3 hover:bg-blue-50 transition-colors duration-200 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-8 relative flex-shrink-0">
              <Image
                src={`http://localhost:5000/${poster}`}
                alt={title}
                fill
                className="object-cover rounded-md"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <p className="text-gray-800 font-medium group-hover:text-blue-600 transition-colors duration-200">
              {title?.length > 20 ? title.slice(0, 20) + '...' : title}
            </p>
          </div>
        
      
      </Link>
    </motion.div>
  )
}
export default SearchResult