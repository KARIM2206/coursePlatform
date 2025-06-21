'use client'
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

import { Loader } from "lucide-react";

export default  function Signup({ dict, locale }) {
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [role, setrole] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
 const [loading,setLoading]=useState(false)

  const router = useRouter();
  const params = useParams();
//  const localeNavigate = params?.locale || "en";
//   const dict=await getDictionary(localeNavigate); 
const translate=dict


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log( `localhost:5000/api/auth/signup`);
      setLoading(true)
      const response = await fetch(
        `http://localhost:5000/api/auth/signup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, password, email,role }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message);
        throw new Error(data.message);

      }

      let token = data.data;
      if (typeof window !== "undefined") {
        localStorage.setItem("token", token);
      }
toast.success("Account created successfully!")
      setname("");
      setpassword("");
      setemail("");
     setrole('')
      router.push(`/${locale}/login`);
    } catch (error) {
      console.error("Error:", error);
      setError(error.message || "Signup failed.");
    }
    finally{
      setLoading(false)
    }
  };

  const handleNextChange = (e) => {
    setNext(e.target.value);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-100 via-primary-50 to-blue-100 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.5, y: 100 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="w-[50%] flex items-center justify-center"
      >
        <div className="w-full  max-w-md bg-white shadow-xl rounded-2xl  p-10 space-y-8 border border-primary-600">
          <h2 className="text-3xl font-bold text-center text-primary-700">{translate.title}</h2>
          {error && <p className="text-red-600 text-center">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-6 flex flex-col gap-2 items-center">
            <div className="w-full">
              <label htmlFor="username" className="block text-sm font-medium text-primary-700">
               {translate.name}
              </label>
              <input
                type="text"
                id="username"
                placeholder={translate.namePlaceholder}
                value={name}
                onChange={(e) => setname(e.target.value)}
                required
                className="mt-2 w-full padding-input px-4 py-2 border border-primary-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-400 bg-primary-50"
              />
            </div>

            <div className="w-full">
              <label htmlFor="email" className="block text-sm font-medium text-primary-700">
                {translate.email}
              </label>
              <input
                type="email"
                id="email"
                placeholder={translate.emailPlaceholder}
                value={email}
                onChange={(e) => setemail(e.target.value)}
                required
                className="mt-2 w-full padding-input px-4 py-2 border border-primary-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-400 bg-primary-50"
              />
            </div>

            <div className="w-full">
              <label htmlFor="password" className="block text-sm font-medium text-primary-700">
                {translate.password}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder={translate.passwordPlaceholder}
                  value={password}
                  onChange={(e) => setpassword(e.target.value)}
                  required
                  className="mt-2 w-full padding-input px-4 py-2 border border-primary-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-400 pr-10 bg-primary-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
    className={`absolute top-1/2 ${locale === "ar" ? "left-3" : "right-3"} transform -translate-y-1/2 text-xs text-primary-600 hover:underline focus:outline-none`}
                >
                  {showPassword ? `${translate.hidePassword} `: `${translate.showPassword} `}
                </button>
              </div>
            </div>

     
          <select className="mt-2 w-full
           padding-input px-4 py-2 border border-primary-200 rounded-lg 
           shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-400 bg-primary-50"
              value={role} onChange={(e) => setrole(e.target.value)}>
            <option value="" disabled>{translate.selectRole}</option>
            <option value="student">{translate.student}</option>
            <option value="teacher">{translate.teacher}</option>
          </select>
       
          
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
      {translate.submit}
    </button>

            <p className="text-sm text-center text-primary-700 mt-6">
              {translate.alreadyHaveAccount}{" "}
              <Link href={`/${locale}/login`} className="text-primary-600 hover:underline font-semibold">
             {translate.login}
              </Link>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
}