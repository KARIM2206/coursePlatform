'use client'
import { useContext, useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { Loader } from "lucide-react";
import ImageDropzone from "./ImageDropzone";
import { Context } from "../CONTEXT/ContextProvider";

export default function CreateCourse({ dict, locale }) {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState([]); // not used in this component, but kept for structure
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [image, setImage] = useState(null);
  const [showPassword] = useState(false); // not needed, but kept for structure
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [category, setCategory] = useState("");
const categories= [
    { _id: "665f7c2e2f8b2e001e3a1234", name: "Programming" },
    { _id: "665f7c2e2f8b2e001e3a1235", name: "Design" },
    { _id: "665f7c2e2f8b2e001e3a1236", name: "Business" },
    { _id: "665f7c2e2f8b2e001e3a1237", name: "Marketing" }
  ]


const {token}=useContext(Context)
  const router = useRouter();
  const params = useParams();
  const translate = dict;
  const handleChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    
    // Convert comma-separated string to array
    const array = value.split(',').map(item => item.trim());
    setSlug(array);
  };
  //   useEffect(() => {
  //  const fetchCategories = async () => {
  //       try {
  //         const response = await fetch("http://localhost:5000/api/category");
  //         const data = await response.json();
  //         if (data.ok) {
  //           setCategories(data.categories);
  //         } else {
  //           toast.error(data.message || "Failed to fetch categories");
  //         }
  //       } catch (error) {
  //         console.error("Error fetching categories:", error);
  //         toast.error("Failed to fetch categories");
  //       }
  //  }
  //     fetchCategories();
  // }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("slug", slug);
       formData.append("category", category); 
      console.log(image);
      
      if (image) formData.append("image", image);
console.log(slug);

      const response = await fetch(
        `http://localhost:5000/api/course/create`,
        {
          method: "POST",
          headers: {
              "Authorization": `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();
console.log("Response Data:", data);

      if (!response.ok) {
        toast.error(data.message);
        throw new Error(data.message);
      }

      toast.success("Course created successfully!");
      localStorage.setItem("courseToken", data.courseToken);
      setTitle("");
      setDescription("");
      setPrice("");
      setImage(null);
      router.push(`/${locale}/dashboard/course/${data.course._id}`);
    } catch (error) {
      console.error("Error:", error);
      setError(error.message || "Course creation failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center
     bg-gradient-to-br from-primary-100 via-primary-50 to-blue-100 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.5, y: 100 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="w-[50%] flex items-center justify-center"
      >
        <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-10 space-y-8 border border-primary-600">
          <h2 className="text-3xl font-bold text-center 
          text-primary-700">{translate.title || "Create Course"}</h2>
          {error && <p className="text-red-600 text-center">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-6 flex flex-col gap-2 items-center">
            <div className="w-full">
              <label htmlFor="title" className="block text-sm font-medium text-primary-700">
                {translate.courseTitle || "Course Title"}
              </label>
              <input
                type="text"
                id="title"
                placeholder={translate.courseTitlePlaceholder || "Enter course title"}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="mt-2 w-full px-4 py-2 border border-primary-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-400 bg-primary-50"
              />
            </div>

            <div className="w-full">
              <label htmlFor="description" className="block text-sm font-medium text-primary-700">
                {translate.courseDescription || "Description"}
              </label>
              <textarea
                id="description"
                placeholder={translate.courseDescriptionPlaceholder || "Enter course description"}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="mt-2 w-full px-4 py-2 border border-primary-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-400 bg-primary-50"
              />
            </div>

            <div className="w-full">
              <label htmlFor="price" className="block text-sm font-medium text-primary-700">
                {translate.coursePrice || "Price"}
              </label>
              <input
                type="number"
                id="price"
                placeholder={translate.coursePricePlaceholder || "Enter course price"}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                min="0"
                className="mt-2 w-full px-4 py-2 border border-primary-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-400 bg-primary-50"
              />
            </div>
  <div className="w-full">
              <label htmlFor="category" className="block text-sm font-medium text-primary-700">
                {translate.courseCategory || "Category"}
              </label>
              <select
                id="category"
                value={category}
                onChange={e => setCategory(e.target.value)}
                required
                className="mt-2 w-full px-4 py-2 border border-primary-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-400 bg-primary-50"
              >
                <option value="">Select category</option>
                {categories?.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat?.name}</option>
                ))}
              </select>
            </div>
             <div className="w-full">
  <label htmlFor="slug" className="block text-sm font-medium text-primary-700">
    {translate.courseSlug || "Keywords (comma separated)"}
  </label>
<input
  id="slug"
  placeholder={translate.courseSlugPlaceholder || "e.g. javascript, web, backend"}
   value={inputValue}
        onChange={handleChange}
  required
  className="mt-2 w-full px-4 py-2 border border-primary-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-400 bg-primary-50"
/>
  <p className="text-xs text-gray-500 mt-1">
    Separate keywords with commas. Example: <span className="italic">javascript, web, backend</span>
  </p>
</div>
          <ImageDropzone  setImage={setImage} courseImage={translate.courseImage} />
            <button
              type="submit"
              className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2.5 rounded-lg font-semibold transition duration-300 shadow flex items-center justify-center"
              disabled={loading}
            >
              {loading && (
                <span className="mr-2 w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin">
                  <Loader className="w-6 h-6 animate-spin text-blue-500" />
                </span>
              )}
              {translate.submit || "Create Course"}
            </button>

            <p className="text-sm text-center text-primary-700 mt-6">
              <Link href={`/${locale}/courses`} className="text-primary-600 hover:underline font-semibold">
                {translate.backToCourses || "Back to Courses"}
              </Link>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
}