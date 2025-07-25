import React, { useState, useEffect } from "react";

export default function Footer() {
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState("");
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showTeam, setShowTeam] = useState(false);
  const [showCorporate, setShowCorporate] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  // PWA install prompt logic
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowInstall(false);
      }
    }
  };

  return (
    <>
      <footer className="hidden md:block mt-8 w-full bg-orange-50 border-t border-orange-200 mt-16 py-12 px-4 md:px-16">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-8">
          {/* Brand and tagline */}
          <div className="flex-1 mb-8 md:mb-0">
            {showInstall && (
              <div className="flex items-center gap-2 mb-4">
                <span className="text-orange-700 font-medium text-base">Get the app <span aria-label="arrow" role="img">→</span></span>
                <button
                  onClick={handleInstallClick}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded shadow transition flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v12m0 0l-4-4m4 4l4-4m-10 7h12" />
                  </svg>
                  Download Now
                </button>
              </div>
            )}
            <div className="text-2xl font-extrabold text-orange-600 mb-2">
              HotDrop
            </div>
            <div className="text-gray-600 mb-4">
              Order ahead. Skip the line. Grab on time!
            </div>
            <div className="text-gray-400 text-xs">
              &copy; {new Date().getFullYear()} HotDrop. All rights reserved.
            </div>
          </div>
          {/* Footer columns */}
          <div className="flex-[2] grid grid-cols-2  sm:grid-cols-3 gap-4">
            {/* Legal */}
            <div>
              <div className="font-semibold text-orange-600 mb-3">Legal</div>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>
                  <a
                    href="/footeroptions/terms"
                    className="hover:text-black transition-colors duration-200"
                  >
                    Terms & Conditions
                  </a>
                </li>
                <li>
                  <a
                    href="/footeroptions/cookies"
                    className="hover:text-black transition focus:outline-none"
                  >
                    Cookies Policy
                  </a>
                </li>
                <li>
                  <a
                    href="/footeroptions/privacy"
                    className="hover:text-black transition focus:outline-none"
                  >
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
            {/* Contact Us */}
            <div>
              <div className="font-semibold text-orange-600 mb-3">Contact Us</div>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>
                  <a
                    href="/footeroptions/help"
                    className="hover:text-black transition focus:outline-none"
                  >
                    Help & Support
                  </a>
                </li>
                <li>
                  <a
                    href="/partner/signup"
                    className="hover:text-black transition"
                  >
                    Partner with us
                  </a>
                </li>
                <li>
                  <button
                    className="hover:text-black transition focus:outline-none"
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
              <div className="font-semibold text-orange-600 mb-3">Company</div>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>
                  <a
                    href="/footeroptions/aboutus"
                    className="hover:text-black transition focus:outline-none"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="/footeroptions/teams"
                    className="hover:text-black transition focus:outline-none"
                  >
                    Team
                  </a>
                </li>
                <li>
                  <button
                    className="hover:text-black transition focus:outline-none"
                    onClick={() => setShowCorporate(true)}
                  >
                    HotDrop Corporate
                  </button>
                </li>
                <li>
                  <a
                    href="/partner/signup"
                    className="hover:text-black transition"
                  >
                    Careers
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
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
              <div className="text-green-600 font-semibold text-center">
                Feedback sent successfully!
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setFeedbackSent(true);
                }}
              >
                <textarea
                  className="w-full border border-orange-300 rounded p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-orange-200"
                  rows={4}
                  placeholder="Write your feedback here..."
                  value={feedbackMsg}
                  onChange={(e) => setFeedbackMsg(e.target.value)}
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
            <h2 className="text-2xl font-bold mb-4 text-orange-600">
              HotDrop Corporate
            </h2>
            <p className="mb-3 text-gray-700">
              HotDrop continues to revolutionize the way people order and pick up
              food. With our latest update, we've enhanced the user experience,
              improved real-time notifications, and expanded our network of partner
              restaurants. Our commitment to seamless, fast, and reliable food
              pickup remains stronger than ever.
            </p>
            <p className="mb-3 text-gray-700">
              This web application now features advanced order tracking, secure
              payment integration, and a robust partner dashboard, empowering both
              customers and restaurant partners. We are dedicated to supporting
              local businesses and providing customers with more choices and
              convenience.
            </p>
            <p className="mb-3 text-gray-700">
              Stay tuned for more updates as we continue to innovate and set new
              standards in the food tech industry. Thank you for being a part of
              the HotDrop journey!
            </p>
          </div>
        </div>
      )}
      
    </>
  );
}