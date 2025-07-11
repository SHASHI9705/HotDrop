"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Nav from "../components/Nav";
import FoodSection, { foodSectionId } from "../components/FoodSection";
import ReviewsSection from "../components/ReviewsSection";
import Footer from "../components/Footer";
import PopularRestaurantsSection from "../components/PopularRestaurantsSection";

function CircularLoader({ percent }: { percent: number }) {
  const radius = 40;
  const stroke = 6;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percent / 100) * circumference;
  return (
    <div className="flex flex-col items-center justify-center">
      <svg height={radius * 2} width={radius * 2} className="rotate-[-90deg]">
        <circle
          stroke="#e5e7eb"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <motion.circle
          stroke="#fb923c"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.3 }}
        />
      </svg>
      <div className="text-xl font-bold text-orange-500 mt-2">{percent}%</div>
    </div>
  );
}

export default function Home() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");
  const [editSuccess, setEditSuccess] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [loadingPercent, setLoadingPercent] = useState(0);
  const [showLoader, setShowLoader] = useState(true);
  const router = useRouter();

  const profileRef = useRef<HTMLButtonElement>(null!);
  const dropdownRef = useRef<HTMLDivElement>(null!);

  useEffect(() => {
    // Redirect to /partner if logged in as partner
    if (typeof window !== "undefined") {
      const partner = localStorage.getItem("hotdrop_partner");
      if (partner) {
        router.replace("/partner");
        return;
      }
    }
    const stored = localStorage.getItem("hotdrop_user");
    if (stored) setUser(JSON.parse(stored));
  }, [router]);

  useEffect(() => {
    // Cart count
    const updateCartCount = () => {
      const stored = localStorage.getItem("hotdrop_cart");
      if (stored) {
        try {
          const arr = JSON.parse(stored);
          setCartCount(arr.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0));
        } catch {
          setCartCount(0);
        }
      } else {
        setCartCount(0);
      }
    };
    updateCartCount();
    window.addEventListener('storage', updateCartCount);
    return () => window.removeEventListener('storage', updateCartCount);
  }, []);

  useEffect(() => {
    // Close dropdown if clicked outside
    if (showDropdown) {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          profileRef.current &&
          !profileRef.current.contains(event.target as Node) &&
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node)
        ) {
          setShowDropdown(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showDropdown]);

  useEffect(() => {
    if (!showLoader) return;
    let percent = 0;
    const interval = setInterval(() => {
      percent += Math.floor(Math.random() * 7) + 2; // random speed
      if (percent >= 100) {
        percent = 100;
        setLoadingPercent(percent);
        setTimeout(() => setShowLoader(false), 400);
        clearInterval(interval);
      } else {
        setLoadingPercent(percent);
      }
    }, 30);
    return () => clearInterval(interval);
  }, [showLoader]);

  if (showLoader) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
        <CircularLoader percent={loadingPercent} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-white via-red-200 to-blue-50 flex flex-col items-center justify-start">
      {/* Navbar */}
      <Nav
        user={user}
        cartCount={cartCount}
        profileRef={profileRef}
        dropdownRef={dropdownRef}
        showDropdown={showDropdown}
        setShowDropdown={setShowDropdown}
        setShowEditProfile={setShowEditProfile}
        setEditName={setEditName}
        setEditEmail={setEditEmail}
        router={router}
      />

      {/* Hero Content */}
      <div className="flex flex-col-reverse md:flex-row items-center justify-between max-w-6xl w-full mt-28">
        {/* Left Content */}
        <div className="md:w-1/2 text-center md:text-left">
          <h1 className="text-4xl xs:text-6xl sm:text-7xl md:text-6xl font-extrabold text-gray-900 leading-tight">
            Skip The <span className="text-orange-500">Line</span><br />
            Grab On <span className="text-orange-500">Time!</span>
          </h1>
          <p className="text-gray-600 mt-4 text-lg">
            Order Ahead, Walk in Walk out!
          </p>
          <div className="flex flex-col sm:flex-row items-center mt-6 gap-3">
            {user ? (
              <>
                <button onClick={() => {
                  const section = document.getElementById(foodSectionId);
                  if (section) section.scrollIntoView({ behavior: "smooth" });
                }} className="bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600 transition-colors duration-300 text-lg font-semibold flex items-center gap-2">
                  <motion.span
                    role="img"
                    aria-label="rocket"
                    className="text-xl"
                    animate={{ filter: [
                      "drop-shadow(0 0 0px #fbbf24)",
                      "drop-shadow(0 0 8px #fbbf24)",
                      "drop-shadow(0 0 0px #fbbf24)"
                    ] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                  >🚀</motion.span>
                  Quick Order
                </button>
                <button className="bg-white text-orange-500 border border-orange-300 px-6 py-2 rounded-full hover:bg-orange-100 transition-colors duration-300 text-lg font-semibold flex items-center gap-2 ml-0 sm:ml-2 mt-3 sm:mt-0 shadow-sm relative" onClick={() => router.push('/cart')}>
                  <span role="img" aria-label="cart" className="text-xl">🛒</span>
                  View Cart
                  {cartCount > 0 && (
                    <motion.span
                      className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5 min-w-[20px] text-center border border-white"
                      animate={{
                        boxShadow: [
                          "0 0 0px 0px #fbbf24",
                          "0 0 12px 4px #fbbf24",
                          "0 0 0px 0px #fbbf24"
                        ]
                      }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                    >{cartCount}</motion.span>
                  )}
                </button>
              </>
            ) : (
              <button className="bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600 transition-colors duration-300 text-lg font-semibold" onClick={() => window.location.href = '/signup'}>
                Get Started
              </button>
            )}
          </div>
        </div>

        {/* Right Image */}
        <div className="md:w-1/2 flex justify-center mb-10 md:mb-0 relative">
          {/* Animated food images in two circles behind the girl */}
          {/* Outer, larger circle with only food images, repeated as needed */}
          <motion.div
            className="hidden md:flex absolute inset-0 items-center justify-center z-0"
            style={{ pointerEvents: "none" }}
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 32, ease: "linear" }}
          >
            {[
              "/burger.png",
              "/pizza.png",
              "/cake.png",
              "/icecream.png",
              "/momo.png",
              "/rolls.png",
              "/cake.png",
              "/icecream.png",
              
              
            ].map((src, i, arr) => {
              const angle = (360 / arr.length) * i;
              return (
                <img
                  key={src + i}
                  src={src}
                  alt="food"
                  className="w-14 h-14 md:w-20 md:h-20 rounded-full absolute"
                  style={{
                    left: `calc(50% - 2.5rem)`,
                    top: `calc(50% - 2.5rem)`,
                    transform: `rotate(${angle}deg) translateY(-240px) rotate(-${angle}deg)`
                  }}
                />
              );
            })}
          </motion.div>
          {/* Inner, smaller circle */}
          <motion.div
            className="hidden md:flex absolute inset-0 items-center justify-center z-0"
            style={{ pointerEvents: "none" }}
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 16, ease: "linear" }}
          >
            {[
              "/burger.png",
              "/pizza.png",
              "/cake.png",
              "/icecream.png",
              "/momo.png",
              
            ].map((src, i, arr) => {
              const angle = (360 / arr.length) * i;
              return (
                <img
                  key={src}
                  src={src}
                  alt="food"
                  className="w-12 h-12 md:w-16 md:h-16 rounded-full absolute"
                  style={{
                    left: `calc(50% - 2.5rem)`,
                    top: `calc(50% - 2.5rem)`,
                    transform: `rotate(${angle}deg) translateY(-120px) rotate(-${angle}deg)`
                  }}
                />
              );
            })}
          </motion.div>
          <img
            src="/girl2.png"
            alt="Ordering girl illustration"
            className="w-64 md:w-80 z-10 relative"
          />
        </div>
      </div>
      <main className="w-full max-w-6xl mx-auto flex flex-col items-center">
        <FoodSection />
        <PopularRestaurantsSection />
        <ReviewsSection />
      </main>
      <Footer />
      {showEditProfile && (
        <EditProfileModal
          name={editName}
          email={editEmail}
          setName={setEditName}
          setEmail={setEditEmail}
          onClose={() => {
            setShowEditProfile(false);
            setEditSuccess("");
            setEditError("");
          }}
          onSave={async () => {
            setEditLoading(true);
            setEditError("");
            setEditSuccess("");
            try {
              const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/user/update`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: editName, email: editEmail, oldEmail: user?.email }),
              });
              let data;
              const contentType = res.headers.get("content-type");
              if (contentType && contentType.includes("application/json")) {
                data = await res.json();
              } else {
                const text = await res.text();
                throw new Error("Server error: " + text.slice(0, 100));
              }
              if (!res.ok) throw new Error(data.error || "Update failed");
              setUser({ name: data.user.name, email: data.user.email });
              localStorage.setItem("hotdrop_user", JSON.stringify({ name: data.user.name, email: data.user.email }));
              setEditSuccess("Profile updated successfully!");
              setTimeout(() => {
                setShowEditProfile(false);
                setEditSuccess("");
              }, 1200);
            } catch (err: any) {
              setEditError(err.message);
            } finally {
              setEditLoading(false);
            }
          }}
          loading={editLoading}
          error={editError}
          success={editSuccess}
        />
      )}
    </div>
  );
}

function EditProfileModal({ name, email, setName, setEmail, onClose, onSave, loading, error, success }: {
  name: string;
  email: string;
  setName: (v: string) => void;
  setEmail: (v: string) => void;
  onClose: () => void;
  onSave: () => void;
  loading: boolean;
  error: string;
  success?: string;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white p-8 rounded shadow-lg w-full max-w-md flex flex-col items-center relative">
        <button className="absolute top-2 right-2 text-gray-500 hover:text-black text-2xl" onClick={onClose}>&times;</button>
        <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>
        <div className="w-full flex flex-col gap-4">
          <label className="text-sm font-semibold text-gray-700">Name</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="border p-2 rounded w-full"
          />
          <label className="text-sm font-semibold text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="border p-2 rounded w-full"
          />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          {success && <div className="text-green-600 text-sm">{success}</div>}
          <button
            className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm hover:bg-orange-600 font-semibold mt-4"
            onClick={onSave}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
