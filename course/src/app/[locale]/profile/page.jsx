
// 'use client'
// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import { motion } from "framer-motion";

// export default function Login() {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [error, setError] = useState("");
//   const router = useRouter();

// //   useEffect(() => {
// //     const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
// //     if (token) {
// //       router.push("/");
// //     }
// //   }, [router]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch(
//         "http://ec2-3-76-10-130.eu-central-1.compute.amazonaws.com:4001/api/v1/auth/signing",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ username, password }),
//         }
//       );

//       const data = await response.json();
//       if (!response.ok) {
//         throw new Error(data.message || "Login failed");
//       }

//       let token = data.data;

//       const userInfoResponse = await fetch(
//         "http://ec2-3-76-10-130.eu-central-1.compute.amazonaws.com:4001/api/v1/users/@me",
//         {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       let userInfo = await userInfoResponse.json();

//       if (typeof window !== "undefined") {
//         localStorage.setItem("token", token);
//         localStorage.setItem("role", userInfo.data.role);
//       }

//       // Redirect based on user role
//       router.push(userInfo.data.role === "ADMIN" ? "/dashboard" : "/");
//     } catch (error) {
//       console.error("Error:", error);
//       setError(error.message || "An error occurred during login.");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-100
//      via-primary-50 to-blue-100 padding-x ">
//       <motion.div
//         initial={{ opacity: 0, scale: 0.5, y: 100 }}
//         animate={{ opacity: 1, y: 0, scale: 1 }}
//         transition={{ duration: 1.2, ease: "easeOut" }}
//       >
        
//         <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-10
//          space-y-8 border border-primary-600 padding-x   padding-y ">
//           <h2 className="text-3xl font-bold text-center text-primary-700">Login</h2>
//           {error && <p className="text-red-600 text-center">{error}</p>}

//           <form onSubmit={handleSubmit} className="space-y-6 padding-y flex
//            items-center gap-2 flex-col">
//             <div>
//               <label htmlFor="username" className="block text-sm font-medium text-primary-700">
//                 Username
//               </label>
//               <input
//                 type="text"
//                 id="username"
//                 placeholder="Enter username"
//                 value={username}
//                 onChange={(e) => setUsername(e.target.value)}
//                 required
//                 className="mt-2 w-full padding-input px-4 py-2 border border-primary-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-400 bg-primary-50"
//               />
//             </div>

//             <div>
//               <label htmlFor="password" className="block text-sm font-medium text-primary-700">
//                 Password
//               </label>
//               <div className="relative">
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   id="password"
//                   placeholder="Enter password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   required
//                   className="mt-2 w-full px-4 py-2 padding-input  border border-primary-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-400 pr-10 bg-primary-50"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword((prev) => !prev)}
//                   className="absolute top-1/2 right-3 transform -translate-y-1/2 text-xs text-primary-600 hover:underline focus:outline-none"
//                 >
//                   {showPassword ? "Hide" : "Show"}
//                 </button>
//               </div>
//             </div>

//             <button
//               type="submit"
//               className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2.5 rounded-lg font-semibold transition duration-300 shadow"
//             >
//               Login
//             </button>

//             <p className="text-sm text-center text-primary-700 mt-6">
//               Don't have an account?{" "}
//               <Link href="/signup" className="text-primary-600 hover:underline font-semibold">
//                 Register
//               </Link>
//             </p>
//           </form>
//         </div>
//       </motion.div>
//     </div>
//   );
// }

import { getDictionary } from '@/i18n/server'

import React from 'react'
import Profile from '../components/Profile';
import Link from 'next/link';
import { FiHome } from 'react-icons/fi';
import AuthControl from '../components/AuthControl';

 
export default async function  ProfilePage ({ params }){

    const locale = params?.locale || "en";

    
const dict=await getDictionary(locale)
console.log(dict.signup);

  return( <>
  <Profile dict={dict.signup} locale={locale} />
 
  </>
);
}




