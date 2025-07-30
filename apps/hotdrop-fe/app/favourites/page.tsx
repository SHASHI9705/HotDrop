"use client";

import { useEffect, useState } from "react";
import PhoneFooter from "../../components/PhoneFooter";


export default function FavouritesPage() {
  const [favs, setFavs] = useState<any[]>([]);
  const [favShops, setFavShops] = useState<any[]>([]);
  const [tab, setTab] = useState<'all' | 'food' | 'shops'>('all');

  useEffect(() => {
    try {
      setFavs(JSON.parse(localStorage.getItem("hotdrop_favourites") || "[]"));
    } catch {
      setFavs([]);
    }
    try {
      setFavShops(JSON.parse(localStorage.getItem("hotdrop_favshops") || "[]"));
    } catch {
      setFavShops([]);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-white via-orange-100 to-orange-200 flex flex-col items-center pt-8 px-4 pb-24">
      <div className="w-full max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8 w-full px-0 md:px-4 py-3 bg-white/80 rounded-xl shadow border border-orange-200">
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
            <img src="/logo.png" alt="HotDrop Logo" className="w-10 h-10 md:w-16 md:h-16" />
            <h1 className="text-xl md:text-4xl font-bold text-orange-500 drop-shadow-sm whitespace-nowrap">Your Favourites!</h1>
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

        {/* Hide paragraph on mobile, show on md+ */}
        <p className="hidden md:block text-base text-gray-700 mb-10 text-center max-w-2xl mx-auto">Your favourite food item is here for quick access. Add to cart and enjoy instantly!</p>

        {/* Tab section for mobile only */}
        <div className="md:hidden w-full flex justify-center items-center mb-6 mt-2">
          <div className="flex w-full max-w-xs bg-white rounded-full shadow border border-orange-200 overflow-hidden">
            <button
              className={`flex-1 py-2 text-xs font-semibold transition ${tab === 'all' ? 'bg-orange-100 text-orange-600' : 'bg-white text-gray-500'}`}
              onClick={() => setTab('all')}
            >
              All
            </button>
            <button
              className={`flex-1 py-2 text-xs font-semibold transition ${tab === 'food' ? 'bg-orange-100 text-orange-600' : 'bg-white text-gray-500'}`}
              onClick={() => setTab('food')}
            >
              Food
            </button>
            <button
              className={`flex-1 py-2 text-xs font-semibold transition ${tab === 'shops' ? 'bg-orange-100 text-orange-600' : 'bg-white text-gray-500'}`}
              onClick={() => setTab('shops')}
            >
              Shops
            </button>
          </div>
        </div>


        {/* Favourite Items Section (hidden on mobile if using tabs) */}
        <h2 className="hidden md:block text-lg md:text-2xl font-bold text-orange-600 mb-4 mt-8">Favourite Items</h2>
        {tab !== 'shops' && (
          favs.length === 0 ? (
            <div className="text-center text-gray-400 py-12 text-lg font-semibold md:block hidden">No favourite items yet. Tap the <span className="text-orange-500">heart</span> on any food card to add it here!</div>
          ) : (
            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 justify-center ${tab === 'all' ? '' : 'md:mb-12'}`}>
              {tab === 'all' || tab === 'food' ? favs.map((fav, idx) => (
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
              )) : null}
            </div>
          )
        )}


        {/* Favourite Shops Section (hidden on mobile if using tabs) */}
        <h2 className="hidden md:block text-lg md:text-2xl font-bold text-orange-600 mb-4 mt-12">Favourite Shops</h2>
        {tab !== 'food' && (
          favShops.length === 0 ? (
            <div className="text-center text-gray-400 py-12 text-lg font-semibold md:block hidden">No favourite shops yet. Tap the <span className="text-orange-500">heart</span> on any shop card to add it here!</div>
          ) : (
            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 justify-center${tab === 'all' && favs.length > 0 ? ' mt-8' : ''}`}>
              {tab === 'all' || tab === 'shops' ? favShops.map((shop, idx) => (
                <div key={shop.id || idx} className="relative bg-white rounded-xl shadow p-0 w-11/12 max-w-xs flex flex-col border border-orange-100 overflow-hidden mx-auto">
                  {/* Remove Button */}
                  <button
                    className="absolute top-2 left-2 z-20 bg-red-100 hover:bg-red-200 text-red-600 rounded-full px-2 py-1 text-xs font-bold shadow"
                    title="Remove from favourite shops"
                    onClick={() => {
                      const newFavShops = favShops.filter((s, i) => i !== idx);
                      setFavShops(newFavShops);
                      localStorage.setItem("hotdrop_favshops", JSON.stringify(newFavShops));
                    }}
                  >
                    Remove
                  </button>
                  {/* Shop Name Label at Top Right */}
                  <div className="absolute top-2 right-4 z-10 bg-white/80 px-3 py-1 rounded-full text-xs font-semibold text-orange-600 shadow">{shop.shopname}</div>
                  {/* Shop Image */}
                  <div className="w-full" style={{height: '150px'}}>
                    <img src={shop.shopimage || "/pizza.png"} alt={shop.shopname} className="w-full h-full object-cover" style={{minHeight: 120, maxHeight: 150}} />
                  </div>
                  {/* Spacer for layout */}
                  <div className="flex-1" />
                  {/* View Menu Button */}
                  <button
                    className="px-0 py-3 bg-orange-500 text-white rounded-b-xl font-semibold text-sm hover:bg-orange-600 transition w-full"
                    style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0, marginTop: 'auto' }}
                    onClick={() => {
                      // Navigate to allitems page for this shop
                      window.location.href = `/allitems?shop=${encodeURIComponent(shop.shopname || shop.name || shop.id)}`;
                    }}
                  >
                    View Menu
                  </button>
                </div>
              )) : null}
            </div>
          )
        )}
      </div>
      <div className="md:hidden">
        <PhoneFooter />
      </div>
    </div>
  );
}
