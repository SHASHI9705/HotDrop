"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function ShopNameSubheading() {
  const [shopname, setShopname] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();
  useEffect(() => {
    if (typeof window !== "undefined") {
      const partner = localStorage.getItem("hotdrop_partner");
      if (partner) {
        try {
          setShopname(JSON.parse(partner).shopname || "");
        } catch {}
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("hotdrop_partner");
    router.push("/");
  };

  if (!shopname) return null;
  return (
    <div className="relative ml-4">
      <button
        className="text-lg md:text-xl font-bold text-black focus:outline-none"
        onClick={() => setShowDropdown((v) => !v)}
      >
        {shopname}
      </button>
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-lg z-50">
          <button
            className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default function PartnerDashboardNavbar() {
  const router = useRouter();
  return (
    <div className="min-h-screen flex flex-col items-center justify-start pt-2 p-6 bg-gradient-to-r from-white via-red-200 to-blue-50">
      <nav className="w-full max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 py-6">
        <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-start">
          <img
            src="/logo.png"
            alt="Logo"
            className="w-10 h-10 rounded"
          />
          <div className="text-3xl font-extrabold text-gray-800">HotDrop</div>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 w-full md:w-auto mt-2 md:mt-0 justify-center">
          <button
            className="relative bg-orange-400 text-white px-6 py-2 rounded-full hover:bg-orange-500 transition-colors duration-300 text-lg font-semibold w-full md:w-auto shadow-md border border-orange-500"
            onClick={() => {
              const section = document.getElementById('notification-section');
              if (section) section.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Notification
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5 border border-white">
              1
            </span>
          </button>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 w-full md:w-auto mt-2 md:mt-0 justify-end">
          <ShopNameSubheading />
          <button
            className="bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600 transition-colors duration-300 text-lg font-semibold w-full md:w-auto"
            onClick={() => router.push("/partner")}
          >
            Home
          </button>
        </div>
      </nav>
      {/* Profile Update Section */}
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-6 mb-8 flex flex-col md:flex-row items-center justify-between border border-gray-200">
        <div className="flex flex-col gap-2 w-full md:w-1/2">
          <div className="font-bold text-lg text-gray-700 mb-2">Profile Update</div>
          <input className="border rounded p-2 mb-2" placeholder="Name" defaultValue="Partner Name" />
          <input className="border rounded p-2 mb-2" placeholder="Email" defaultValue="partner@email.com" />
          <button className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm hover:bg-orange-600 font-semibold w-fit">Save Changes</button>
        </div>
        <div className="flex flex-col items-center mt-4 md:mt-0">
          <img src="/profile.svg" alt="Profile" className="w-20 h-20 rounded-full border-2 border-orange-400" />
        </div>
      </div>
      {/* Earning Summary Section */}
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-6 mb-8 flex flex-col items-center justify-between border border-gray-200">
        <div className="font-bold text-lg text-gray-700 mb-4 self-start">Earning Summary</div>
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 w-full justify-between mt-2">
          <div className="flex flex-col items-center flex-1">
            <div className="text-2xl font-bold text-green-600">₹12,500</div>
            <div className="text-gray-500 text-sm">Total Earned</div>
          </div>
          <div className="flex flex-col items-center flex-1">
            <div className="text-2xl font-bold text-blue-500">₹1,200</div>
            <div className="text-gray-500 text-sm">Earned Today</div>
          </div>
          <div className="flex flex-col items-center flex-1">
            <div className="text-2xl font-bold text-orange-500">120</div>
            <div className="text-gray-500 text-sm">Total Orders</div>
          </div>
          <div className="flex flex-col items-center flex-1">
            <div className="text-2xl font-bold text-purple-500">4.7★</div>
            <div className="text-gray-500 text-sm">Avg. Rating</div>
          </div>
        </div>
      </div>
      {/* Reviews Section */}
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
        <div className="font-bold text-lg text-gray-700 mb-4">Recent Reviews</div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-row items-start gap-4">
            <img src="/profile.svg" className="w-10 h-10 rounded-full" alt="User" />
            <div>
              <div className="font-semibold text-gray-800 flex items-center gap-2">Amit Sharma <span className="text-xs text-gray-400">2 hours ago</span></div>
              <div className="text-yellow-500">★★★★★</div>
              <div className="text-gray-600 text-sm mb-1">Great food and fast delivery!</div>
              <div className="text-xs text-gray-400">Ordered: Masala Dosa, Idli</div>
            </div>
          </div>
          <div className="flex flex-row items-start gap-4">
            <img src="/profile.svg" className="w-10 h-10 rounded-full" alt="User" />
            <div>
              <div className="font-semibold text-gray-800 flex items-center gap-2">Priya Singh <span className="text-xs text-gray-400">Yesterday</span></div>
              <div className="text-yellow-500">★★★★☆</div>
              <div className="text-gray-600 text-sm mb-1">Loved the pizza, will order again.</div>
              <div className="text-xs text-gray-400">Ordered: Pizza, Coke</div>
            </div>
          </div>
          <div className="flex flex-row items-start gap-4">
            <img src="/profile.svg" className="w-10 h-10 rounded-full" alt="User" />
            <div>
              <div className="font-semibold text-gray-800 flex items-center gap-2">Rohit Mehra <span className="text-xs text-gray-400">2 days ago</span></div>
              <div className="text-yellow-500">★★★★★</div>
              <div className="text-gray-600 text-sm mb-1">Excellent service and tasty food.</div>
              <div className="text-xs text-gray-400">Ordered: Burger, Fries</div>
            </div>
          </div>
        </div>
      </div>
      {/* Notification Section */}
      <div id="notification-section" className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
        <div className="font-bold text-lg text-gray-700 mb-4">Latest Order Notification</div>
        <div className="flex flex-row items-center gap-4">
          <div className="bg-orange-100 text-orange-700 px-4 py-2 rounded-full font-semibold">New Order</div>
          <div className="text-gray-700">Order #1011 placed by <span className="font-bold">Rahul Verma</span> for <span className="font-bold">₹599</span> - <span className="text-green-600">Payment Received</span></div>
        </div>
      </div>
      {/* Order List Section */}
      <h1 className="text-3xl md:text-4xl font-extrabold text-center text-gray-900 mt-8 mb-8">Order list</h1>
      <div className="w-full max-w-4xl flex flex-col gap-6">
        {[1,2,3,4,5,6,7,8,9,10].map((n) => (
          <div key={n} className="bg-white rounded-xl shadow-lg flex flex-col md:flex-row items-center justify-between px-8 py-6 border border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center gap-4 w-full">
              <div className="font-bold text-lg text-gray-700">Order #{1000+n}</div>
              <div className="text-gray-500 text-base">Items: Samosa, Pizza, Coke</div>
              <div className="text-green-600 font-semibold text-base">Payment: ₹{(n*250)+99}</div>
              <div className="text-blue-500 text-base">Status: Delivered</div>
              <div className="text-gray-400 text-xs">Placed: 2025-07-0{(n%10)+1} 12:3{n%10} PM</div>
            </div>
          </div>
        ))}
      </div>
      <div className="w-full flex justify-center mt-12 mb-8">
        <button
          className="bg-red-500 text-white px-8 py-3 rounded-full text-lg font-bold shadow hover:bg-red-600 transition-colors duration-300"
          onClick={() => {
            localStorage.removeItem("hotdrop_partner");
            router.push("/");
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
