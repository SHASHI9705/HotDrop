"use client";
import { RefObject } from "react";
import { motion } from "framer-motion";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

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

export default function Nav({ user, cartCount, profileRef, dropdownRef, showDropdown, setShowDropdown, setShowEditProfile, setEditName, setEditEmail, router }: NavProps) {
  return (
    <nav className="w-full max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center py-6">
      <div className="flex flex-col md:flex-row items-center gap-2 p-4 w-full md:w-auto">
        <div className="flex items-center gap-4">
          <motion.img
            src="/logo.png"
            alt="Logo"
            className="w-14 h-14 rounded"
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 120, damping: 18, duration: 1.2 }}
          />
          <motion.div
            className="text-4xl font-extrabold text-gray-800"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 180, delay: 0.2, duration: 0.7 }}
          >
            HotDrop
          </motion.div>
        </div>
        {/* Show Partner/Log in below HotDrop on mobile */}
        <div className="flex md:hidden w-full justify-center mt-2">
          {/* Removed 'Partner with us' option for mobile */}
          {user ? null : (
            <a href="/signin" className="relative font-semibold transition-all duration-300 hover:text-black hover:after:scale-x-100 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-black after:scale-x-0 after:origin-left after:transition-transform after:duration-300">Log in</a>
          )}
        </div>
      </div>
      {/* Desktop nav links */}
      <div className="space-x-4 text-lg text-gray-700 hidden md:flex">
        <a href="#" className="relative font-semibold transition-all duration-300 hover:text-black hover:after:scale-x-100 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-black after:scale-x-0 after:origin-left after:transition-transform after:duration-300">How it works</a>
        {user ? (
          <a href="/partner/signup" className="relative font-semibold transition-all duration-300 hover:text-black hover:after:scale-x-100 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-black after:scale-x-0 after:origin-left after:transition-transform after:duration-300">Partner with us</a>
        ) : (
          <a href="/signin" className="relative font-semibold transition-all duration-300 hover:text-black hover:after:scale-x-100 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-black after:scale-x-0 after:origin-left after:transition-transform after:duration-300">Log in</a>
        )}
      </div>
      {user ? (
        <div className="relative flex items-center gap-3">
          <button
            className="w-10 h-10 rounded-full bg-white border border-orange-200 text-orange-500 flex items-center justify-center text-2xl shadow hover:bg-orange-50 transition-colors duration-200 relative"
            title="View Cart"
            onClick={() => router.push('/cart')}
          >
            <span role="img" aria-label="cart">🛒</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5 min-w-[20px] text-center border border-white">{cartCount}</span>
            )}
          </button>
          <button
            ref={profileRef}
            className="w-10 h-10 rounded-full bg-orange-500 text-white font-bold text-xl flex items-center justify-center cursor-pointer focus:outline-none"
            onClick={() => setShowDropdown((prev: boolean) => !prev)}
            title={user.name}
          >
            {user.name?.charAt(0).toUpperCase()}
          </button>
          {showDropdown && (
            <div ref={dropdownRef} className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-50">
              <button
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  setShowEditProfile(true);
                  setShowDropdown(false);
                  setEditName(user.name || "");
                  setEditEmail(user.email || "");
                }}
              >
                Edit Profile
              </button>
              <button
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  router.push("/myorders");
                  setShowDropdown(false);
                }}
              >
                Orders
              </button>
              <button
                className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                onClick={async () => {
                  if (!user?.email) return;
                  if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) return;
                  try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/user/delete`, {
                      method: "DELETE",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ email: user.email }),
                    });
                    if (!res.ok) throw new Error("Failed to delete account");
                    localStorage.removeItem("hotdrop_user");
                    window.location.href = "/signup";
                  } catch (err) {
                    alert("Error deleting account. Please try again.");
                  }
                  setShowDropdown(false);
                }}
              >
                Delete Account
              </button>
              <button
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 border-t"
                onClick={() => {
                  localStorage.removeItem("hotdrop_user");
                  setShowDropdown(false);
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      ) : (
        <button className="bg-black text-white px-4 py-2 rounded-full text-sm hover:bg-black/80" onClick={() => window.location.href = '/signup'}>Get Started</button>
      )}
    </nav>
  );
}
