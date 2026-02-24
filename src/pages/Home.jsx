import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-pink-100 via-orange-100 to-yellow-100">

      {/* Animated Background Blobs */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-pink-400 rounded-full blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute top-20 right-0 w-[400px] h-[400px] bg-orange-400 rounded-full blur-3xl opacity-30 animate-bounce"></div>
      <div className="absolute bottom-0 left-40 w-[350px] h-[350px] bg-yellow-400 rounded-full blur-3xl opacity-30 animate-pulse"></div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center">

        {/* Floating Badge */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-6 px-6 py-2 bg-white/60 backdrop-blur-lg rounded-full shadow-md text-sm font-medium text-gray-700"
        >
          🚀 Smart Certification Management Platform
        </motion.div>

        {/* Hero Section */}
        <motion.h1
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-6xl md:text-7xl font-extrabold text-gray-800 leading-tight"
        >
          Track Your
          <span className="block bg-gradient-to-r from-pink-500 via-orange-500 to-yellow-400 bg-clip-text text-transparent">
            Certifications
          </span>
          With Confidence
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 text-lg md:text-xl text-gray-700 max-w-2xl leading-relaxed"
        >
          Organize, monitor, renew, and showcase your professional credentials
          in one beautiful and intelligent dashboard.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-10 flex gap-6"
        >
          <Link
            to="/dashboard"
            className="px-8 py-3 rounded-xl font-semibold text-white
                       bg-gradient-to-r from-pink-500 to-orange-500
                       hover:scale-110 transition-all duration-300
                       shadow-lg hover:shadow-2xl"
          >
            Get Started
          </Link>

          <button
            className="px-8 py-3 rounded-xl font-semibold text-gray-800                       bg-white/70 backdrop-blur-md border border-white/40                       hover:scale-110 transition-all duration-300
                       shadow-lg hover:shadow-2xl"
          >
            Learn More
          </button>
        </motion.div>

        {/* Stats Section */}
        {/* Value Highlights Section */}
<div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
  
  <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-8 shadow-xl hover:-translate-y-2 transition-all duration-300">
    <div className="text-4xl mb-4">📁</div>
    <h3 className="text-xl font-bold text-gray-800">
      Smart Organization
    </h3>
    <p className="text-gray-600 mt-3">
      Keep all your certifications structured, searchable, and accessible anytime.
    </p>
  </div>

  <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-8 shadow-xl hover:-translate-y-2 transition-all duration-300">
    <div className="text-4xl mb-4">⏰</div>
    <h3 className="text-xl font-bold text-gray-800">
      Expiry Monitoring
    </h3>
    <p className="text-gray-600 mt-3">
      Never miss renewal deadlines with intelligent expiry tracking.
    </p>
  </div>

  <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-8 shadow-xl hover:-translate-y-2 transition-all duration-300">
    <div className="text-4xl mb-4">🔒</div>
    <h3 className="text-xl font-bold text-gray-800">
      Secure Management
    </h3>
    <p className="text-gray-600 mt-3">
      Manage your professional credentials safely and efficiently.
    </p>
  </div>

</div>

        {/* Features Preview */}
        <div className="mt-24 max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {[
            {
              title: "📂 Organized Dashboard",
              desc: "All your certifications neatly structured and searchable.",
            },
            {
              title: "⏰ Renewal Alerts",
              desc: "Smart notifications before expiry dates.",
            },
            {
              title: "🔒 Secure & Reliable",
              desc: "Your professional credentials are protected.",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-white/70 backdrop-blur-lg p-8 rounded-2xl shadow-xl hover:-translate-y-2 transition-all duration-300"
            >
              <h3 className="text-xl font-bold text-gray-800">
                {feature.title}
              </h3>
              <p className="text-gray-600 mt-3">{feature.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default Home;