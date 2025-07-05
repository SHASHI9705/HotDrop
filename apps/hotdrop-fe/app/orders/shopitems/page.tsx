"use client"

import Image from "next/image";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

interface Item {
  name: string;
  price: number;
  image: string;
  available: boolean;
}

export default function ShopItemsPage() {
  const searchParams = useSearchParams();
  const shopname = searchParams.get("shop");
  const [shop, setShop] = useState<{ name: string; image?: string; rating?: number; ratingsCount?: number } | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!shopname) return;
    fetch(`http://localhost:3001/partner/burger-items?shopname=${encodeURIComponent(shopname)}`)
      .then((res) => res.json())
      .then((data) => {
        setShop(data.shop);
        setItems(data.items);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [shopname]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-white via-orange-100 to-orange-300">
      <header className="w-full flex flex-row items-center justify-between py-8 pl-12 pr-12">
        <div className="flex flex-row items-center">
          <Image src={shop?.image || "/logo.png"} alt="Shop Logo" width={70} height={70} className="mr-5 rounded-xl border border-orange-200" />
          <div>
            <h1 className="text-3xl font-extrabold text-black mb-1">{shop?.name || "Shop"}</h1>
            <div className="flex items-center mb-1">
              <span className="text-yellow-400 text-xl mr-2">★</span>
              <span className="text-lg font-semibold text-gray-800">{shop?.rating || "4.5"}</span>
              <span className="text-gray-500 text-sm ml-2">({shop?.ratingsCount || "0"} ratings)</span>
            </div>
          </div>
        </div>
        <a href="/orders" className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded-full shadow transition-colors duration-200 text-lg">Back</a>
      </header>
      <div className="pl-12 pr-12">
        <h2 className="text-2xl font-bold text-orange-500 mb-6 mt-2">Menu</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((item, idx) => (
              <div
                key={idx}
                className={`w-64 h-64 bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center border border-orange-100 ${!item.available ? 'opacity-50' : ''}`}
              >
                <img
                  src={item.image.startsWith("/images/") ? `http://localhost:3001${item.image}` : item.image}
                  alt={item.name}
                  width={90}
                  height={90}
                  className="mb-4 rounded-lg border border-orange-200 object-cover"
                  style={{ width: '90px', height: '90px' }}
                />
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.name}</h3>
                <p className="text-lg text-orange-500 font-semibold mb-2">₹{item.price}</p>
                <span className={`text-sm font-medium ${item.available ? 'text-green-600' : 'text-red-400'}`}>{item.available ? 'Available' : 'Out of Stock'}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
