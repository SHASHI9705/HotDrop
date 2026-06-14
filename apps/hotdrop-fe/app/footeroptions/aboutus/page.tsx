"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function AboutPage() {
  

  const stats = [
    { number: "5K+", label: "Happy Customers", icon: "👥" },
    { number: "100+", label: "Partner Restaurants", icon: "🍽️" },
    // { number: "50K+", label: "Orders Delivered", icon: "📦" },
    { number: "2+", label: "Cities Served", icon: "🏙️" }
  ];

  const values = [
    {
      title: "Quality First",
      description: "We collaborate with top local restaurants and ensure every order is freshly prepared and meets our quality promise — because great taste matters.",
      icon: "⭐",
      color: "from-yellow-400 to-orange-500"
    },
    {
      title: "Lightning Fast",
      description: "We prep your order while you're on the way. Skip the wait — your food is ready when you arrive.",
      icon: "⚡",
      color: "from-blue-400 to-purple-500"
    },
    {
      title: "Customer Love",
      description: "You’re not just a customer — you’re part of the HotDrop family. We’re here to make every pickup smooth and satisfying.",
      icon: "❤️",
      color: "from-red-400 to-pink-500"
    },
    {
      title: "Innovation",
      description: "We're constantly evolving, using cutting-edge technology to improve your experience.",
      icon: "🚀",
      color: "from-green-400 to-teal-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
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
          <span className="text-xl font-bold text-gray-800 dark:text-gray-100">HotDrop</span>
        </Link>
        <Link 
          href="/" 
          className="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 font-medium transition-colors"
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
            className="text-5xl md:text-6xl font-bold text-gray-800 dark:text-gray-100 mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            About <span className="text-red-500 dark:text-red-400">HotDrop</span>
          </motion.h1>
          
          <motion.p 
            className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
           At HotDrop, we're on a mission to make great food more accessible and hassle-free. Founded in 2025, we’ve revolutionized the way you order by letting you pre-book your favorite meals and pick them up fresh from the shop—no waiting, no delays. With a strong focus on quality, speed, and customer satisfaction, HotDrop is redefining convenience in local food ordering.
          </motion.p>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 + index * 0.1 }}
              className="text-center bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="text-4xl mb-3">{stat.icon}</div>
              <div className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">{stat.number}</div>
              <div className="text-gray-600 dark:text-gray-300 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Our Story Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 md:p-12 mb-20"
        >
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-300 leading-relaxed text-xl">
                <p>
                  It all began with a simple thought: getting your favorite food should be fast and effortless. Frustrated with long queues and slow service, we set out to build something better.
                </p>
                <p>
                  What started as just an idea soon turned into a full-fledged platform — HotDrop. Designed to save time and eliminate wait, we connect customers with nearby shops so they can pre-order and pick up without the hassle.
                </p>
                <p>
                  Today, HotDrop proudly serves over 5,000 customers across 2+ cities, collaborating with 100+ restaurants to make your favorite meals ready when you are — no delivery, just quick pickup.
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
                  duration: 4, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                className="relative z-10"
              >
                <Image
                  src="/girl2.png"
                  alt="Our Story"
                  width={400}
                  height={400}
                  className="rounded-2xl shadow-2xl"
                />
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl transform rotate-3 -z-10 opacity-20"></div>
            </div>
          </div>
        </motion.div>

        {/* Our Values Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mb-20"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 text-center mb-12">
            Our Values
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.4 + index * 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${value.color} flex items-center justify-center text-2xl mb-4`}>
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3">{value.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Mission Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6 }}
          className="bg-gradient-to-r from-red-500 to-orange-500 rounded-3xl p-8 md:p-12 text-white text-center mb-20"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Mission</h2>
          <p className="text-xl leading-relaxed max-w-3xl mx-auto">
            To make great food easily accessible to everyone, right around the corner. We believe a delicious meal can spark joy, bring people together, and brighten any day. That’s why we’re here — to make ordering simple, pickups faster, and every bite memorable.
          </p>
        </motion.div>



        

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.6 }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold dark:text-white text-gray-800 mb-6">
            Ready to Join Our Story?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Whether you're a food lover, restaurant owner, or delivery partner, 
            there's a place for you in the HotDrop family.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold rounded-full hover:from-red-600 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              🍔 Order Now
            </Link>
            <Link
              href="/partner/signup"
              className="inline-flex items-center px-8 py-4 bg-white text-red-500 border-2 border-red-500 font-bold rounded-full hover:bg-red-50 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              🤝 Partner with Us
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}