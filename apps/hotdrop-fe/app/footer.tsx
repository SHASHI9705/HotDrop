import React, { useState } from "react";

// This file has been migrated to components/Footer.tsx
export { };

export default function Footer() {
  const [showHelp, setShowHelp] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState("");
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showTeam, setShowTeam] = useState(false);
  const [showCorporate, setShowCorporate] = useState(false);
  const [showSocial, setShowSocial] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  return (
    <>
      <footer className="w-full bg-orange-50 border-t border-orange-200 mt-16 py-12 px-4 md:px-16">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-8">
          {/* Brand and tagline */}
          <div className="flex-1 mb-8 md:mb-0">
            <div className="text-2xl font-extrabold text-orange-600 mb-2">HotDrop</div>
            <div className="text-gray-600 mb-4">Order ahead. Skip the line. Grab on time!</div>
            <div className="text-gray-400 text-xs">&copy; {new Date().getFullYear()} HotDrop. All rights reserved.</div>
          </div>
          {/* Footer columns */}
          <div className="flex-[2] grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Legal */}
            <div>
              <div className="font-semibold text-orange-500 mb-3">Legal</div>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>
                  <a
                    href="/footeroptions/terms"
                    className="hover:text-orange-600 transition focus:outline-none"
                  >
                    Terms & Conditions
                  </a>
                </li>
                <li>
                  <a
                    href="/footeroptions/cookies"
                    className="hover:text-orange-600 transition focus:outline-none"
                  >
                    Cookies Policy
                  </a>
                </li>
                <li>
                  <a
                    href="/footeroptions/privacy"
                    className="hover:text-orange-600 transition focus:outline-none"
                  >
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
            {/* Contact Us */}
            <div>
              <div className="font-semibold text-orange-500 mb-3">Contact Us</div>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>
                  <a
                    href="/footeroptions/help"
                    className="hover:text-orange-600 transition focus:outline-none"
                  >
                    Help & Support
                  </a>
                </li>
                <li>
                  <a
                    href="/partner/signup"
                    className="hover:text-orange-600 transition"
                  >
                    Partner with us
                  </a>
                </li>
                <li>
                  <button
                    className="hover:text-orange-600 transition focus:outline-none"
                    onClick={() => {
                      setShowFeedback(true);
                      setFeedbackSent(false);
                      setFeedbackMsg("");
                    }}
                  >
                    Feedback
                  </button>
                </li>
              </ul>
            </div>
            {/* Company */}
            <div>
              <div className="font-semibold text-orange-500 mb-3">Company</div>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>
                  <a
                    href="/footeroptions/aboutus"
                    className="hover:text-orange-600 transition focus:outline-none"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="/footeroptions/teams"
                    className="hover:text-orange-600 transition focus:outline-none"
                  >
                    Team
                  </a>
                </li>
                <li>
                  <button
                    className="hover:text-orange-600 transition focus:outline-none"
                    onClick={() => setShowCorporate(true)}
                  >
                    HotDrop Corporate
                  </button>
                </li>
                <li><a href="/partner/signup" className="hover:text-orange-600 transition">Careers</a></li>
              </ul>
            </div>
            {/* Social Media */}
            <div>
              <div className="font-semibold text-orange-500 mb-3">Social Media</div>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li><a href="#" onClick={e => {e.preventDefault(); setShowSocial(true);}} className="hover:text-orange-600 transition">Twitter</a></li>
                <li><a href="#" onClick={e => {e.preventDefault(); setShowSocial(true);}} className="hover:text-orange-600 transition">Instagram</a></li>
                <li><a href="#" onClick={e => {e.preventDefault(); setShowSocial(true);}} className="hover:text-orange-600 transition">Facebook</a></li>
                <li><a href="#" onClick={e => {e.preventDefault(); setShowSocial(true);}} className="hover:text-orange-600 transition">LinkedIn</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
      {/* Help & Support Modal */}
      {showHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full relative animate-fadeIn">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-orange-500 text-2xl font-bold focus:outline-none"
              onClick={() => setShowHelp(false)}
              aria-label="Close Help & Support"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4 text-orange-600">Help & Support</h2>
            <p className="mb-2 text-gray-700">Need assistance? We're here to help!</p>
            <ul className="list-disc pl-5 text-gray-600 mb-4">
              <li>Email: <a href="mailto:srsrez@gmail.com" className="text-orange-500 underline">srsrez@gmail.com</a></li>
              <li>Phone: +91 8787657600</li>
              <li>Live chat: Coming soon!</li>
            </ul>
          </div>
        </div>
      )}
      {/* Feedback Modal */}
      {showFeedback && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full relative animate-fadeIn">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-orange-500 text-2xl font-bold focus:outline-none"
              onClick={() => setShowFeedback(false)}
              aria-label="Close Feedback"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4 text-orange-600">Feedback</h2>
            {feedbackSent ? (
              <div className="text-green-600 font-semibold text-center">Feedback sent successfully!</div>
            ) : (
              <form
                onSubmit={e => {
                  e.preventDefault();
                  setFeedbackSent(true);
                }}
              >
                <textarea
                  className="w-full border border-orange-300 rounded p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-orange-200"
                  rows={4}
                  placeholder="Write your feedback here..."
                  value={feedbackMsg}
                  onChange={e => setFeedbackMsg(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded w-full transition"
                >
                  Send
                </button>
              </form>
            )}
          </div>
        </div>
      )}
      {/* HotDrop Corporate Modal */}
      {showCorporate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full relative animate-fadeIn">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-orange-500 text-2xl font-bold focus:outline-none"
              onClick={() => setShowCorporate(false)}
              aria-label="Close HotDrop Corporate"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4 text-orange-600">HotDrop Corporate</h2>
            <p className="mb-3 text-gray-700">HotDrop continues to revolutionize the way people order and pick up food. With our latest update, we've enhanced the user experience, improved real-time notifications, and expanded our network of partner restaurants. Our commitment to seamless, fast, and reliable food pickup remains stronger than ever.</p>
            <p className="mb-3 text-gray-700">This web application now features advanced order tracking, secure payment integration, and a robust partner dashboard, empowering both customers and restaurant partners. We are dedicated to supporting local businesses and providing customers with more choices and convenience.</p>
            <p className="mb-3 text-gray-700">Stay tuned for more updates as we continue to innovate and set new standards in the food tech industry. Thank you for being a part of the HotDrop journey!</p>
          </div>
        </div>
      )}
      {/* Social Media Coming Soon Modal */}
      {showSocial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full relative animate-fadeIn">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-orange-500 text-2xl font-bold focus:outline-none"
              onClick={() => setShowSocial(false)}
              aria-label="Close Social Media"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4 text-orange-600">Coming Soon</h2>
            <p className="mb-3 text-gray-700">Our official social media pages are launching soon! Stay tuned for updates, news, and more ways to connect with HotDrop.</p>
            <p className="text-gray-600">Thank you for your interest and support!</p>
          </div>
        </div>
      )}
    </>
  );
}
