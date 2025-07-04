"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import FoodSection, { foodSectionId } from "./food";
import ReviewsSection from "./reviews";
import Footer from "./footer";

export default function Home() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");
  const [editSuccess, setEditSuccess] = useState("");
  const router = useRouter();

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

  return (
    <div className="min-h-screen bg-gradient-to-r from-white via-red-200 to-blue-50 flex flex-col items-center justify-start pt-2 p-6">
      {/* Navbar */}
      <nav className="w-full max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center py-6">
        <div className="flex flex-col md:flex-row items-center gap-2 p-4 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <img
              src="/logo.png" // Put the image in /public
              alt="Logo"
              className="w-10 h-10 rounded "
            />
            <div className="text-3xl font-extrabold text-gray-800">HotDrop</div>
          </div>
          {/* Show Partner/Log in below HotDrop on mobile */}
          <div className="flex md:hidden w-full justify-center mt-2">
            {user ? (
              <a href="/Partner/signup" className="relative font-semibold transition-all duration-300 hover:text-black hover:after:scale-x-100 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-black after:scale-x-0 after:origin-left after:transition-transform after:duration-300">Partner with us</a>
            ) : (
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
              className="w-10 h-10 rounded-full bg-white border border-orange-200 text-orange-500 flex items-center justify-center text-2xl shadow hover:bg-orange-50 transition-colors duration-200"
              title="View Cart"
              onClick={() => {/* TODO: Implement cart modal or navigation */}}
            >
              <span role="img" aria-label="cart">🛒</span>
            </button>
            <button
              className="w-10 h-10 rounded-full bg-orange-500 text-white font-bold text-xl flex items-center justify-center cursor-pointer focus:outline-none"
              onClick={() => setShowDropdown((prev) => !prev)}
              title={user.name}
            >
              {user.name?.charAt(0).toUpperCase()}
            </button>
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-50">
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
                  onClick={() => {/* TODO: Implement orders navigation */}}
                >
                  Orders
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                  onClick={() => {/* TODO: Implement delete account logic */}}
                >
                  Delete Account
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 border-t"
                  onClick={() => {
                    localStorage.removeItem("hotdrop_user");
                    setUser(null);
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

      {/* Hero Content */}
      <div className="flex flex-col-reverse md:flex-row items-center justify-between max-w-6xl w-full md:mt-4">
        {/* Left Content */}
        <div className="md:w-1/2 text-center md:text-left">
          <h1 className="text-10xl md:text-6xl font-extrabold text-gray-900">
            Walk In <span className="text-orange-500">Walk Out</span><br />
            Order Ahead!
          </h1>
          <p className="text-gray-600 mt-4 text-lg">
            Skip The line, Grab On Time!!
          </p>
          <div className="flex flex-col sm:flex-row items-center mt-6 gap-3">
            {user ? (
              <>
                <button onClick={() => {
                  const section = document.getElementById(foodSectionId);
                  if (section) section.scrollIntoView({ behavior: "smooth" });
                }} className="bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600 transition-colors duration-300 text-lg font-semibold flex items-center gap-2">
                  <span role="img" aria-label="rocket" className="text-xl">🚀</span>
                  Quick Order
                </button>
                <button className="bg-white text-orange-500 border border-orange-300 px-6 py-2 rounded-full hover:bg-orange-100 transition-colors duration-300 text-lg font-semibold flex items-center gap-2 ml-0 sm:ml-2 mt-3 sm:mt-0 shadow-sm" onClick={() => {/* TODO: Implement view cart logic */}}>
                  <span role="img" aria-label="cart" className="text-xl">🛒</span>
                  View Cart
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
        <div className="md:w-1/2 flex justify-center mb-10 md:mb-0">
          <img
            src="/girl2.png"
            alt="Ordering girl illustration"
            className="w-56 md:w-72"
          />
        </div>
      </div>

      <main className="w-full max-w-6xl mx-auto flex flex-col items-center">
        <FoodSection />
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
              const res = await fetch("http://localhost:3001/user/update", {
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
