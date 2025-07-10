"use client"

import Image from "next/image";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

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
    <Suspense fallback={<p>Loading...</p>}>
      <OrdersContent />
    </Suspense>
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
        setPartners(data);
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

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-white via-red-100 to-red-300">
      <header className="w-full flex flex-col sm:flex-row items-center justify-between py-6 px-4 sm:py-10 sm:pl-12 sm:pr-12">
        <div className="flex flex-col sm:flex-row items-center w-full sm:w-auto">
          <Image src="/logo.png" alt="HotDrop Logo" width={60} height={60} className="mb-2 sm:mb-0 sm:mr-6" />
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-center sm:text-left">
            <span className="text-black">HotDrop</span> <span className="text-orange-500">Orders</span>
          </h1>
        </div>
        <a
          href="/"
          className="mt-4 sm:mt-0 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded-full shadow transition-colors duration-200 text-lg"
        >
          Home
        </a>
      </header>
      <div className="pl-12">
        <h2 className="text-3xl font-extrabold text-orange-500 mb-2 drop-shadow-sm">{itemName}</h2>
        <p className="text-lg text-gray-700 mb-8">Taste the delicious {itemName.toLowerCase()} today</p>
        {loading ? (
          <p>Loading...</p>
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
