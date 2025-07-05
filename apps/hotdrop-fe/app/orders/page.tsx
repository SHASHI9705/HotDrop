"use client"

import Image from "next/image";
import { useEffect, useState } from "react";

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
  const itemName = "Burgers";
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3001/partners-with-items")
      .then((res) => res.json())
      .then((data) => {
        setPartners(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Filter partners with at least one item containing 'burger' (case-insensitive)
  const burgerPartners = partners.filter((partner) =>
    partner.items && partner.items.some((item) => item.name.toLowerCase().includes("burger"))
  );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-white via-orange-100 to-orange-300">
      <header className="w-full flex flex-row items-center justify-between py-10 pl-12 pr-12">
        <div className="flex flex-row items-center">
          <Image src="/logo.png" alt="HotDrop Logo" width={80} height={80} className="mr-6" />
          <h1 className="text-4xl font-extrabold tracking-tight">
            <span className="text-black">HotDrop</span> <span className="text-orange-500">Orders</span>
          </h1>
        </div>
        <a
          href="/"
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded-full shadow transition-colors duration-200 text-lg"
        >
          Home
        </a>
      </header>
      <div className="pl-12">
        <h2 className="text-3xl font-extrabold text-orange-500 mb-2 drop-shadow-sm">{itemName}</h2>
        <p className="text-lg text-gray-700 mb-8">Taste the delicious burgers today</p>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="flex flex-row gap-6 mb-10 overflow-x-auto pr-12">
            {burgerPartners.map((partner, idx) => {
              const burgerItem = partner.items.find((item) => item.name.toLowerCase().includes("burger"));
              return (
                <a
                  key={idx}
                  href={`/orders/shopitems?shop=${encodeURIComponent(partner.name)}`}
                  className="w-64 h-64 bg-white rounded-2xl shadow-lg flex flex-col items-center justify-center border border-orange-200 flex-shrink-0 transition-transform hover:scale-105 focus:outline-none"
                  style={{ textDecoration: 'none' }}
                >
                  <img
                    src={partner.image && partner.image !== '/logo.png' ? `/images/${partner.image}` : '/logo.png'}
                    alt="Shop Logo"
                    width={90}
                    height={90}
                    className="rounded-xl mb-4 border border-orange-100 object-cover"
                    style={{ width: '90px', height: '90px' }}
                  />
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{partner.name}</h3>
                  <div className="flex items-center mb-2">
                    <span className="text-yellow-400 text-xl mr-2">★</span>
                    <span className="text-lg font-semibold text-gray-800">{partner.rating || "4.5"}</span>
                    <span className="text-gray-500 text-sm ml-2">({partner.ratingsCount || "0"} ratings)</span>
                  </div>
                  <span className="text-orange-500 font-medium">Special: {burgerItem?.name}</span>
                </a>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
