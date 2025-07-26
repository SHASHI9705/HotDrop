"use client"


import { useEffect, useState } from "react";

// Heart button component for toggling favourite shops
function RestaurantFavButton({ shop }: { shop: any }) {
  const [isFav, setIsFav] = useState(false);
  useEffect(() => {
    // Check if shop is in localStorage favourites
    const favs = JSON.parse(localStorage.getItem("hotdrop_favshops") || "[]");
    setIsFav(favs.some((s: any) => s.id === shop.id));
  }, [shop.id]);

  const toggleFav = () => {
    let favs = [];
    try {
      favs = JSON.parse(localStorage.getItem("hotdrop_favshops") || "[]");
    } catch {}
    const exists = favs.find((s: any) => s.id === shop.id);
    let newFavs;
    if (exists) {
      newFavs = favs.filter((s: any) => s.id !== shop.id);
      setIsFav(false);
    } else {
      newFavs = [...favs, { id: shop.id, shopname: shop.shopname, shopimage: shop.shopimage && shop.shopimage.url ? shop.shopimage.url : null }];
      setIsFav(true);
    }
    localStorage.setItem("hotdrop_favshops", JSON.stringify(newFavs));
  };

  return (
    <button
      className="absolute top-2 right-3 z-20 bg-white/80 hover:bg-orange-100 rounded-full p-2 shadow transition"
      title={isFav ? "Remove from favourite shops" : "Add to favourite shops"}
      onClick={toggleFav}
      style={{ lineHeight: 0 }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill={isFav ? "#fb923c" : "none"}
        viewBox="0 0 24 24"
        strokeWidth={2.2}
        stroke="#fb923c"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.364l-7.682-7.682a4.5 4.5 0 010-6.364z"
        />
      </svg>
    </button>
  );
}
import PhoneFooter from "../../components/PhoneFooter";

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState<any[]>([]);

  useEffect(() => {
    // Fetch all restaurants from backend
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/partner/all`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setRestaurants(data);
        } else if (data && Array.isArray(data.partners)) {
          setRestaurants(data.partners);
        } else if (data && Array.isArray(data.data)) {
          setRestaurants(data.data);
        } else {
          setRestaurants([]);
        }
      })
      .catch(() => setRestaurants([]));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-white via-orange-100 to-orange-200 flex flex-col items-center pt-8 px-4 pb-24">
      <div className="w-full max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8 w-full px-0 md:px-4 py-3 bg-white/80 rounded-xl shadow border border-orange-200">
          {/* Back Button (left, rectangle) */}
          <button
            className="hidden md:flex items-center px-5 py-2 bg-orange-100 hover:bg-orange-200 text-orange-600 font-semibold rounded-lg shadow transition ml-2"
            title="Back"
            onClick={() => window.history.back()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="#fb923c" className="w-6 h-6 mr-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            Back
          </button>
          {/* Centered logo and heading */}
          <div className="flex items-center gap-3 mx-auto">
            <img src="/logo.png" alt="HotDrop Logo" className="w-10 h-10 md:w-16 md:h-16" />
            <h1 className="text-xl md:text-4xl font-bold text-orange-500 drop-shadow-sm whitespace-nowrap">Restaurants</h1>
          </div>
          {/* Home Button (right, rectangle) */}
          <button
            className="hidden md:flex items-center px-5 py-2 bg-orange-100 hover:bg-orange-200 text-orange-600 font-semibold rounded-lg shadow transition mr-2"
            title="Home"
            onClick={() => window.location.href = '/'}
          >
            Home
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="#fb923c" className="w-6 h-6 ml-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-9 9 9M4.5 10.5V21a1.5 1.5 0 001.5 1.5h3.75A1.5 1.5 0 0011.25 21V16.5a1.5 1.5 0 011.5-1.5h0a1.5 1.5 0 011.5 1.5V21a1.5 1.5 0 001.5 1.5h3.75A1.5 1.5 0 0021 21V10.5" />
            </svg>
          </button>
        </div>
        <p className="text-base text-gray-700 mb-10 text-center max-w-2xl mx-auto">Find top local spots, pre-order your favorites, and grab your food on the go!</p>
        {restaurants.length === 0 ? (
          <div className="text-center text-gray-400 py-24 text-xl font-semibold">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
            {restaurants.map((rest, idx) => (
              <div key={rest.id || idx} className="relative bg-white rounded-xl shadow p-0 w-11/12 max-w-xs md:max-w-md lg:max-w-2xl flex flex-col border border-orange-100 overflow-hidden mx-auto">
                {/* Heart Favourite Button */}
                <RestaurantFavButton shop={rest} />
                {/* Restaurant Image */}
                <div className="w-full" style={{height: '150px'}}>
                  <img
                    src={
                      (rest.shopimage && typeof rest.shopimage === 'object' && rest.shopimage.url)
                        ? rest.shopimage.url
                        : "/pizza.png"
                    }
                    alt={rest.shopname}
                    className="w-full h-full object-cover"
                    style={{minHeight: 120, maxHeight: 150}}
                  />
                </div>
                {/* Name, Avg Time & Rating Row */}
                <div className="flex items-center justify-between w-full mb-0 gap-2 px-3 max-w-full overflow-hidden py-3">
                  <div className="font-semibold text-lg text-gray-800 truncate text-left max-w-[50%]">{rest.shopname}</div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {/* Avg Time Label */}
                    <span className="bg-orange-100 text-orange-600 text-xs font-semibold rounded-full px-2 py-0.5 mr-1 whitespace-nowrap">{idx % 2 === 0 ? "10-20 min" : "25-30 min"}</span>
                    {/* Rating */}
                    <div className="flex items-center gap-1 text-orange-500 text-sm whitespace-nowrap">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20" className="w-4 h-4">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
                      </svg>
                      <span>4.3</span>
                    </div>
                  </div>
                </div>
                {/* View Menu Button */}
                <button
                  className="px-0 py-3 bg-orange-500 text-white rounded-b-xl font-semibold text-sm hover:bg-orange-600 transition w-full"
                  style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0, marginTop: 'auto' }}
                  // onClick={() => {}}
                >
                  View Menu
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
