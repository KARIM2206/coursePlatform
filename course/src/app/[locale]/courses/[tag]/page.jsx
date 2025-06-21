'use client'
import React, { use, useEffect } from 'react'
import CourseCard from '../../components/CourseCard';
import Breadcrumbs from '../../components/BreadCrumb';

const SearchByTag = ({params  }) => {
    const { tag } =use(params)
const [courses, setCourses] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const getCoursesByTag = async (tag) => {
        setLoading(true);
        try {
        const response = await fetch(`http://localhost:5000/api/course/all?tag=${tag}`);
        if (!response.ok) {
            throw new Error('Failed to fetch courses by tag');
        }
        setLoading(false);
        const data = await response.json();
        return data.courses || [];
        } catch (error) {
        console.error('Error fetching courses by tag:', error);
        setLoading(false);
        return [];
        }
    }

    useEffect(()=>{
    const fetchCourses = async () => {
            try {
                const courses = await getCoursesByTag(tag);
                setCourses(courses);
                console.log('Courses fetched by tag:', courses);
            } catch (error) {
                console.error('Error fetching courses by tag:', error);
            }
        };
        fetchCourses();
    },[tag])
if(!tag) {
  return (
    <div>
      <h1 className="text-2xl font-bold">No Tag Provided</h1>
      <p>Please provide a tag to search for courses.</p>
    </div>
  )
}
  return (
 <div className="bg-gradient-to-r from-white via-blue-50 to-blue-100 min-h-screen">
      <div className=" mx-auto px-4 sm:px-6 lg:px-12 py-4">
      <h1 className="text-2xl font-bold">Courses by Tag: {tag}</h1>
      {loading ? (
        <p>Loading...</p>
      ) : ( 
           <div className='flex flex-col gap-4 justify-center'>
            <div><Breadcrumbs /></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
           
         
             {courses.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}   
            </div>
          
        </div>
      )}
    </div>
    </div>
  )
}

export default SearchByTag
