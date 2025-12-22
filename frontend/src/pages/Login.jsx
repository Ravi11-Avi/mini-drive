import { useState } from "react";
import api from "../api/axios.js";
import { Link, useNavigate } from "react-router-dom";
import GoogleIcon from "../assets/googleIcon.png";
import WGitIcon from "../assets/WgithubIcon.png";
import LogoIcon from "../assets/logo.png";
const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function Login() {
  const navigation = useNavigate();
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [error, seterror] = useState("");

  const handleloginsubmit = async (e) => {
    e.preventDefault();
    seterror("");

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      navigation("/drive");
    } catch (err) {
      seterror(err.response?.data?.msg || "Login Failed");
    }
  };

  // const handlegithublogin=()=>{
  //   window.location.href = "http://localhost:5000/api/auth/github";
  // }
  // const handlegooglelogin = ()=>{
  //   window.location.href = "http://localhost:5000/api/auth/google"
  // }

  const handlegithublogin = () => {
  window.location.href = `${API}/auth/github`;
};

const handlegooglelogin = () => {
  window.location.href = `${API}/auth/google`;
};


  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gradient-to-br from-gray-900 to-black">
      
      {/* Form Container - Shows first on mobile, left on desktop */}
      <div className="order-2 lg:order-1 w-full lg:w-1/2 xl:w-2/5 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-sm lg:max-w-md xl:max-w-lg bg-gray-900/90 lg:bg-transparent p-6 sm:p-8 lg:p-10 rounded-xl lg:rounded-none shadow-2xl lg:shadow-none">
          <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
            <img
              src={LogoIcon}
              alt="Mini Google Drive Logo"
              className="w-12 h-10 sm:w-16 sm:h-14 lg:w-20 lg:h-16 flex-none"
            />
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-purple-400">
              Mini Google Drive
            </h2>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4">
            Login to your account
          </h2>

          <p className="text-sm sm:text-base text-gray-300 mb-6 sm:mb-8">
            Don't have an account?{" "}
            <Link 
              to="/signup" 
              className="text-purple-400 hover:text-purple-300 hover:underline transition-colors font-medium"
            >
              Sign Up
            </Link>
          </p>

          {error && (
            <div className="mb-6 sm:mb-8 p-3 sm:p-4 bg-red-900/20 border border-red-800 rounded-lg">
              <p className="text-red-400 text-sm sm:text-base text-center">
                {error}
              </p>
            </div>
          )}

          <form onSubmit={handleloginsubmit} className="space-y-5 sm:space-y-6">
            <div>
              <label className="block text-sm sm:text-base font-medium mb-2 text-gray-300">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                placeholder="abcd@example.com"
                onChange={(e) => setemail(e.target.value)}
                className="w-full px-4 py-3 sm:px-5 sm:py-3.5 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-white placeholder-gray-500 text-sm sm:text-base"
                required
              />
            </div>

            <div>
              <label className="block text-sm sm:text-base font-medium mb-2 text-gray-300">
                Password
              </label>
              <input
                type="password"
                value={password}
                placeholder="Enter your password"
                onChange={(e) => setpassword(e.target.value)}
                className="w-full px-4 py-3 sm:px-5 sm:py-3.5 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-white placeholder-gray-500 text-sm sm:text-base"
                required
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-purple-700 hover:bg-purple-600 active:bg-purple-800 text-white py-3.5 sm:py-4 rounded-lg font-medium shadow-lg hover:shadow-purple-500/30 active:scale-[0.98] transition-all duration-300 text-sm sm:text-base"
              >
                Login
              </button>
            </div>

            <div className="relative my-6 sm:my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm sm:text-base">
                <span className="px-3 bg-gray-900 text-gray-400">OR</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="button"
                onClick={handlegooglelogin}
                className="flex-1 flex items-center justify-center gap-2 sm:gap-3 border border-purple-800/50 py-3 sm:py-3.5 px-4 rounded-lg hover:bg-purple-900/20 hover:border-purple-600 transition-all duration-300 group"
              >
                <img 
                  src={GoogleIcon} 
                  alt="Google" 
                  className="w-5 h-5 sm:w-6 sm:h-6 flex-none" 
                />
                <span className="text-gray-300 text-sm sm:text-base font-medium group-hover:text-white">
                  Google
                </span>
              </button>

              <button
                type="button"
                onClick={handlegithublogin}

                className="flex-1 flex items-center justify-center gap-2 sm:gap-3 border border-gray-700 py-3 sm:py-3.5 px-4 rounded-lg hover:bg-gray-800 hover:border-purple-600 transition-all duration-300 group"
              >
                <img 
                  src={WGitIcon} 
                  alt="GitHub" 
                  className="w-5 h-5 sm:w-6 sm:h-6 flex-none" 
                />
                <span className="text-gray-300 text-sm sm:text-base font-medium group-hover:text-white">
                  GitHub
                </span>
              </button>
            </div>

            {/* Mobile-only back to home link */}
            <div className="lg:hidden text-center pt-4">
              <Link 
                to="/" 
                className="text-sm text-gray-400 hover:text-gray-300 transition-colors"
              >
                ← Back to Home
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Image Container - Shows second on mobile, right on desktop */}
      <div className="order-1 lg:order-2 relative w-full lg:w-1/2 xl:w-3/5 h-64 sm:h-80 md:h-96 lg:h-auto">
        <img 
          src="https://img.freepik.com/premium-photo/motivational-inspirational-quotes-everyday-is-new-beginning_698447-1432.jpg?semt=ais_hybrid&w=740&q=80" 
          alt="Inspirational background"
          className="w-full h-full object-cover lg:object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b lg:bg-gradient-to-r from-black/80 via-black/60 to-black/80 lg:from-black/70 lg:via-purple-900/20 lg:to-black/70">
          
          {/* Overlay text for mobile/tablet */}
          <div className="absolute bottom-6 left-6 right-6 lg:hidden">
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Secure Cloud Storage
            </h3>
            <p className="text-gray-300 text-sm sm:text-base">
              Store, access, and share your files from anywhere
            </p>
          </div>
          
          {/* Overlay text for desktop (matches your original) */}
          <div className="hidden lg:flex items-center justify-center h-full">
            <div className="text-center px-8">
              <h3 className="text-4xl xl:text-5xl font-bold text-white mb-4">
                Your Files, Everywhere
              </h3>
              <p className="text-xl text-gray-300 max-w-2xl">
                Access your documents, photos, and videos from any device with secure cloud storage
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;