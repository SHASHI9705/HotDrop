"use client";

import { useEffect, useState } from "react";
import PhoneFooter from "../../components/PhoneFooter";

export default function FavouritesPage() {
  const [favs, setFavs] = useState<any[]>([]);

  useEffect(() => {
    try {
      setFavs(JSON.parse(localStorage.getItem("hotdrop_favourites") || "[]"));
    } catch {
      setFavs([]);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-white via-orange-100 to-orange-200 flex flex-col items-center pt-8 px-4 pb-24">
      <div className="w-full max-w-5xl mx-auto">
        <div className="flex items-center justify-center mb-4 w-full gap-4">
          <img src="/logo.png" alt="HotDrop Logo" className="w-10 h-10 md:w-20 md:h-20" />
          <h1 className="text-xl md:text-5xl font-bold text-orange-500 drop-shadow-sm whitespace-nowrap">Your Favourites!</h1>
        </div>
        <p className="text-base text-gray-700 mb-10 text-center max-w-2xl mx-auto">Your favourite food item is here for quick access. Add to cart and enjoy instantly!</p>
        {favs.length === 0 ? (
          <div className="text-center text-gray-400 py-24 text-xl font-semibold">No favourites yet. Tap the <span className="text-orange-500">heart</span> on any card to add it here!</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 justify-center">
            {favs.map((fav, idx) => (
              <div key={fav.shop.id + fav.item.name} className="relative bg-white rounded-xl shadow p-0 w-11/12 max-w-xs flex flex-col border border-orange-100 overflow-hidden mx-auto">
                {/* Remove Button */}
                <button
                  className="absolute top-2 left-2 z-20 bg-red-100 hover:bg-red-200 text-red-600 rounded-full px-2 py-1 text-xs font-bold shadow"
                  title="Remove from favourites"
                  onClick={() => {
                    const newFavs = favs.filter((f, i) => i !== idx);
                    setFavs(newFavs);
                    localStorage.setItem("hotdrop_favourites", JSON.stringify(newFavs));
                  }}
                >
                  Remove
                </button>
                {/* Shop Name */}
                <div className="absolute top-2 right-4 z-10 bg-white/80 px-3 py-1 rounded-full text-xs font-semibold text-orange-600 shadow">{fav.shop.name}</div>
                {/* Food Image */}
                <div className="w-full" style={{height: '150px'}}>
                  <img src={fav.item.image || "/pizza.png"} alt={fav.item.name} className="w-full h-full object-cover" style={{minHeight: 120, maxHeight: 150}} />
                </div>
                {/* Name, Price & Rating Row */}
                <div className="flex items-center justify-between w-full mb-0 gap-2 px-3 max-w-full overflow-hidden" style={{ minHeight: 0, paddingBottom: 0 }}>
                  <div className="font-semibold text-lg text-gray-800 truncate text-left max-w-[50%]">{fav.item.name}</div>
                  <div className="flex items-center gap-4 flex-shrink-0 max-w-[48%]">
                    <div className="text-gray-700 font-medium text-base whitespace-nowrap">₹{fav.item.price}</div>
                    <div className="flex items-center gap-1 text-orange-500 text-sm whitespace-nowrap">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20" className="w-4 h-4">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
                      </svg>
                      <span>4.5</span>
                    </div>
                  </div>
                </div>
                {/* Add to Cart Button */}
                <button
                  className="px-0 py-3 bg-orange-500 text-white rounded-b-xl font-semibold text-sm hover:bg-orange-600 transition w-full"
                  style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0, marginTop: 0 }}
                  onClick={() => {
                    // Prepare cart item structure as in CartPage
                    const cartItem = {
                      id: fav.item.name + "-" + fav.shop.id, // unique per shop+item
                      name: fav.item.name,
                      price: fav.item.price,
                      image: fav.item.image,
                      quantity: 1,
                      shopId: fav.shop.id,
                      shopName: fav.shop.name,
                      shopImage: fav.shop.image
                    };
                    // Get current cart
                    let cart = [];
                    try {
                      cart = JSON.parse(localStorage.getItem("hotdrop_cart") || "[]");
                    } catch {}
                    // Check if item already in cart (by id)
                    const existing = cart.find((item: any) => item.id === cartItem.id);
                    if (existing) {
                      existing.quantity += 1;
                    } else {
                      cart.push(cartItem);
                    }
                    localStorage.setItem("hotdrop_cart", JSON.stringify(cart));
                    // Also store selected shop info
                    const shopInfo = {
                      id: fav.shop.id,
                      name: fav.shop.name,
                      shopname: fav.shop.name,
                      image: fav.shop.image
                    };
                    localStorage.setItem("hotdrop_selected_shop", JSON.stringify(shopInfo));
                  }}
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="md:hidden">
        <PhoneFooter />
      </div>
    </div>
  );
}
