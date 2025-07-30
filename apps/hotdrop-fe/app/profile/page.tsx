"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [user, setUser] = useState<{ id?: string; name: string; email: string } | null>(null);
  const router = useRouter();

  const [orderCount, setOrderCount] = useState<number>(0);
  const [favouritesCount, setFavouritesCount] = useState<number>(0);

  // Edit profile popup state
  const [showEdit, setShowEdit] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");
  const [editSuccess, setEditSuccess] = useState("");

  useEffect(() => {
    if (user) {
      // Match myorders logic: fetch orders using id or email, count length
      const fetchOrders = async () => {
        const userId = user.id || user.email;
        if (!userId) {
          setOrderCount(0);
          return;
        }
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/orders/orders?userId=${encodeURIComponent(userId)}`);
          const data = await res.json();
          setOrderCount(Array.isArray(data.orders) ? data.orders.length : 0);
        } catch {
          setOrderCount(0);
        }
      };
      fetchOrders();
      // Get favourites count from localStorage
      const favs = localStorage.getItem("hotdrop_favourites");
      if (favs) {
        try {
          const arr = JSON.parse(favs);
          setFavouritesCount(Array.isArray(arr) ? arr.length : 0);
        } catch {
          setFavouritesCount(0);
        }
      }
    }
  }, [user]);

  useEffect(() => {
    const stored = localStorage.getItem("hotdrop_user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-white via-orange-100 to-orange-200 flex flex-col items-center pt-8 px-4 pb-24">
      {/* Nav Bar */}
      <div className="w-full max-w-2xl mx-auto flex items-center justify-between mb-8 px-0 md:px-4 py-3 bg-white/80 rounded-xl shadow border border-orange-200">
        {/* Back Button (left) */}
        <button
          className="flex items-center px-5 py-2 bg-orange-100 hover:bg-orange-200 text-orange-600 font-semibold rounded-lg shadow transition ml-2"
          title="Back"
          onClick={() => router.back()}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="#fb923c" className="w-6 h-6 mr-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Back
        </button>
        {/* Centered Profile Heading */}
        <h1 className="text-xl md:text-3xl font-bold text-orange-500 drop-shadow-sm whitespace-nowrap mx-auto">Profile</h1>
        {/* Edit Button (right) */}
        <button
          className="flex items-center px-5 py-2 bg-orange-100 hover:bg-orange-200 text-orange-600 font-semibold rounded-lg shadow transition mr-2"
          title="Edit Profile"
          onClick={() => {
            setEditName(user?.name || '');
            setEditEmail(user?.email || '');
            setShowEdit(true);
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="#fb923c" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 5.487a2.1 2.1 0 112.97 2.97L8.5 19.79l-4 1 1-4 11.362-11.303z" />
          </svg>
        </button>
      </div>

      {/* Edit Profile Popup */}
      {showEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-xl shadow-lg border border-orange-200 p-8 w-full max-w-md flex flex-col gap-6 relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
              onClick={() => {
                setShowEdit(false);
                setEditSuccess("");
                setEditError("");
              }}
              title="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="#fb923c" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-xl font-bold text-orange-500 mb-2 text-center">Edit Profile</h2>
            <div className="flex flex-col gap-4">
              <label className="text-sm font-semibold text-gray-700">Name</label>
              <input
                type="text"
                className="border border-orange-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                value={editName}
                onChange={e => setEditName(e.target.value)}
              />
              <label className="text-sm font-semibold text-gray-700 mt-2">Email</label>
              <input
                type="email"
                className="border border-orange-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                value={editEmail}
                onChange={e => setEditEmail(e.target.value)}
              />
              {editError && <div className="text-red-500 text-sm mt-2">{editError}</div>}
              {editSuccess && <div className="text-green-600 text-sm mt-2">{editSuccess}</div>}
            </div>
            <button
              className="mt-4 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-lg shadow transition"
              onClick={async () => {
                setEditLoading(true);
                setEditError("");
                setEditSuccess("");
                try {
                  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/user/update`, {
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
                    setShowEdit(false);
                    setEditSuccess("");
                  }, 1200);
                } catch (err: any) {
                  setEditError(err.message);
                } finally {
                  setEditLoading(false);
                }
              }}
              disabled={editLoading}
            >
              {editLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      )}

      {/* Profile Card with stats row inside */}
      <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-lg border border-orange-200 flex flex-col px-4 sm:px-6 py-8 gap-4 sm:gap-6">
        <div className="flex flex-row items-center gap-4 sm:gap-6">
          {/* Profile Circle with Star */}
          <div className="relative flex items-center justify-center">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-orange-500 text-white font-bold text-3xl sm:text-4xl flex items-center justify-center shadow-lg border-4 border-white">
              {user?.name?.charAt(0).toUpperCase() || "U"}
              {/* Star at bottom right with thin white circle */}
              <span className="absolute -bottom-2 -right-2">
                <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white flex items-center justify-center border border-white">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#fbbf24" stroke="#f59e42" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15 8.5 22 9.3 17 14.1 18.2 21 12 17.8 5.8 21 7 14.1 2 9.3 9 8.5 12 2" />
                  </svg>
                </span>
              </span>
            </div>
          </div>
          {/* Name and Email (right side) */}
          <div className="flex flex-col items-start justify-center w-full ml-4 sm:ml-6">
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-2 break-words w-full">{user?.name || "Your Name"}</div>
            <div className="text-xs sm:text-lg md:text-xl text-gray-500 font-medium break-words w-full sm:max-w-xs sm:max-w-none">{user?.email || "your@email.com"}</div>
          </div>
        </div>
        {/* Divider line inside card */}
        <div className="w-full border-t border-orange-200 my-2" />
        {/* Orders, Favourites, Points row inside card */}
        <div className="w-full flex flex-row justify-around items-center py-2">
          <div className="flex flex-col items-center">
            <span className="text-lg md:text-xl font-bold text-orange-500">{orderCount}</span>
            <span className="text-xs md:text-sm text-gray-500 mt-1">Orders</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-lg md:text-xl font-bold text-orange-500">{favouritesCount}</span>
            <span className="text-xs md:text-sm text-gray-500 mt-1">Favourites</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-lg md:text-xl font-bold text-orange-500">{orderCount * 5}</span>
            <span className="text-xs md:text-sm text-gray-500 mt-1">Points</span>
          </div>
        </div>
      </div>

      {/* Options Boxes */}
      <div className="w-full max-w-2xl mx-auto mt-6 flex flex-col gap-4">
        {[
          { label: 'Favourites', icon: (<svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 1.01 4.5 2.09C13.09 4.01 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>) },
          { label: 'Order History', icon: (<svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" /></svg>) },
          { label: 'Order Points', icon: (<svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polygon points="12 2 15 8.5 22 9.3 17 14.1 18.2 21 12 17.8 5.8 21 7 14.1 2 9.3 9 8.5 12 2" /></svg>) },
          { label: 'Settings', icon: (<svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.09a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.09a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.09a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>) },
          { label: 'Help & Support', icon: (<svg className="w-6 h-6 text-green-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12ZM3.00683 12C3.00683 16.9668 7.03321 20.9932 12 20.9932C16.9668 20.9932 20.9932 16.9668 20.9932 12C20.9932 7.03321 16.9668 3.00683 12 3.00683C7.03321 3.00683 3.00683 7.03321 3.00683 12Z" fill="#0F0F0F"></path><path d="M13.5 18C13.5 18.8284 12.8284 19.5 12 19.5C11.1716 19.5 10.5 18.8284 10.5 18C10.5 17.1716 11.1716 16.5 12 16.5C12.8284 16.5 13.5 17.1716 13.5 18Z" fill="#0F0F0F"></path><path d="M11 12V14C11 14 11 15 12 15C13 15 13 14 13 14V12C13 12 13.4792 11.8629 13.6629 11.7883C13.6629 11.7883 13.9969 11.6691 14.2307 11.4896C14.4646 11.3102 14.6761 11.097 14.8654 10.8503C15.0658 10.6035 15.2217 10.3175 15.333 9.99221C15.4443 9.66693 15.5 9.4038 15.5 9C15.5 8.32701 15.3497 7.63675 15.0491 7.132C14.7596 6.61604 14.3476 6.21786 13.8132 5.93745C13.2788 5.64582 12.6553 5.5 11.9427 5.5C11.4974 5.5 11.1021 5.55608 10.757 5.66825C10.4118 5.7692 10.1057 5.9094 9.83844 6.08887C9.58236 6.25712 9.36525 6.4478 9.18711 6.66091C9.02011 6.86281 8.8865 7.0591 8.78629 7.24978C8.68609 7.44046 8.61929 7.6087 8.58589 7.75452C8.51908 7.96763 8.49125 8.14149 8.50238 8.27609C8.52465 8.41069 8.59145 8.52285 8.70279 8.61258C8.81413 8.70231 8.9867 8.79765 9.22051 8.8986C9.46546 8.97712 9.65473 9.00516 9.78834 8.98273C9.93308 8.96029 10.05 8.89299 10.1391 8.78083C10.1391 8.78083 10.6138 8.10569 10.7474 7.97109C10.8922 7.82528 11.0703 7.71312 11.2819 7.6346C11.4934 7.54487 11.7328 7.5 12 7.5C12.579 7.5 13.0076 7.64021 13.286 7.92062C13.5754 8.18982 13.6629 8.41629 13.6629 8.93225C13.6629 9.27996 13.6017 9.56038 13.4792 9.77349C13.3567 9.9866 13.1953 10.1605 12.9949 10.2951C12.9949 10.2951 12.7227 10.3991 12.5 10.5C12.2885 10.5897 11.9001 10.7381 11.6997 10.8503C11.5104 10.9512 11.4043 11.0573 11.2819 11.2144C11.1594 11.3714 11 11.7308 11 12Z" fill="#0F0F0F"></path></svg>) },
          { label: 'Terms & Conditions', icon: (<svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 8h8M8 12h8M8 16h4" strokeLinecap="round" strokeLinejoin="round"/></svg>) },
          { label: 'About Us', icon: (<svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M6 20v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" strokeLinecap="round" strokeLinejoin="round"/></svg>) },
          { label: 'Privacy Policy', icon: (<svg className="w-6 h-6 text-purple-400" viewBox="0 0 192 192" xmlns="http://www.w3.org/2000/svg" fill="none"><g><g fill="none" stroke="#a855f7" strokeWidth="12"><path strokeLinecap="round" d="M151.8 144.5a74 74 0 0 1-85.59 19.21A74 74 0 0 1 22.42 87.7a74 74 0 0 1 59.55-64.42m28.03.06a74 74 0 0 1 50.06 35.61 74 74 0 0 1 5.915 61.15"></path><path d="M76 92h40c4.432 0 8 3.568 8 8v22c0 4.432-3.568 8-8 8H76c-4.432 0-8-3.568-8-8v-22c0-4.432 3.568-8 8-8zm4 0V77.7C80 69.029 87.163 62 96 62s16 7.029 16 15.7V92"></path></g></g></svg>) },
          { label: 'Sign Out', icon: (<svg className="w-6 h-6 text-red-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 4L17.5 4C20.5577 4 20.5 8 20.5 12C20.5 16 20.5577 20 17.5 20H14M3 12L15 12M3 12L7 8M3 12L7 16" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></svg>) },
        ].map((opt, idx) => {
          // Map label to route
          const routes: Record<string, string> = {
            'Favourites': '/favourites',
            'Order History': '/myorders',
            'Order Points': '/profile/points',
            'Settings': '/settings',
            'Help & Support': '/footeroptions/help',
            'Terms & Conditions': '/footeroptions/terms',
            'About Us': '/footeroptions/aboutus',
            'Privacy Policy': '/footeroptions/privacy',
          };
          const handleClick = () => {
            if (opt.label === 'Sign Out') {
              localStorage.removeItem('hotdrop_user');
              router.push('/signin');
            } else {
              const route = routes[opt.label as keyof typeof routes];
              if (typeof route === 'string') {
                router.push(route);
              }
            }
          };
          if (opt.label === 'Sign Out') {
            return (
              <button
                key={opt.label}
                className="w-full flex items-center justify-center bg-white rounded-xl shadow border border-orange-100 px-4 py-4 transition hover:bg-orange-50"
                onClick={handleClick}
              >
                <span className="flex items-center justify-center w-full">
                  <span className="w-10 h-10 flex items-center justify-center rounded-lg bg-orange-50 mr-4">
                    {opt.icon}
                  </span>
                  <span className="text-base md:text-lg font-semibold text-gray-700 text-center">{opt.label}</span>
                </span>
              </button>
            );
          }
          return (
            <button
              key={opt.label}
              className="w-full flex items-center justify-between bg-white rounded-xl shadow border border-orange-100 px-4 py-4 transition hover:bg-orange-50"
              onClick={handleClick}
            >
              <span className="flex items-center">
                <span className="w-10 h-10 flex items-center justify-center rounded-lg bg-orange-50 mr-4">
                  {opt.icon}
                </span>
                <span className="text-base md:text-lg font-semibold text-gray-700">{opt.label}</span>
              </span>
              <span>
                <svg className="w-5 h-5 text-orange-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
