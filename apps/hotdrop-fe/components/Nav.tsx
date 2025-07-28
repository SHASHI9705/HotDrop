"use client";
import { RefObject, useState } from "react";
import { motion } from "framer-motion";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { div } from "framer-motion/client";

interface NavProps {
  user: { name: string; email: string } | null;
  cartCount: number;
  profileRef: RefObject<HTMLButtonElement>;
  dropdownRef: RefObject<HTMLDivElement>;
  showDropdown: boolean;
  setShowDropdown: React.Dispatch<React.SetStateAction<boolean>>;
  setShowEditProfile: React.Dispatch<React.SetStateAction<boolean>>;
  setEditName: (v: string) => void;
  setEditEmail: (v: string) => void;
  router: AppRouterInstance;
}

export default function Nav({
  user,
  cartCount,
  profileRef,
  dropdownRef,
  showDropdown,
  setShowDropdown,
  setShowEditProfile,
  setEditName,
  setEditEmail,
  router,
}: NavProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const handleSidebarClose = () => setSidebarOpen(false);
  const handleSidebarOpen = () => setSidebarOpen(true);
  const handleLogout = () => {
    localStorage.removeItem("hotdrop_user");
    window.location.href = "/";
  };
  return (
    <>
      {/* Sidebar Drawer rendered at top level for correct stacking and no nav padding */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-[999999]">
          {/* Overlay */}
          <div className="fixed inset-0 z-[999999] bg-black bg-opacity-40" onClick={handleSidebarClose}></div>
          {/* Sidebar */}
          <div className="fixed top-0 right-0 h-screen w-[90vw] max-w-xs z-[999999] bg-gradient-to-br from-white via-red-200 to-blue-50 shadow-2xl flex flex-col p-6 animate-slideInRight">
            <button className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-black" onClick={handleSidebarClose} aria-label="Close menu">&times;</button>
            <div className="flex flex-col gap-6 mt-10">
              <div className="relative flex justify-center mb-2">
                <button
                  className="w-20 h-20 rounded-full bg-orange-500 text-white font-bold text-4xl flex items-center justify-center shadow-lg border-4 border-white relative"
                  onClick={() => { router.push('/profile'); handleSidebarClose(); }}
                  title={user?.name}
                >
                  {user?.name?.charAt(0).toUpperCase()}
                  {/* Star SVG at bottom right with thin white circle background */}
                  <span className="absolute -bottom-2 -right-2">
                    <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-white">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="#fbbf24" stroke="#f59e42" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 15 8.5 22 9.3 17 14.1 18.2 21 12 17.8 5.8 21 7 14.1 2 9.3 9 8.5 12 2" />
                      </svg>
                    </span>
                  </span>
                </button>
              </div>
              <button className="text-lg font-semibold text-gray-800 text-left bg-white/80 rounded-xl px-5 py-3 shadow hover:bg-orange-50 transition flex items-center gap-3" onClick={() => { router.push('/profile'); handleSidebarClose(); }}>
                <span className="flex-shrink-0">
                  <svg width="24" height="24" fill="none" stroke="#f59e42" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-7 8-7s8 3 8 7"/></svg>
                </span>
                My Profile
              </button>
              <button className="text-lg font-semibold text-gray-800 text-left bg-white/80 rounded-xl px-5 py-3 shadow hover:bg-orange-50 transition flex items-center gap-3" onClick={() => { router.push('/myorders'); handleSidebarClose(); }}>
                <span className="flex-shrink-0">
                  <svg width="24" height="24" fill="none" stroke="#f59e42" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M16 3v4M8 3v4M3 11h18"/></svg>
                </span>
                My Orders
              </button>
              <button className="text-lg font-semibold text-gray-800 text-left bg-white/80 rounded-xl px-5 py-3 shadow hover:bg-orange-50 transition flex items-center gap-3" onClick={() => { router.push('/settings'); handleSidebarClose(); }}>
                <span className="flex-shrink-0">
                  <svg width="24" height="24" fill="none" stroke="#f59e42" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 8 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 5 15.4a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 5 8.6a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 8 4.6c.26-.17.57-.26.89-.26.32 0 .63.09.89.26a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09c0 .32.09.63.26.89a1.65 1.65 0 0 0 1.51 1h.09a2 2 0 1 1 0 4h-.09c-.32 0-.63.09-.89.26a1.65 1.65 0 0 0-1 1.51V12z"/></svg>
                </span>
                Settings
              </button>
              <button className="text-lg font-semibold text-gray-800 text-left bg-white/80 rounded-xl px-5 py-3 shadow hover:bg-orange-50 transition flex items-center gap-3" onClick={() => { router.push('/partner/signup'); handleSidebarClose(); }}>
                <span className="flex-shrink-0">
                  <svg width="24" height="24" fill="none" stroke="#f59e42" strokeWidth="2" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 19v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                </span>
                Partner with us
              </button>
              <button className="text-lg font-semibold text-red-600 text-left bg-white/80 rounded-xl px-5 py-3 shadow hover:bg-red-100 transition flex items-center gap-3" onClick={() => { handleLogout(); handleSidebarClose(); }}>
                <span className="flex-shrink-0">
                  <svg width="24" height="24" fill="none" stroke="#ef4444" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 16l4-4m0 0l-4-4m4 4H7"/><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/></svg>
                </span>
                Logout
              </button>
            </div>
          </div>
          <style jsx>{`
            .animate-slideInRight {
              animation: slideInRight 0.3s cubic-bezier(0.4,0,0.2,1);
            }
            @keyframes slideInRight {
              from { transform: translateX(100%); }
              to { transform: translateX(0); }
            }
          `}</style>
        </div>
      )}
      <nav className="fixed pt-4 top-0 left-0 w-full z-50 bg-gradient-to-r from-white via-red-200 to-blue-50 backdrop-blur-md mb-4 overflow-x-hidden">
        <div className="max-w-screen-xl mx-auto flex flex-row items-center justify-center px-2 w-full">
          {/* Left: Logo, Heading, and Search */}
          <div className="flex items-center gap-2">
            <motion.img
              src="/logo.png"
              alt="Logo"
              className="w-10 h-10 md:w-12 md:h-12 rounded ml-2"
              initial={{ y: -60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 120,
                damping: 18,
                duration: 1.2,
              }}
            />
            <motion.div
              className="text-4xl font-extrabold text-gray-800 hidden sm:block"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 180,
                delay: 0.2,
                duration: 0.7,
              }}
            >
              HotDrop
            </motion.div>
            <div className="relative ml-2 flex-1 max-w-xs hidden sm:block">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-400 pointer-events-none">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Search for any food e.g. burger"
                className="pl-10 pr-4 py-2 rounded-full border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-400 text-base w-56 md:w-72"
                style={{ minWidth: '180px' }}
              />
            </div>
            {/* Mobile search box */}
            <div className="relative ml-2 flex-1 max-w-xs sm:hidden">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-400 pointer-events-none">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Search for any food item"
                className="pl-10 pr-4 py-2 rounded-full border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-400 text-base w-full"
                style={{ minWidth: '120px' }}
              />
            </div>
            {/* Hamburger menu for mobile: only show if logged in */}
            {user && (
              <button className="sm:hidden ml-2 p-2 rounded focus:outline-none" aria-label="Open menu" onClick={handleSidebarOpen}>
                <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-orange-500">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            )}
          </div>
          {/* Right: Nav Options and Profile (hidden on mobile) */}
          <div className="hidden sm:flex items-center gap-2 relative ml-6 text-lg font-semibold whitespace-nowrap">
            {user && (
              <a href="/myorders" className="nav-underline px-4 min-w-[130px]">My Orders</a>
            )}
            {user ? (
              <>
                <a href="/partner/signup" className="nav-underline px-4 min-w-[160px]">Partner with us</a>
                <a href="/settings" className="nav-underline px-4 min-w-[100px]">Settings</a>
                <a href="/footeroptions/help" className="nav-underline min-w-[110px]">Help</a>
              </>
            ) : (
              <>
                <a href="/signin" className="nav-underline min-w-[90px]">Login</a>
                <a href="/footeroptions/help" className="nav-underline min-w-[110px]">Help</a>
              </>
            )}
            {user ? (
              <button
                className="w-12 h-12 rounded-full bg-orange-500 text-white font-bold text-2xl flex items-center justify-center cursor-pointer focus:outline-none shadow-md border-4 border-white transition-transform hover:scale-105"
                onClick={() => router.push("/profile")}
                title={user.name}
                style={{ minWidth: '48px', minHeight: '48px' }}
              >
                {user.name?.charAt(0).toUpperCase()}
              </button>
            ) : (
              <button
                className="bg-black text-white px-4 py-2 rounded-full text-sm hover:bg-black/80"
                onClick={() => (window.location.href = "/signup")}
              >
                Get Started
              </button>
            )}
            <style jsx global>{`
              body { overflow-x: hidden; }
              .nav-underline {
                position: relative;
                color: #000000ff; /* text-gray-700 */
                text-decoration: none;
                transition: color 0.2s;
                display: inline-block;
                min-width: 0 !important;
              }
              .nav-underline::after {
                content: '';
                position: absolute;
                left: 0;
                bottom: -2px;
                width: 0%;
                height: 2.4px;
                background: #000000ff; /* orange-400 */
                transition: width 0.3s cubic-bezier(0.4,0,0.2,1);
              }
              .nav-underline:hover::after {
                width: 100%;
              }
            `}</style>
          </div>
        </div>
      </nav>
    </>
  );
}