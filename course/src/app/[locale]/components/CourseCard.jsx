import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import Link from 'next/link';

const CourseCard = ({ course, locale, dict }) => {
  const cardRef = useRef(null);

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 50 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.8, 
          ease: 'power3.out',
          delay: 0.1 // Small delay for staggered animations if multiple cards
        }
      );
    }
  }, []);

  // Fallback image in case of error
  const handleImageError = (e) => {
    e.target.src = '/placeholder-course.jpg';
  };
console.log(course.slug[0]?.split(' ')?.join('-')?.toLowerCase());

  // Format price with two decimal places
  const formattedPrice = course.price.toFixed(2);

  return (
    <div className="flex justify-center items-start min-h-screen ">
        <Link  href={`/${locale}/course/${course._id}`}
          target="_blank" 
        ref={cardRef}
        className="course-card max-w-sm w-full bg-white rounded-xl 
        shadow-lg overflow-hidden transform transition-all 
        duration-300 hover:-translate-y-2 hover:shadow-2xl"
      >
        <div className="relative h-48 w-full">
          <Image
            src={`http://localhost:5000/${course.image.replace(/^\/+/, '')}`}
            alt={course.title || 'Course image'}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-500 hover:scale-105"
            onError={handleImageError}
            priority={false}
            placeholder="blur"
            blurDataURL="/placeholder-course.jpg"
          />
        </div>
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2 truncate" title={course.title}>
            {course.title}
          </h2>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2" title={course.description}>
            {course.description}
          </p>
          
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg font-semibold text-indigo-600">${formattedPrice}</span>
            <div className="flex items-center">
              <div className="flex space-x-1 mr-2">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${i < Math.floor(course.rate || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-gray-500">
                ({course.rate || 0}/5)
              </span>
            </div>
          </div>
          
          {course.slug?.length > 0 ?
           (
            <div className="flex flex-wrap gap-2 mb-4">
              {course.slug[0]?.split(',')?.map((tag, index) => (
                <Link href={`${locale}/courses/${tag.split(' ')?.join('-')?.toLowerCase()}`} target='_blank'
                  key={index}
                  className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full"
                >
                  {tag}
                </Link>
              ))}
            </div>
          ):
              (
                <div className="text-gray-500 text-sm mb-4">
                  No tags available
                </div>
             )
        }
          
     
        </div>
      </Link>
    </div>
  );
};

export default CourseCard;