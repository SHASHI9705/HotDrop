"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function HelpSupportPage() {
  const [activeTab, setActiveTab] = useState("faq");
  const [searchQuery, setSearchQuery] = useState("");

  const faqs = [
    {
      id: 1,
      question: "How do I place an order?",
      answer: "Simply browse our menu, add items to your cart, and proceed to checkout. You can pay securely online and track your order in real-time.",
      category: "ordering"
    },
    {
      id: 2,
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, Phone Pay & Google Pay.",
      category: "payment"
    },
    {
      id: 3,
      question: "How long does delivery take?",
      answer: "Delivery typically takes 10-40 minutes depending on your location and the restaurant's preparation time. ",
      category: "delivery"
    },
    {
      id: 4,
      question: "Can I modify my order after placing it?",
      answer: "No, the orders can't be cancelled or modified once they are placed.",
      category: "ordering"
    },
    {
      id: 5,
      question: "What if my order is wrong or missing items?",
      answer: "Contact us immediately through the app or call our support line. We'll work with the restaurant to resolve the issue and may offer a refund or credit.",
      category: "support"
    },
    {
      id: 6,
      question: "How do I cancel my order?",
      answer: "Your order can't be cancelled once they are placed.",
      category: "ordering"
    },
    {
      id: 7,
      question: "Do you deliver to my area?",
      answer: "No, there are no delivery options . You can take your order from the shop only.",
      category: "delivery"
    },
    {
      id: 8,
      question: "How do I track my order?",
      answer: "Once your order is confirmed, you can track it under 'My Orders' in profile section.",
      category: "ordering"
    }
  ];

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-blue-50">
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
          <span className="text-xl font-bold text-gray-800">HotDrop</span>
        </Link>
        <Link 
          href="/" 
          className="text-red-500 hover:text-red-600 font-medium transition-colors"
        >
          ← Back to Home
        </Link>
      </nav>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-xl p-8 md:p-12"
        >
          <motion.h1 
            className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            🆘 Help & Support
          </motion.h1>
          
          <motion.p 
            className="text-center text-gray-600 text-lg mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            We're here to help! Find answers to common questions or get in touch with our support team.
          </motion.p>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-1  mb-12"
          >
            <div className="bg-gradient-to-r from-green-500 to-teal-500 p-6 rounded-xl text-white text-center">
              <div className="text-3xl mb-3">📧</div>
              <h3 className="font-bold text-lg mb-2">Email Us</h3>
              <p className="text-sm mb-3">We'll respond within 24h</p>
              <p className="font-semibold">hotdrop.tech@gmail.com</p>
            </div>
          </motion.div>

          {/* Tab Navigation */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {[
              { id: 'faq', label: 'FAQ', icon: '❓' },
              { id: 'contact', label: 'Contact', icon: '📞' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-full font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* FAQ Section */}
          {activeTab === 'faq' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-6">
                <input
                  type="text"
                  placeholder="Search frequently asked questions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300"
                />
              </div>
              
              <div className="space-y-4">
                {filteredFaqs.map((faq) => (
                  <motion.div
                    key={faq.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: faq.id * 0.1 }}
                    className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors"
                  >
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-start">
                      <span className="text-red-500 mr-2">Q:</span>
                      {faq.question}
                    </h3>
                    <p className="text-gray-600 pl-6">
                      <span className="text-green-500 font-bold mr-2">A:</span>
                      {faq.answer}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Contact Section */}
          {activeTab === 'contact' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid md:grid-cols-2 gap-8"
            >
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Get in Touch</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <span className="text-blue-600 text-xl">📧</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">Email</p>
                      <p className="text-gray-600">hotdrop.tech@gmail.com</p>
                    </div>
                  </div>
                  
                  
                  <div className="flex items-center space-x-3">
                    <div className="bg-purple-100 p-3 rounded-full">
                      <span className="text-purple-600 text-xl">📍</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">Address</p>
                      <p className="text-gray-600">LPU</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Send us a Message</h3>
                <form className="space-y-4" action="https://formsubmit.co/hotdrop.tech@gmail.com" method="POST">
                  <div>
                    <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Name</label>
                    <input
                      type="text"
                      name="name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="number" className="block text-gray-700 font-medium mb-2">Phone Number</label>
                    <input
                      type="text"
                      name="phone"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300"
                      placeholder="Your phone number"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300"
                      placeholder="Your email"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Subject</label>
                    <select name="subject" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300">
                      <option>Order Issue</option>
                      <option>Payment Problem</option>
                      <option>Delivery Issue</option>
                      <option>Account Help</option>
                      <option>Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Message</label>
                    <textarea
                      rows={4}
                      name="message"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300"
                      placeholder="Describe your issue or question..."
                    ></textarea>
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white py-3 rounded-lg font-medium hover:from-red-600 hover:to-orange-600 transition-all"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="text-center mt-12"
          >
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white font-medium rounded-full hover:from-red-600 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}