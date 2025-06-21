'use client';

import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { Loader } from "lucide-react";
import { Context } from "../CONTEXT/ContextProvider";

export default function Login({ dict, locale }) {
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { setToken, setRefresh, fetchUser } = useContext(Context);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message);
        throw new Error(data.message || "Login failed");
      }

      toast.success(data.message);
      const token = data.token;
      
      if (!token) {
        throw new Error("Token not found in response");
      }

      // Use Context to update token
      setToken(token);
      
      // Trigger refresh and fetch user
      setRefresh(prev => !prev);
      
      router.push(`/${locale}/`);
      setemail("");
      setPassword("");

    } catch (error) {
      console.error("Error:", error);
      setError(error.message || "An error occurred during login.");
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-100 via-primary-50 to-blue-100 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.5, y: 100 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="w-[50%] flex items-center justify-center"
      >
        <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-10 space-y-8 border border-primary-600">
          <h2 className="text-3xl font-bold text-center text-primary-700">
            {dict.login || "Login"}
          </h2>
          {error && <p className="text-red-600 text-center">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-6 flex flex-col gap-2 items-center">
            <div className="w-full">
              <label htmlFor="email" className="block text-sm font-medium text-primary-700">
                {dict.email || "email"}
              </label>
              <input
                type="email"
                id="email"
                placeholder={dict.emailPlaceholder || "Enter email"}
                value={email}
                onChange={(e) => setemail(e.target.value)}
                required
                className="mt-2 w-full px-4 py-2 border border-primary-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-400 bg-primary-50"
              />
            </div>

            <div className="w-full">
              <label htmlFor="password" className="block text-sm font-medium text-primary-700">
                {dict.password || "Password"}
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder={dict.passwordPlaceholder || "Enter password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-2 w-full px-4 py-2 border border-primary-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-400 pr-10 bg-primary-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className={`absolute top-1/2 ${locale === "ar" ? "left-3" : "right-3"} transform -translate-y-1/2 text-xs text-primary-600 hover:underline focus:outline-none`}
                >
                  {showPassword ? (dict.hidePassword || "Hide") : (dict.showPassword || "Show")}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2.5 rounded-lg font-semibold transition duration-300 shadow flex items-center justify-center"
              disabled={loading}
            >
              {loading && (
                <span className="mr-2 w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin">
                  <Loader />
                </span>
              )}
              {dict.submit || "Login"}
            </button>

            <p className="text-sm text-center text-primary-700 mt-6">
              {dict.noAcount || "Don't have an account?"}{" "}
              <Link href={`/${locale}/register`} className="text-primary-600 hover:underline font-semibold">
                {dict.register || "Register"}
              </Link>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
