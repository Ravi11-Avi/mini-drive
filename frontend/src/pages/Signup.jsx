import { useState } from "react";
import api from "../api/axios.js";
import { Link, useNavigate } from "react-router-dom";
import GoogleIcon from "../assets/googleIcon.png";
import GitIcon from "../assets/githubIcon.png";
import LogoIcon from "../assets/logo.png";

function SignUp() {
  const navigation = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await api.post("/auth/signup", {
        name,
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      alert("Sign Up Successful!");
      navigation("/drive"); // Redirect to drive after successful signup
    } catch (err) {
      setError(err.response?.data?.msg || "Sign Up Failed");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gradient-to-br from-gray-900 to-black">
      
      {/* Image on LEFT side - Shows first on mobile */}
      <div className="order-1 lg:order-1 relative w-full lg:w-1/2 xl:w-3/5 h-64 sm:h-80 md:h-96 lg:h-auto">
        <img 
          src="https://img.freepik.com/premium-photo/motivational-inspirational-quotes-everyday-is-new-beginning_698447-1432.jpg?semt=ais_hybrid&w=740&q=80" 
          alt="Inspirational background"
          className="w-full h-full object-cover lg:object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b lg:bg-gradient-to-l from-black/80 via-black/60 to-black/80 lg:from-black/70 lg:via-purple-900/20 lg:to-black/70">
          
          {/* Overlay text for mobile/tablet */}
          <div className="absolute bottom-6 left-6 right-6 lg:hidden">
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Join Our Cloud
            </h3>
            <p className="text-gray-300 text-sm sm:text-base">
              Secure storage for all your files
            </p>
          </div>
          
          {/* Overlay text for desktop */}
          <div className="hidden lg:flex items-center justify-center h-full">
            <div className="text-center px-8">
              <h3 className="text-4xl xl:text-5xl font-bold text-white mb-4">
                Start Your Cloud Journey
              </h3>
              <p className="text-xl text-gray-300 max-w-2xl">
                Create an account and get instant access to secure cloud storage
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form on RIGHT side - Shows second on mobile */}
      <div className="order-2 lg:order-2 w-full lg:w-1/2 xl:w-2/5 flex items-center justify-center p-4 sm:p-6 lg:p-8">
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
            Create your account
          </h2>

          <p className="text-sm sm:text-base text-gray-300 mb-6 sm:mb-8">
            Already have an account?{" "}
            <Link 
              to="/login" 
              className="text-purple-400 hover:text-purple-300 hover:underline transition-colors font-medium"
            >
              Login
            </Link>
          </p>

          {error && (
            <div className="mb-6 sm:mb-8 p-3 sm:p-4 bg-red-900/20 border border-red-800 rounded-lg">
              <p className="text-red-400 text-sm sm:text-base text-center">
                {error}
              </p>
            </div>
          )}

          <form onSubmit={handleSignUpSubmit} className="space-y-5 sm:space-y-6">
            {/* Name Field */}
            <div>
              <label className="block text-sm sm:text-base font-medium mb-2 text-gray-300">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                placeholder="John Doe"
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 sm:px-5 sm:py-3.5 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-white placeholder-gray-500 text-sm sm:text-base"
              />
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm sm:text-base font-medium mb-2 text-gray-300">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                placeholder="abcd@example.com"
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 sm:px-5 sm:py-3.5 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-white placeholder-gray-500 text-sm sm:text-base"
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm sm:text-base font-medium mb-2 text-gray-300">
                Password
              </label>
              <input
                type="password"
                value={password}
                placeholder="Create a password"
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength="6"
                className="w-full px-4 py-3 sm:px-5 sm:py-3.5 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-white placeholder-gray-500 text-sm sm:text-base"
              />
              <p className="text-xs sm:text-sm text-gray-400 mt-2">Must be at least 6 characters</p>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm sm:text-base font-medium mb-2 text-gray-300">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                placeholder="Confirm your password"
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-3 sm:px-5 sm:py-3.5 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-white placeholder-gray-500 text-sm sm:text-base"
              />
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start space-x-3 pt-2">
              <input
                type="checkbox"
                id="terms"
                required
                className="mt-1 accent-purple-600 w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
              />
              <label htmlFor="terms" className="text-xs sm:text-sm text-gray-300">
                I agree to the{" "}
                <a href="/terms" className="text-purple-400 hover:underline">
                  Terms & Conditions
                </a>{" "}
                and{" "}
                <a href="/privacy" className="text-purple-400 hover:underline">
                  Privacy Policy
                </a>
              </label>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-700 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white py-3.5 sm:py-4 rounded-lg font-medium shadow-lg hover:shadow-purple-500/30 active:scale-[0.98] transition-all duration-300 text-sm sm:text-base"
              >
                Create Account
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
                className="flex-1 flex items-center justify-center gap-2 sm:gap-3 border border-gray-700 py-3 sm:py-3.5 px-4 rounded-lg hover:bg-gray-800 hover:border-purple-600 transition-all duration-300 group"
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
                className="flex-1 flex items-center justify-center gap-2 sm:gap-3 border border-gray-700 py-3 sm:py-3.5 px-4 rounded-lg hover:bg-gray-800 hover:border-purple-600 transition-all duration-300 group"
              >
                <img 
                  src={GitIcon} 
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
    </div>
  );
}

export default SignUp;