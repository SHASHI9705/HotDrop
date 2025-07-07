import React, { useState } from "react";

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
  const [showCookies, setShowCookies] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

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
                  <button
                    className="hover:text-orange-600 transition focus:outline-none"
                    onClick={() => setShowTerms(true)}
                  >
                    Terms & Conditions
                  </button>
                </li>
                <li>
                  <button
                    className="hover:text-orange-600 transition focus:outline-none"
                    onClick={() => setShowCookies(true)}
                  >
                    Cookies Policy
                  </button>
                </li>
                <li>
                  <button
                    className="hover:text-orange-600 transition focus:outline-none"
                    onClick={() => setShowPrivacy(true)}
                  >
                    Privacy Policy
                  </button>
                </li>
              </ul>
            </div>
            {/* Contact Us */}
            <div>
              <div className="font-semibold text-orange-500 mb-3">Contact Us</div>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>
                  <button
                    className="hover:text-orange-600 transition focus:outline-none"
                    onClick={() => setShowHelp(true)}
                  >
                    Help & suppport
                  </button>
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
                  <button
                    className="hover:text-orange-600 transition focus:outline-none"
                    onClick={() => setShowAbout(true)}
                  >
                    About Us
                  </button>
                </li>
                <li>
                  <button
                    className="hover:text-orange-600 transition focus:outline-none"
                    onClick={() => setShowTeam(true)}
                  >
                    Team
                  </button>
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
      {/* About Us Modal */}
      {showAbout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full relative animate-fadeIn">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-orange-500 text-2xl font-bold focus:outline-none"
              onClick={() => setShowAbout(false)}
              aria-label="Close About Us"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4 text-orange-600">About Us</h2>
            <p className="mb-3 text-gray-700">HotDrop was founded with a simple mission: to make food pickup fast, easy, and enjoyable for everyone. We believe that your time is valuable, and waiting in line for your favorite meal shouldn't be part of your day.</p>
            <p className="mb-3 text-gray-700">Our platform connects hungry customers with local restaurants, allowing you to order ahead, skip the wait, and grab your food on your schedule. Whether you're on a lunch break or picking up dinner for the family, HotDrop ensures your order is ready when you arrive.</p>
            <p className="mb-3 text-gray-700">We partner with a diverse range of eateries, from beloved local spots to popular chains, supporting small businesses and bringing more choices to our users. Our team is passionate about technology, food, and creating seamless experiences for both customers and partners.</p>
            <p className="mb-3 text-gray-700">Thank you for choosing HotDrop. We're committed to continuous improvement and welcome your feedback as we grow and serve you better every day.</p>
          </div>
        </div>
      )}
      {/* Team Modal */}
      {showTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full relative animate-fadeIn">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-orange-500 text-2xl font-bold focus:outline-none"
              onClick={() => setShowTeam(false)}
              aria-label="Close Team"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4 text-orange-600">Our Team</h2>
            <div className="mb-4">
              <div className="font-semibold text-lg text-gray-800">Shashiranjan Singh</div>
              <div className="text-gray-600 mb-2">Co-Founder, CEO & Owner</div>
              <div className="font-semibold text-lg text-gray-800">Nikhil Kumar Singh</div>
              <div className="text-gray-600">Co-Founder, CEO & Owner</div>
            </div>
            <p className="mb-3 text-gray-700">HotDrop was crafted with passion and dedication by Shashiranjan Singh and Nikhil Kumar Singh. As co-founders, CEOs, and owners, they combined their expertise in technology and product design to create a seamless food ordering experience for everyone.</p>
            <p className="mb-3 text-gray-700">Their teamwork, creativity, and commitment to excellence are reflected in every feature of this web application. They believe in empowering local businesses and making life easier for customers, one order at a time.</p>
            <p className="mb-3 text-gray-700">Thank you for supporting HotDrop and the vision of these two talented leaders!</p>
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
      {/* Terms & Conditions Modal */}
      {showTerms && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-4 max-w-md w-full relative animate-fadeIn overflow-y-auto" style={{ maxHeight: '80vh' }}>
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-orange-500 text-2xl font-bold focus:outline-none"
              onClick={() => setShowTerms(false)}
              aria-label="Close Terms & Conditions"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4 text-orange-600">Terms & Conditions</h2>
            <p className="mb-3 text-gray-700">Welcome to HotDrop! By accessing or using our website and services, you agree to be bound by these terms and conditions. Please read them carefully before using our platform.</p>
            <p className="mb-3 text-gray-700">1. You must provide accurate and complete information when creating an account or placing an order. You are responsible for maintaining the confidentiality of your account credentials.</p>
            <p className="mb-3 text-gray-700">2. Orders placed through HotDrop are subject to restaurant availability and preparation times. HotDrop is not responsible for delays, cancellations, or the quality of food provided by partner restaurants.</p>
            <p className="mb-3 text-gray-700">3. Payment for orders must be made through the methods provided on our platform. All transactions are subject to verification and approval.</p>
            <p className="mb-3 text-gray-700">4. You agree not to misuse the platform, engage in fraudulent activity, or violate any applicable laws while using HotDrop.</p>
            <p className="mb-3 text-gray-700">5. After an order is placed and confirmed, there is no refund policy. Please review your order carefully before confirming your purchase.</p>
            <p className="mb-3 text-gray-700">6. HotDrop reserves the right to update or modify these terms at any time. Continued use of the platform after changes constitutes acceptance of the new terms.</p>
            <p className="mb-3 text-gray-700">7. Users are responsible for picking up their orders at the specified time and location. Uncollected orders may not be eligible for a refund or replacement.</p>
            <p className="mb-3 text-gray-700">8. HotDrop may suspend or terminate your account if any suspicious, abusive, or fraudulent activity is detected.</p>
            <p className="mb-3 text-gray-700">9. All content, trademarks, and intellectual property on the HotDrop platform are owned by HotDrop and may not be used without permission.</p>
            <p className="mb-3 text-gray-700">10. The platform may contain links to third-party websites. HotDrop is not responsible for the content or practices of these external sites.</p>
            <p className="mb-3 text-gray-700">11. HotDrop is not liable for any indirect, incidental, or consequential damages arising from the use or inability to use the platform.</p>
            <p className="mb-3 text-gray-700">12. Users must be at least 18 years old or have parental consent to use the platform and place orders.</p>
            <p className="mb-3 text-gray-700">13. Any disputes arising from the use of HotDrop will be governed by the laws of the jurisdiction in which the company operates.</p>
            <p className="mb-3 text-gray-700">14. By using our services, you consent to receive communications from HotDrop regarding your orders, promotions, and updates.</p>
            <p className="mb-3 text-gray-700">15. If you have any questions or concerns about these terms, please contact us at <a href="mailto:srsrez@gmail.com" className="text-orange-500 underline">srsrez@gmail.com</a>.</p>
          </div>
        </div>
      )}
      {/* Cookies Policy Modal */}
      {showCookies && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full relative animate-fadeIn">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-orange-500 text-2xl font-bold focus:outline-none"
              onClick={() => setShowCookies(false)}
              aria-label="Close Cookies Policy"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4 text-orange-600">Cookies Policy</h2>
            <p className="mb-3 text-gray-700">HotDrop uses cookies to enhance your browsing experience, analyze site traffic, and personalize content. By using our platform, you consent to the use of cookies in accordance with this policy.</p>
            <p className="mb-3 text-gray-700">You can manage your cookie preferences in your browser settings. Disabling cookies may affect the functionality of certain features on our website.</p>
          </div>
        </div>
      )}
      {/* Privacy Policy Modal */}
      {showPrivacy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full relative animate-fadeIn">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-orange-500 text-2xl font-bold focus:outline-none"
              onClick={() => setShowPrivacy(false)}
              aria-label="Close Privacy Policy"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4 text-orange-600">Privacy Policy</h2>
            <p className="mb-3 text-gray-700">At HotDrop, we are committed to protecting your privacy. This privacy policy explains how we collect, use, and safeguard your information when you use our website and services.</p>
            <p className="mb-3 text-gray-700">We collect personal information that you provide to us directly, such as when you create an account, place an order, or contact us for support. We may also collect information about your device and usage of our services through cookies and similar technologies.</p>
            <p className="mb-3 text-gray-700">HotDrop uses your information to process your orders, communicate with you, improve our services, and personalize your experience. We do not sell or rent your personal information to third parties.</p>
            <p className="mb-3 text-gray-700">We take reasonable measures to protect the security of your information, but no method of transmission over the internet or method of electronic storage is 100% secure. Therefore, we cannot guarantee its absolute security.</p>
            <p className="mb-3 text-gray-700">By using our services, you consent to the collection and use of your information as described in this policy. If you have any questions or concerns, please contact us at <a href="mailto:srsrez@gmail.com" className="text-orange-500 underline">srsrez@gmail.com</a>.</p>
          </div>
        </div>
      )}
    </>
  );
}
