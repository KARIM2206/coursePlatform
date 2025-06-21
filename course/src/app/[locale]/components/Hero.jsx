'use client';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import { Autoplay, Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules'

export default function Hero() {
    const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 }
}
 const features = [
    { icon: '🧩', text: 'Problem Solving', desc: 'Master critical thinking with our interactive challenges' },
    { icon: '💬', text: 'Live Chat', desc: 'Real-time communication with instructors and peers' },
    { icon: '📚', text: 'Group Reading', desc: 'Collaborative learning sessions with classmates' },
    { icon: '🎓', text: '10k+ Courses', desc: 'Vast selection across all disciplines' },
    { icon: '🛠️', text: 'Hands-on', desc: 'Practical activities for better retention' },
  ];
     const avatarVariants = {
    animate: (i) => ({
      x: [0, 10 * (i % 2 === 0 ? 1 : -1), 0],
      y: [0, -10, 0],
      transition: {
        duration: 2 + i * 0.3,
        repeat: Infinity,
        repeatType: "loop",
        ease: "easeInOut"
      }
    })
  }

  return (
    <main className="bg-gradient-to-r from-white via-blue-50 to-blue-100 min-h-screen">

      <div className=" px-1 sm:px-2 lg:px-6 py-6 sm:py-12 lg:py-16">
        {/* Hero Section */}
        <section className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl
         p-8 sm:p-12 lg:p-16 flex flex-col lg:flex-row items-center
          justify-between gap-8 lg:gap-12 overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-blue-100/30 blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-blue-200/20 blur-3xl"></div>
          
          {/* Left Content */}
          <div className="lg:w-1/2 space-y-6 relative z-10">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                Quality Education
              </span>
              <br />
              By Any Means Necessary
            </h1>
            <p className="text-lg text-gray-600 max-w-lg">
              Join over 15,000 students worldwide in our interactive learning platform designed for success.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/get-started"
                className="inline-block bg-blue-600
                 hover:bg-blue-700 text-white font-semibold text-lg 
                 px-8 py-4 rounded-lg whitespace-nowrap transition-all
                  duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Get Started
              </Link>
              <Link
                href="/courses"
                className="inline-block border-2
                 border-blue-600 text-blue-600 whitespace-nowrap
                 font-semibold text-lg px-8 py-4 rounded-lg transition-all
                  duration-300 hover:bg-blue-50 "
              >
                Browse Courses
              </Link>
            </div>
          </div>

          {/* Right Content */}
          <div className="w-[37.8%] md:pr-[0px] sm:pr-[10%] sm:w-[68.4%]
           mt-[70px] ml-[21%] relative z-10 ">
            <div className="relative w-full pt-[117.86%]
             rounded-3xl overflow-hidden shadow-xl">
              <Image
                src="/images/hero-image.png"
                alt="Students learning together in a modern classroom"
                fill
                className="object-cover absolute top-0 left-0 w-full h-full
              rounded-[24px_24px_60px_24px] 
               md:rounded-[40px_40px_100px_40px]
                transition-transform duration-300 ease-in-out hover:scale-105"
                // sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>

 
<div
  className="bg-white shadow-[0_0_69px_0_rgba(112,112,112,0.25)]
   rounded-[14px_14px_30px_14px] p-[16px_24px_12px] w-[262px] absolute z-[2] left-[-34.33%] bottom-[18.7%]"
>
  <p className="first-line:font-poppins text-[20px] font-semibold leading-[1.5] text-center">
    Learn from the best instructors globally
  </p>
  <div
    className="
      flex justify-center 
      mt-[10px]
     
     
    "
  >
    {[1, 2, 3, 4].map((i) => (
      <div
        key={i}
        className="w-[50px] h-[50px] rounded-full overflow-hidden 
        flex-shrink-0 border-[3px] border-white -ml-[21px] first-of-type:ml-0">

        <Image
          src={`/images/avatar.jpg`}
          alt={`Instructor ${i}`}
          width={48}
          height={48}
          className="w-full h-full object-cover"
        />
      </div>
    ))}
  </div>
</div>
            {/* Stats Card */}
           <div
  className="
    bg-white
    shadow-[0_0_42.7px_0_rgba(112,112,112,0.25)]
    rounded-[8px_8px_16px_8px]
    w-[130px]
    p-[16px_12px_8px]
    text-center
    absolute
    bottom-[6.5%]
    right-[-20px]
  "
>
             <div className="bg-[#e1f0ff] p-[7px] rounded-full w-fit leading-0 mx-auto mb-[4px]">
  <svg
                  className="w-3 h-3 sm:w-5 sm:h-5 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm0 2a10 10 0 100-20 10 10 0 000 20z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="text-sm sm:text-2xl font-bold text-gray-900">15k+</p>
              <p className="text-[16px] sm:text-sm text-gray-600">Global Students</p>
            </div>
          </div>
        </section>
  <section className="mt-16 lg:mt-24">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-12">
            Why Choose Our Platform
          </h2>
          <Swiper
            spaceBetween={24}
            modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            scrollbar={{ draggable: true }}
            autoplay={{
              delay: 3500,
              disableOnInteraction: false,
            }}
            breakpoints={{
              0: { slidesPerView: 1 },
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 4 }, // 4 بطاقات في الصفحة الكبيرة
            }}
          >
            {features.map((feature, index) => (
              <SwiperSlide key={index}>
                <div className="bg-white rounded-2xl p-8 flex flex-col items-center gap-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100 h-[340px]">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-3xl w-16 h-16 flex items-center justify-center rounded-full mb-2">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 text-center">
                    {feature.text}
                  </h3>
                  <p className="text-base text-gray-600 text-center">
                    {feature.desc}
                  </p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>
        

        {/* Testimonial Section */}
        <section className="mt-24 bg-gradient-to-r from-blue-600 to-blue-500 rounded-3xl p-8 sm:p-12 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-16 h-16 mx-auto rounded-full overflow-hidden border-4 border-white mb-6">
              <Image
                src="/images/avatar.jpg"
                alt="Sarah Johnson"
              width={64}
              height={64}
                className="object-cover w-16 h-16 rounded-full"
              />
            </div>
            <blockquote className="text-xl sm:text-2xl font-medium italic mb-6">
              "This platform transformed my learning experience. The interactive courses and supportive community helped me land my dream job in just 6 months!"
            </blockquote>
            <p className="font-bold">Sarah Johnson</p>
            <p className="text-blue-100">Computer Science Graduate</p>
          </div>
        </section>
      </div>
    </main>
  );
}