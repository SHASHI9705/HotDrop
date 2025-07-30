"use client"


import Image from "next/image";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

// Define types for partner and item
interface Item {
  name: string;
}
interface Partner {
  name: string;
  image?: string;
  rating?: number;
  ratingsCount?: number;
  items: Item[];
}

export default function OrdersPage() {
  return (
    <>
      {/* Nav Bar with Back, Heading, and Home */}
      <div className="w-full max-w-5xl mx-auto flex items-center justify-between mb-1 px-0 md:px-4 py-3 bg-white/80 rounded-xl shadow border border-orange-200 mt-1">
        {/* Back Button (left) */}
        <button
          className="flex items-center px-3 py-1.5 md:px-5 md:py-2 bg-orange-100 hover:bg-orange-200 text-orange-600 font-semibold rounded-lg shadow transition ml-2"
          title="Back"
          onClick={() => window.history.back()}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="#fb923c" className="w-6 h-6 mr-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          <span className="hidden md:inline">Back</span>
        </button>
        {/* Centered logo and heading */}
        <div className="flex items-center gap-3 mx-auto">
          <img src="/logo.png" alt="HotDrop Logo" className="w-10 h-10 md:w-14 md:h-14" />
          <h1 className="text-xl md:text-3xl font-bold text-orange-500 drop-shadow-sm whitespace-nowrap">HotDrop Orders</h1>
        </div>
        {/* Home Button (right) */}
        <button
          className="flex items-center px-3 py-1.5 md:px-5 md:py-2 bg-orange-100 hover:bg-orange-200 text-orange-600 font-semibold rounded-lg shadow transition mr-2"
          title="Home"
          onClick={() => window.location.href = '/'}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="#fb923c" className="w-6 h-6 mr-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-9 9 9M4.5 10.5V21h15V10.5" />
          </svg>
          <span className="hidden md:inline">Home</span>
        </button>
      </div>
      <Suspense fallback={<p>Loading...</p>}>
        <OrdersContent />
      </Suspense>
    </>
  );
}

// WaterLoader: animated water fill loader (copied from main page)
function WaterLoader() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-64">
      <div className="relative w-24 h-24 rounded-full border-4 border-orange-400 overflow-hidden">
        {/* Water */}
        <div className="absolute bottom-0 left-0 w-full h-full bg-orange-400 animate-fillWave z-10" />
        {/* Text */}
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <span className="text-white font-bold text-lg">Loading</span>
        </div>
      </div>
      {/* Keyframes for the wave animation */}
      <style>{`
        @keyframes fillWave {
          0% { transform: translateY(100%); }
          50% { transform: translateY(50%); }
          100% { transform: translateY(100%); }
        }
        .animate-fillWave {
          animation: fillWave 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

function OrdersContent() {
  const searchParams = useSearchParams();
  const itemName = searchParams.get("food") || "Burgers";
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/partners-with-items`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setPartners(data);
        } else if (data && Array.isArray(data.partners)) {
          setPartners(data.partners);
        } else {
          setPartners([]);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [itemName]);

  // More robust filter: ignore case, whitespace, and plural/singular
  const normalize = (str: string) => str.toLowerCase().replace(/\s+/g, '').replace(/s$/, '');
  const foodKey = normalize(itemName);
  const foodPartners = partners.filter((partner) =>
    partner.items && partner.items.some((item) => normalize(item.name).includes(foodKey))
  );

  function getFoodTagline(itemName: string) {
    const key = itemName.toLowerCase();
    if (key.includes("cake")) return "Craving for something sweet?";
    if (key.includes("dosa")) return "Want to taste the best from South?";
    if (key.includes("pizza")) return "Slice into cheesy goodness!";
    if (key.includes("burger")) return "Bite into juicy perfection!";
    if (key.includes("roll")) return "Roll into flavor town!";
    if (key.includes("momo")) return "Steaming hot momos await!";
    if (key.includes("icecream")) return "Cool down with a sweet treat!";
    if (key.includes("sandwich")) return "Stacked with taste, just for you!";
    if (key.includes("chinese")) return "Savor the best of Indo-Chinese!";
    if (key.includes("shake")) return "Sip on something special!";
    if (key.includes("chole")) return "Spice up your day, Punjabi style!";
    if (key.includes("manchurian")) return "Crispy, saucy, and irresistible!";
    if (key.includes("cake")) return "Craving for something sweet?";
    if (key.includes("sandwich")) return "Stacked with taste, just for you!";
    if (key.includes("roll")) return "Roll into flavor town!";
    if (key.includes("icecream")) return "Cool down with a sweet treat!";
    if (key.includes("south")) return "Want to taste the best from South?";
    return `Taste the delicious ${itemName.toLowerCase()} today`;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-white via-red-100 to-red-300">
      <div className="pl-12">
        <h2 className="text-3xl font-extrabold text-orange-500 mb-2 drop-shadow-sm">{itemName}</h2>
        <p className="text-lg text-gray-700 mb-8">{getFoodTagline(itemName)}</p>
        {loading ? (
          <WaterLoader />
        ) : foodPartners.length === 0 ? (
          <div className="flex items-center justify-center h-40 text-2xl font-bold text-orange-400 w-full">Coming soon...</div>
        ) : (
          <div className="flex flex-row gap-6 mb-10 overflow-x-auto pr-12">
            {foodPartners.map((partner, idx) => {
              const specialItem = partner.items.find((item) => normalize(item.name).includes(foodKey));
              return (
                <a
                  key={idx}
                  href={`/orders/shopitems?shop=${encodeURIComponent(partner.name)}&food=${encodeURIComponent(itemName)}`}
                  className="w-64 h-64 bg-white rounded-2xl shadow-lg flex flex-col border border-orange-200 flex-shrink-0 transition-transform hover:scale-105 focus:outline-none overflow-hidden"
                  style={{ textDecoration: 'none' }}
                >
                  <img
                    src={partner.image && partner.image !== '/logo.png' ? partner.image.startsWith('http') ? partner.image : `${process.env.NEXT_PUBLIC_BACKEND_API}${partner.image}` : '/logo.png'}
                    alt="Shop Logo"
                    className="w-full"
                    style={{ height: '65%', objectFit: 'cover' }}
                  />
                  <div className="flex flex-col justify-between h-[35%] w-full p-3">
                    <div className="flex items-center justify-between w-full mb-1">
                      <h3 className="text-lg font-bold text-gray-900 truncate">{partner.name}</h3>
                      <div className="flex items-center">
                        <span className="text-yellow-400 text-lg mr-1">★</span>
                        <span className="text-base font-semibold text-gray-800">{partner.rating || "4.5"}</span>
                      </div>
                    </div>
                    <span className="text-orange-500 font-medium text-sm">Special: {specialItem?.name}</span>
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
