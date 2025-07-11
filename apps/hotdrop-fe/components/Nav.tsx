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
  return (
    <div className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-white via-red-200 to-blue-50 backdrop-blur-md pt-4 mb-4">
      <nav className="w-full max-w-6xl mx-auto flex flex-row justify-between items-center py-4 pl-2">
        {/* Left: Logo and Heading */}
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
            className="text-4xl font-extrabold text-gray-800"
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
        </div>

        {/* Center: Desktop Nav Options (hidden on phone) */}
        <div className="hidden md:flex gap-6 items-center text-lg font-semibold">
          <a href="/how-it-works" className="nav-underline">How it works</a>
          <a href="/footeroptions/help" className="nav-underline">Help</a>
          {user && (
            <a href="/myorders" className="nav-underline">My Orders</a>
          )}
          {/* Show 'Partner with us' only if logged in, 'Login' only if not logged in */}
          {user ? (
            <a href="/partner/signup" className="nav-underline">Partner with us</a>
          ) : (
            <a href="/signin" className="nav-underline">Login</a>
          )}
          <style jsx global>{`
          .nav-underline {
            position: relative;
            color: #000000ff; /* text-gray-700 */
            text-decoration: none;
            transition: color 0.2s;
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

        {/* Right: Cart/Profile (always right, but only visible on mobile as flex-row) */}
        <div className="flex items-center gap-3 relative mr-2">
          {user ? (
            <>
              <button
                className="w-10 h-10 rounded-full bg-white border border-orange-200 text-orange-500 flex items-center justify-center text-2xl shadow hover:bg-orange-50 transition-colors duration-200 relative"
                title="View Cart"
                onClick={() => router.push("/cart")}
              >
                <span role="img" aria-label="cart">
                  🛒
                </span>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5 min-w-[20px] text-center border border-white">
                    {cartCount}
                  </span>
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
                <div
                  ref={dropdownRef}
                  className="mt-24 absolute top-[200%] right-0 md:left-1/2 md:-translate-x-1/2 md:right-auto w-fit min-w-[220px] max-w-xs bg-white border border-gray-200 rounded-xl shadow-2xl z-50 py-2 flex flex-col gap-1 animate-fadeIn overflow-hidden"
                  style={{ maxWidth: "90vw" }}
                >
                  <button
                    className="mt-24 block w-full text-left px-4 py-2 text-gray-700 hover:bg-orange-50 rounded-t-xl transition-colors"
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
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-orange-50 transition-colors"
                    onClick={() => {
                      router.push("/myorders");
                      setShowDropdown(false);
                    }}
                  >
                    Orders
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-orange-50 transition-colors"
                    onClick={async () => {
                      if (!user?.email) return;
                      if (
                        !window.confirm(
                          "Are you sure you want to delete your account? This action cannot be undone."
                        )
                      )
                        return;
                      try {
                        const res = await fetch(
                          `${process.env.NEXT_PUBLIC_BACKEND_API}/user/delete`,
                          {
                            method: "DELETE",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ email: user.email }),
                          }
                        );
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
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-orange-50 border-t transition-colors rounded-b-xl"
                    onClick={() => {
                      localStorage.removeItem("hotdrop_user");
                      window.location.href = "/";
                      setShowDropdown(false);
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </>
          ) : (
            <button
              className="bg-black text-white px-4 py-2 rounded-full text-sm hover:bg-black/80"
              onClick={() => (window.location.href = "/signup")}
            >
              Get Started
            </button>
          )}
        </div>
      </nav>
    </div>
  );
}