"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

// WaterLoader: animated water fill loader like your loader.tsx
function WaterLoader() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-screen bg-gradient-to-r from-white via-red-200 to-blue-50">
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

export default function PartnerHome() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [items, setItems] = useState<Array<{ id: string; name: string; image: string; price: string; available?: boolean }>>([]);
  const [loading, setLoading] = useState(true);
  const [notificationCount, setNotificationCount] = useState(0);
  const [shopName, setShopName] = useState("");
  const [profile, setProfile] = useState<{ shopname: string } | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<null | boolean>(null);

  useEffect(() => {
    // Check for partner auth in localStorage
    const partner = localStorage.getItem("hotdrop_partner");
    if (!partner) {
      router.replace("/partner/signup");
      return;
    }
    // Fetch verification status for this partner
    const { id: partnerId } = JSON.parse(partner);
    const fetchVerification = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/partner/verification/status?partnerId=${partnerId}`);
        if (res.ok) {
          const data = await res.json();
          setVerificationStatus(data.verified === true);
        } else {
          setVerificationStatus(null);
        }
      } catch {
        setVerificationStatus(null);
      }
    };
    fetchVerification();
    // Fetch items from backend for this partner
    const fetchItems = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/partner/items?partnerId=${partnerId}`);
        if (res.ok) {
          const data = await res.json();
          setItems(data.items);
        }
      } catch {}
      setLoading(false);
    };
    fetchItems();
  }, [router]);

  useEffect(() => {
    // Fetch notification count from dashboard API
    const fetchNotifications = async () => {
      try {
        const partner = localStorage.getItem("hotdrop_partner");
        if (!partner) return;
        const { id: partnerId } = JSON.parse(partner);
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/partner/notifications/count?partnerId=${partnerId}`);
        if (res.ok) {
          const data = await res.json();
          setNotificationCount(data.count || 0);
        }
      } catch {}
    };
    fetchNotifications();
  }, []);

  useEffect(() => {
    // Fetch notification count (pending orders) for badge
    const partner = localStorage.getItem("hotdrop_partner");
    if (!partner) {
      setNotificationCount(0);
      return;
    }
    const { id, shopname } = JSON.parse(partner);
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/orders/orders?partnerId=${encodeURIComponent(id)}`)
      .then(res => res.json())
      .then(data => {
        const pending = (data.orders || []).filter((order: any) => order.shopName === shopname && order.status === 'pending' || /^\d+min$/.test(order.status));
        setNotificationCount(pending.length);
      });
  }, []);

  useEffect(() => {
    // Fetch shop name from backend
    const fetchShopName = async () => {
      try {
        const partner = localStorage.getItem("hotdrop_partner");
        if (!partner) return;
        const { id: partnerId } = JSON.parse(partner);
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/partner/profile?partnerId=${partnerId}`);
        if (res.ok) {
          const data = await res.json();
          setShopName(data.shopname || "");
        }
      } catch {}
    };
    fetchShopName();
  }, []);

  useEffect(() => {
    // Fetch profile/shopname from backend
    const fetchProfile = async () => {
      try {
        const partner = localStorage.getItem("hotdrop_partner");
        if (!partner) return;
        const { id: partnerId } = JSON.parse(partner);
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/partner/profile?partnerId=${partnerId}`);
        if (res.ok) {
          const data = await res.json();
          setProfile({ shopname: data.shopname });
        }
      } catch {}
    };
    fetchProfile();
  }, []);

  const handleAddItem = (item: { id: string; name: string; image: string; price: string }) => {
    setItems(prev => [...prev, { ...item, available: true }]);
  };

  const toggleAvailability = async (idx: number) => {
    const item = items[idx];
    if (!item) return;
    // Optimistically update UI
    const updated = items.map((it, i) =>
      i === idx ? { ...it, available: !it.available } : it
    );
    setItems(updated);
    // Send update to backend (PATCH to match backend route)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/partner/item/${item.id}/availability`, {
        method: "PATCH",
      });
      if (!res.ok) {
        // Revert UI if backend fails
        setItems(items);
        alert("Failed to update availability");
      } else {
        // Optionally update with backend response
        const data = await res.json();
        setItems((prev) => prev.map((it, i) => i === idx ? { ...it, available: data.item.available } : it));
      }
    } catch {
      setItems(items);
      alert("Failed to update availability");
    }
  };

  const handleDeleteItem = async (idx: number) => {
    const item = items[idx];
    if (!item) return;
    // Optimistically update UI
    const updated = items.filter((_, i) => i !== idx);
    setItems(updated);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/partner/item/${item.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        // Revert UI if backend fails
        setItems(items);
        alert("Failed to delete item");
      }
    } catch {
      setItems(items);
      alert("Failed to delete item");
    }
  };

  return (
    <>
      {verificationStatus === false ? (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-blue-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md mt-24 flex flex-col items-center">
            <h2 className="text-2xl font-bold text-orange-600 mb-4 text-center">Verification Pending</h2>
            <p className="text-gray-700 text-center mb-6">If you have filled out both the <a className="underline font-bold text-orange-500" href="/partner/bank">Bank details</a> and <a className="underline font-bold text-orange-500" href="/partner/verification">Verification</a> forms, please wait — the verification process will be completed within a few hours. You will be notified once it's approved.</p>
            <button
              className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-full transition-all text-lg"
              onClick={() => {
                localStorage.removeItem("hotdrop_partner");
                router.push("/");
              }}
            >
              Logout
            </button>
          </div>
        </div>
      ) : (
        <div className={
          (showModal ?
            "min-h-screen flex flex-col items-center justify-start pt-2 p-6 bg-gradient-to-r from-white via-red-200 to-blue-50 filter blur-sm"
            :
            "min-h-screen flex flex-col items-center justify-start pt-2 p-6 bg-gradient-to-r from-white via-red-200 to-blue-50"
          )
        }>
          {/* Navbar */}
          <nav className="w-full max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 py-6">
            <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-start">
              <motion.img
                src="/logo.png"
                alt="Logo"
                className="w-10 h-10 rounded"
                initial={{ y: -60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 120, damping: 18, duration: 1.2 }}
              />
              <motion.div
                className="text-3xl font-extrabold text-gray-800"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 180, delay: 0.2, duration: 0.7 }}
              >
                HotDrop
              </motion.div>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 w-full md:w-auto mt-2 md:mt-0">
              <ShopNameSubheading />
              <button className="bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600 transition-colors duration-300 text-lg font-semibold w-full md:w-auto"
                onClick={() => router.push("/partner/dashboard")}
              >
                Dashboard
              </button>
            </div>
          </nav>
          <h1 className="text-3xl md:text-5xl font-extrabold text-center text-gray-900 mt-12 mb-4">
            Welcome Partner!{" "}
            <span className="text-orange-500">Now sell the best of yours</span>
          </h1>
          <div className="w-full flex flex-col items-center justify-center mb-8 md:flex-row md:justify-center md:items-center md:gap-4">
            <button className="bg-black text-white px-6 py-2 rounded-full text-lg font-semibold hover:bg-black/80 transition-colors duration-300 w-full max-w-xs" onClick={() => setShowModal(true)}>
              + Add Item
            </button>
            <div className="relative flex items-center justify-center mt-4 md:mt-0 md:ml-4">
              <button
                className="flex items-center justify-center w-12 h-12 rounded-full bg-white border border-orange-200 text-2xl shadow hover:bg-orange-50 transition-colors duration-200"
                title="Notifications"
                onClick={() => router.push('/partner/dashboard#notification-section')}
              >
                <span role="img" aria-label="bell">🔔</span>
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5 min-w-[20px] text-center border border-white notification-glow">{notificationCount}</span>
                )}
              </button>
            </div>
          </div>
          {/* Item cards */}
          {loading ? (
            <div className="flex justify-center items-center min-h-[300px] w-full">
              <WaterLoader />
            </div>
          ) : (
            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-0 gap-y-4 items-start justify-center">
              {items.map((item, idx) => (
                <div key={idx} className="bg-gradient-to-r from-white via-red-200 to-blue-50 rounded shadow p-0 flex flex-col items-center w-72 h-72 mx-auto">
                  <img src={item.image.startsWith("/images/") ? `${process.env.NEXT_PUBLIC_BACKEND_API}${item.image}` : item.image} alt={item.name} className="w-full h-2/3 object-cover rounded-t" />
                  <div className="flex flex-col justify-between h-1/3 w-full p-4">
                    <div className="flex items-center justify-between w-full">
                      <div className="font-bold text-lg text-gray-900 truncate">{item.name}</div>
                      <button
                        className={
                          (item.available ? "bg-green-500" : "bg-gray-400") +
                          " text-white px-3 py-1 rounded-full text-xs font-semibold ml-2 transition-colors duration-200"
                        }
                        onClick={() => toggleAvailability(idx)}
                      >
                        {item.available ? "Available" : "Not Available"}
                      </button>
                    </div>
                    <div className="flex items-center justify-between w-full mt-2">
                      <div className="text-orange-500 font-semibold text-xl">₹{item.price}</div>
                      <button
                        className="ml-2 text-red-500 hover:text-red-700 text-sm font-bold border border-red-500 rounded px-3 py-1 transition-colors duration-200"
                        title="Delete"
                        onClick={() => handleDeleteItem(idx)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {showModal && <AddItemModal onClose={() => setShowModal(false)} onAdd={handleAddItem} />}
      {/* Add glowing effect for notification badge */}
      <style jsx global>{`
        .glow-badge {
          box-shadow: 0 0 8px 2px #fb923c, 0 0 16px 4px #fb923c66;
          animation: glow-badge-anim 1.2s ease-in-out infinite alternate;
        }
        @keyframes glow-badge-anim {
          0% { box-shadow: 0 0 8px 2px #fb923c, 0 0 16px 4px #fb923c66; }
          100% { box-shadow: 0 0 16px 6px #fb923c, 0 0 32px 12px #fb923c44; }
        }
        .notification-glow {
          box-shadow: 0 0 8px 2px #fb923c, 0 0 16px 4px #fb923c66;
          animation: notification-glow-pulse 1.5s ease-in-out infinite alternate;
        }
        @keyframes notification-glow-pulse {
          0% {
            box-shadow: 0 0 8px 2px #fb923c, 0 0 16px 4px #fb923c66;
          }
          100% {
            box-shadow: 0 0 16px 6px #fb923c, 0 0 32px 12px #fb923c44;
          }
        }
      `}</style>
    </>
  );
}

function AddItemModal({ onClose, onAdd }: { onClose: () => void; onAdd: (item: { id: string; name: string; image: string; price: string }) => void }) {
  const [itemName, setItemName] = useState("");
  const [itemImage, setItemImage] = useState<File | null>(null);
  const [itemPrice, setItemPrice] = useState("");
  const [preview, setPreview] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setItemImage(e.target.files[0]);
      setPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName || !itemImage || !itemPrice) {
      setError("All fields are required");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const partner = localStorage.getItem("hotdrop_partner");
      if (!partner) throw new Error("No partner info");
      const { id: partnerId } = JSON.parse(partner);
      const formData = new FormData();
      formData.append("name", itemName);
      formData.append("price", itemPrice);
      formData.append("image", itemImage);
      formData.append("partnerId", partnerId);
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/partner/items`, {
        method: "POST",
        body: formData,
      });
      let data;
      try {
        data = await res.json();
      } catch (err) {
        setError("Server error: Invalid response");
        setLoading(false);
        return;
      }
      if (!res.ok || !data.item) {
        setError(data?.error || "Failed to add item");
        setLoading(false);
        return;
      }
      onAdd({ id: data.item.id, name: data.item.name, image: data.item.image, price: data.item.price });
      setLoading(false);
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to add item");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white p-8 rounded shadow-lg w-full max-w-md flex flex-col items-center relative">
        <button className="absolute top-2 right-2 text-gray-500 hover:text-black text-2xl" onClick={onClose}>&times;</button>
        <h2 className="text-2xl font-bold mb-6">Add Item</h2>
        <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit} encType="multipart/form-data">
          <input
            type="text"
            placeholder="Item Name"
            value={itemName}
            onChange={e => setItemName(e.target.value)}
            className="border p-2 rounded w-full"
            required
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="border p-2 rounded w-full bg-white"
            required
          />
          {preview && <img src={preview} alt="Preview" className="w-24 h-24 object-cover rounded mx-auto" />}
          <input
            type="number"
            placeholder="Price"
            value={itemPrice}
            onChange={e => setItemPrice(e.target.value)}
            className="border p-2 rounded w-full"
            required
          />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button type="submit" className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm hover:bg-orange-600 font-semibold" disabled={loading}>
            {loading ? "Adding..." : "Add Item"}
          </button>
        </form>
      </div>
    </div>
  );
}

// Update ShopNameSubheading to be inline, bold, and black
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
