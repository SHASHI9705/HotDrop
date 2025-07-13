"use client"


import Image from "next/image";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

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

interface Item {
  name: string;
  price: number;
  image: string;
  available: boolean | string;
}

function getHeading(foodName: string | null) {
  if (!foodName || typeof foodName !== 'string' || !foodName.trim()) return 'Menu';
  const decoded = decodeURIComponent(foodName).trim();
  return decoded.charAt(0).toUpperCase() + decoded.slice(1);
}

function isAvailable(item: Item) {
  return item.available === true || item.available === "true";
}

export default function ShopItemsPage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <ShopItemsContent />
    </Suspense>
  );
}

function ShopItemsContent() {
  const searchParams = useSearchParams();
  const shopname = searchParams.get("shop");
  const foodName = searchParams.get("food");
  const [shop, setShop] = useState<{ id?: string; name: string; image?: string; rating?: number; ratingsCount?: number } | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    if (!shopname) return;
    // Save selected partner to localStorage for checkout
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/partners-with-items`)
      .then((res) => res.json())
      .then((data) => {
        // Find the partner/shop
        const partner = data.find((p: any) => p.name === shopname);
        if (partner) {
          setShop({
            id: partner.id, // <-- add id to shop state
            name: partner.name,
            image: partner.image,
            rating: partner.rating,
            ratingsCount: partner.ratingsCount,
          });
          // Save selected shop info for checkout compatibility (ensure id is present)
          localStorage.setItem("hotdrop_selected_shop", JSON.stringify({
            id: partner.id, // <-- ensure id is present
            name: partner.name,
            shopname: partner.name, // for cart page compatibility
            image: partner.image,
            rating: partner.rating,
            ratingsCount: partner.ratingsCount,
            // add any other fields needed
          }));
          let filtered = partner.items;
          if (foodName) {
            // Normalize for plural/singular and whitespace
            const foodKey = foodName.toLowerCase().replace(/s$/, '').trim();
            filtered = partner.items.filter((item: any) => {
              if (!item.name) return false;
              const itemKey = item.name.toLowerCase();
              return itemKey.includes(foodKey);
            });
          }
          setItems(filtered); // <-- Fix: set filtered items to state
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [shopname, foodName]);

  useEffect(() => {
    // Load cart from localStorage
    const stored = localStorage.getItem("hotdrop_cart");
    if (stored) {
      try {
        const arr = JSON.parse(stored);
        const obj: Record<string, number> = {};
        arr.forEach((item: any) => { obj[item.name] = item.quantity; });
        setCart(obj);
      } catch {}
    }
  }, [shopname]);

  const updateCart = (item: Item, delta: number) => {
    setCart((prev) => {
      const newQty = Math.max(0, (prev[item.name] || 0) + delta);
      const updated = { ...prev, [item.name]: newQty };
      // Remove from object if qty is 0
      if (newQty === 0) delete updated[item.name];
      // Save to localStorage as array
      const stored = localStorage.getItem("hotdrop_cart");
      let arr = [];
      if (stored) {
        try { arr = JSON.parse(stored); } catch {}
      }
      // Remove this item if exists
      arr = arr.filter((i: any) => i.name !== item.name);
      if (newQty > 0) {
        // Always use current shop info for cart item
        arr.push({
          id: item.name,
          name: item.name,
          price: item.price,
          image: item.image,
          quantity: newQty,
          shopId: shop?.id,
          shopName: shop?.name,
          shopImage: shop?.image
        });
      }
      // Always update hotdrop_selected_shop if shop is available
      if (shop && shop.id) {
        localStorage.setItem("hotdrop_selected_shop", JSON.stringify(shop));
      }
      localStorage.setItem("hotdrop_cart", JSON.stringify(arr));
      return updated;
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-white via-orange-100 to-orange-300">
      <header className="w-full flex flex-col sm:flex-row items-center justify-between py-6 sm:py-8 px-4 sm:pl-12 sm:pr-12 gap-4 sm:gap-0">
        <div className="flex flex-col sm:flex-row items-center w-full sm:w-auto gap-2 sm:gap-0">
          <Image src="/logo.png" alt="HotDrop Logo" width={44} height={44} className="mr-0 sm:mr-4 rounded-xl" />
          <div className="flex flex-col items-center sm:items-start w-full">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-black mb-1 flex items-center text-center sm:text-left">{shop?.name || "Shop"}</h1>
            <div className="flex items-center mb-1 justify-center sm:justify-start">
              <span className="text-yellow-400 text-lg sm:text-xl mr-2">★</span>
              <span className="text-base sm:text-lg font-semibold text-gray-800">{shop?.rating || "4.5"}</span>
              <span className="text-gray-500 text-xs sm:text-sm ml-2">({shop?.ratingsCount || "0"} ratings)</span>
            </div>
          </div>
        </div>
        <div className="flex flex-row items-center gap-2 sm:gap-4 w-full sm:w-auto justify-center sm:justify-end">
          <a
            href={foodName ? `/orders?food=${encodeURIComponent(foodName)}` : "/orders"}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 sm:px-6 py-2 rounded-full shadow transition-colors duration-200 text-base sm:text-lg w-full sm:w-auto text-center"
          >
            Back
          </a>
        </div>
      </header>
      <div className="px-4 sm:pl-12 sm:pr-12 pb-28">
        <h2 className="text-xl sm:text-2xl font-bold text-orange-500 mb-4 sm:mb-6 mt-2 text-center sm:text-left">{getHeading(foodName)}</h2>
        {loading ? (
          <WaterLoader />
        ) : items.length === 0 ? (
          <div className="text-center text-gray-500 py-12 text-base sm:text-lg">No items found for this menu.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 place-items-center">
            {items.map((item, idx) => (
              <div
                key={idx}
                className={`w-full max-w-xs h-72 sm:w-64 sm:h-80 bg-white rounded-2xl shadow-lg flex flex-col border border-orange-100 overflow-hidden ${!item.available ? 'opacity-50' : ''}`}
              >
                <div className="w-full" style={{ height: '60%' }}>
                  <img
                    src={item.image && typeof item.image === 'string' && item.image.startsWith("/images/") ? `${process.env.NEXT_PUBLIC_BACKEND_API}${item.image}` : item.image || "/logo.png"}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-row w-full flex-1 p-3 sm:p-4 items-start justify-between gap-2" style={{ height: '40%' }}>
                  <div className="flex flex-col flex-1">
                    <div className="flex flex-row items-center justify-between">
                      <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 truncate">{item.name}</h3>
                      <span className="text-base sm:text-lg text-orange-500 font-semibold ml-2">₹{item.price}</span>
                    </div>
                    <div className="flex flex-row items-center mt-1">
                      <span className={`text-xs sm:text-sm font-medium ${isAvailable(item) ? 'text-green-600' : 'text-red-400'}`}>{isAvailable(item) ? 'Available' : 'Out of Stock'}</span>
                      {isAvailable(item) && (
                        <div className="flex items-center gap-1 sm:gap-2 ml-auto">
                          <button className="bg-orange-200 text-orange-700 rounded-full w-7 h-7 flex items-center justify-center text-base sm:text-lg font-bold hover:bg-orange-300" onClick={() => updateCart(item, -1)}>-</button>
                          <span className="font-semibold text-xs sm:text-base text-gray-700 min-w-[20px] text-center">{cart[item.name] || 0}</span>
                          <button className="bg-orange-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-base sm:text-lg font-bold hover:bg-orange-600" onClick={() => updateCart(item, 1)}>+</button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Checkout Footer Button */}
      {Object.values(cart).reduce((sum, qty) => sum + qty, 0) > 0 && (
        <div className="fixed bottom-0 left-0 w-full z-50">
          <button
            className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm sm:text-base py-3 rounded-none shadow transition-all duration-200 border-t border-orange-300"
            style={{ boxShadow: '0 -1px 8px rgba(251, 146, 60, 0.10)' }}
            onClick={() => {
              const user = typeof window !== 'undefined' ? localStorage.getItem('hotdrop_user') : null;
              if (!user) {
                window.location.href = '/signin';
              } else {
                window.location.href = '/cart';
              }
            }}
          >
            <span role="img" aria-label="cart" className="text-lg sm:text-xl">🛒</span>
            Checkout
            <span className="ml-2 bg-white text-orange-500 rounded-full px-2 py-0.5 text-xs sm:text-sm font-bold border border-orange-200 min-w-[20px] sm:min-w-[24px] text-center">
              {Object.values(cart).reduce((sum, qty) => sum + qty, 0)}
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
