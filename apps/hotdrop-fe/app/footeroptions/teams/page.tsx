"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function TeamPage() {


  const achievements = [
    {
      title: "5K+ Happy Customers",
      description: "Served over 5000 satisfied customers across multiple cities",
      icon: "👥",
      color: "from-blue-500 to-purple-500"
    },
    {
      title: "50+ Restaurant Partners",
      description: "Built strong partnerships with top restaurants",
      icon: "🤝",
      color: "from-green-500 to-teal-500" 
    },
    {
      title: "2+ Cities Coverage",
      description: "Expanded operations to 25 cities nationwide",
      icon: "🏙️",
      color: "from-purple-500 to-pink-500"
    }
  ];

  const companyValues = [
    {
      title: "Innovation First",
      description: "We constantly push boundaries to create better solutions",
      icon: "💡"
    },
    {
      title: "Customer Obsession",
      description: "Every decision we make is centered around our customers",
      icon: "❤️"
    },
    {
      title: "Quality Excellence",
      description: "We never compromise on the quality of our service",
      icon: "⭐"
    },
    {
      title: "Team Spirit",
      description: "Together we achieve more than we ever could alone",
      icon: "🤝"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-blue-50 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
      {/* Header */}
      <nav className="w-full max-w-6xl mx-auto flex justify-between items-center py-6 px-4">
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/logo.png"
            alt="HotDrop Logo"
            width={32}
            height={32}
            className="rounded-lg"
          />
          <span className="text-xl font-bold text-gray-800 dark:text-orange-200">HotDrop</span>
        </Link>
        <Link 
          href="/" 
          className="text-red-500 hover:text-red-600 font-medium transition-colors dark:text-orange-300 dark:hover:text-orange-400"
        >
          ← Back to Home
        </Link>
      </nav>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.h1 
            className="text-5xl md:text-6xl font-bold text-gray-800 mb-6 dark:text-orange-100"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            Meet Our <span className="text-red-500">Team</span>
          </motion.h1>
          
          <motion.p 
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed dark:text-orange-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Two passionate founders on a mission to revolutionize food ordering System. 
            Together, we're building the future of how people discover and enjoy great food.
          </motion.p>
        </motion.div>



        {/* Our Journey */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-20 dark:bg-gray-900 dark:shadow-orange-900"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-8">
            <span className="dark:text-orange-100">Our Journey Together</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="bg-red-50 p-6 rounded-xl dark:bg-orange-900/30">
                <h3 className="text-xl font-bold text-red-600 mb-3 dark:text-orange-200">🚀 The Beginning</h3>
                <p className="text-gray-700 dark:text-orange-100">
                  Nikhil and Shashiranjan are more of brothers than friends, bonding over their shared love 
                  for great food and innovative technology. They realized that food delivery could be 
                  so much better than ever.
                </p>
              </div>
              <div className="bg-orange-50 p-6 rounded-xl dark:bg-orange-900/30">
                <h3 className="text-xl font-bold text-orange-600 mb-3 dark:text-orange-200">💡 The Spark</h3>
                <p className="text-gray-700 dark:text-orange-100">
                 Countless late-night coding marathons (fueled by cold pizza!) led to a simple realization — food should arrive fresh, on time, and hassle-free. That spark gave birth to the idea of a smarter, faster, and more reliable pre-ordering system.
                </p>
              </div>
              <div className="bg-blue-50 p-6 rounded-xl dark:bg-blue-900/30">
                <h3 className="text-xl font-bold text-blue-600 mb-3 dark:text-blue-200">🎯 The Mission</h3>
                <p className="text-gray-700 dark:text-blue-100">
                  Together, they're building HotDrop to be more than just a delivery service – 
                  it's a platform that connects communities, supports local businesses, and 
                  brings joy to every meal.
                </p>
              </div>
            </div>
            
            <div className="relative">
              <motion.div
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 2, -2, 0]
                }}
                transition={{ 
                  duration: 6, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                className="relative z-10"
              >
                <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl p-8 text-white text-center">
                  <h3 className="text-2xl font-bold mb-4 dark:text-orange-100">Partnership Stats</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-3xl font-bold dark:text-orange-100">2</div>
                      <div className="text-sm opacity-90 dark:text-orange-200">Co-Founders</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold dark:text-orange-100">3+</div>
                      <div className="text-sm opacity-90 dark:text-orange-200">Years Together</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold dark:text-orange-100">5K+</div>
                      <div className="text-sm opacity-90 dark:text-orange-200">Happy Customers</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold dark:text-orange-100">∞</div>
                      <div className="text-sm opacity-90 dark:text-orange-200">Shared Vision</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
          className="mb-20"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-12 dark:text-orange-100">
            What We've Achieved Together
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 ">
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6 + index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow dark:bg-gray-900 dark:shadow-orange-900"
              >
                <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${achievement.color} flex items-center justify-center text-2xl mb-4 mx-auto`}>
                  {achievement.icon}
                </div>
                <h3 className="text-lg font-bold dark:text-white text-gray-800 mb-2 text-center">{achievement.title}</h3>
                <p className="text-gray-600 text-sm text-center">{achievement.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Company Values */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8 }}
          className="bg-gradient-to-r from-red-500 to-orange-500 rounded-3xl p-8 md:p-12 text-white mb-20 dark:bg-gradient-to-r dark:from-orange-900 dark:to-red-900 dark:text-orange-100"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
            <span className="dark:text-orange-100">Our Shared Values</span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {companyValues.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 2.0 + index * 0.1 }}
                className="bg-white/20 backdrop-blur-sm rounded-xl p-6 text-center dark:bg-orange-900/40 dark:text-orange-100"
              >
                <div className="text-4xl mb-3">{value.icon}</div>
                <h3 className="text-lg font-bold mb-2">{value.title}</h3>
                <p className="text-sm opacity-90">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.2 }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 dark:text-orange-100">
            Get In Touch
          </h2>
          <p className="text-xl text-gray-600 mb-8 dark:text-orange-200">
            Have questions or want to collaborate? We'd love to hear from you!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:hotdrop.tech@gmail.com"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold rounded-full hover:from-red-600 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl dark:bg-gradient-to-r dark:from-orange-900 dark:to-red-900 dark:text-orange-100 dark:hover:from-orange-800 dark:hover:to-red-800"
            >
              📧 Email Us
            </a>
            <Link
              href="/footeroptions/help"
              className="inline-flex items-center px-8 py-4 bg-white text-red-500 border-2 border-red-500 font-bold rounded-full hover:bg-red-50 transition-all duration-200 shadow-lg hover:shadow-xl dark:bg-orange-900 dark:text-orange-200 dark:border-orange-500 dark:hover:bg-orange-800"
            >
              💬 Get Support
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}