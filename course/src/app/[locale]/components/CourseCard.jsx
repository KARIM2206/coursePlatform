import { useContext, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import Link from "next/link";
import { addItemsToCart, getAvarageRating } from "../lib/server";
import { Context } from "../CONTEXT/ContextProvider";
import { FiLoader, FiShoppingCart } from "react-icons/fi";
import { toast } from "react-toastify";

const CourseCard = ({ course, locale, isTeacher, dict, courseId,isAddToCart }) => {
  const cardRef = useRef(null);
  const addCartRef = useRef(null);
  
  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          delay: 0.1,
        }
      );
    }
  }, []);

  const [ratingValue, setRatingValue] = useState(0);

  const handleImageError = (e) => {
    e.target.src = "/placeholder-course.jpg";
  };

  const { token,handleAddToCart } = useContext(Context);
  
  const handleGetAvarageRating = async () => {
    try {
      const data = await getAvarageRating(courseId);
      if (!data.ok) {
        // toast.error(data.message || 'Failed to update profile');
      }
      setRatingValue(data.ratingAvg);
    } catch (error) {
      throw new Error(error.message);
    }
  };

  useEffect(() => {
    handleGetAvarageRating();
  }, [token, courseId]);



  if (!course) return <FiLoader className="animate-spin text-2xl" />;
  
  const formattedPrice = course?.price?.toFixed(2);

  return (
    <div className="flex justify-center items-stretch">
      <div
        ref={cardRef}
        className="course-card max-w-sm w-full bg-white rounded-xl 
        shadow-lg overflow-hidden transform transition-all 
        duration-300 hover:-translate-y-2 hover:shadow-2xl"
      >
        <Link
          href={`${isTeacher ? `/${locale}/dashboard/course/${course._id}` : `/${locale}/course/${course._id}`}`}
          target="_blank"
          className="block"
        >
          <div className="relative h-48 w-full">
            <Image
              src={`http://localhost:5000/${course.image?.replace(/^\/+/, "")}`}
              alt={course.title || "Course image"}
              layout="fill"
              objectFit="cover"
              className="transition-transform duration-500 hover:scale-105"
              onError={handleImageError}
              priority={false}
              placeholder="blur"
              blurDataURL="/placeholder-course.jpg"
            />
          </div>
        </Link>

        <div className="p-6">
          <Link
            href={`${isTeacher ? `/${locale}/dashboard/course/${course._id}` : `/${locale}/course/${course._id}`}`}
            target="_blank"
            className="block"
          >
            <h2
              className="text-2xl font-bold text-gray-800 mb-2 truncate"
              title={course.title}
            >
              {course.title}
            </h2>
            <p
              className="text-gray-600 text-sm mb-4 line-clamp-2"
              title={course.description}
            >
              {course.description}
            </p>
          </Link>

          <div className="flex flex-col gap-2 mb-4">
            <span className="text-lg font-semibold text-indigo-600">
              ${formattedPrice}
            </span>
            <div className="flex items-center">
              <div className="flex space-x-1 mr-2">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${i < Math.floor(ratingValue) ? "text-yellow-400" : "text-gray-300"}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-gray-500">
                ({ratingValue || 0}/5)
              </span>
            </div>
          </div>

          {course.slug?.length > 0 ? (
            <div className="flex flex-wrap gap-2 mb-4">
              {course.slug[0]?.split(",")?.map((tag, index) => (
                <Link
                  href={`${locale}/courses/${tag.split(" ")?.join("-")?.toLowerCase()}`}
                  target="_blank"
                  key={index}
                  className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full"
                >
                  {tag}
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-gray-500 text-sm mb-4">No tags available</div>
          )}

          {token ? (
          ( 
             isAddToCart ? (
            <button 
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-full" 
            onClick={(e) => handleAddToCart(e,course._id)}

              ref={addCartRef}
            >
              <FiShoppingCart size={16} />
              add to cart
            </button> )
            : (
              <span className="flex flex-shrink "></span>)
          )
          )
          : (
            <Link
              href={`${locale}/login`}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-full"
            >
              <FiShoppingCart size={16} /> <span>add to cart</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;