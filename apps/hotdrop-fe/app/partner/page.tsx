"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

// WaterLoader: animated water fill loader like your loader.tsx
function WaterLoader() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-screen bg-gradient-to-r from-white via-red-200 to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
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
  const [showNotificationPrompt, setShowNotificationPrompt] = useState(false);
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
          // Show notification prompt if verified and not already handled
          if (data.verified === true) {
            // Only show if not already granted/denied in this session
            if (typeof window !== 'undefined' && Notification && Notification.permission === 'default') {
              setShowNotificationPrompt(true);
            }
          }
        } else {
          setVerificationStatus(null);
          console.error('Verification status fetch failed:', res.status, await res.text());
        }
      } catch (err) {
        setVerificationStatus(null);
        console.error('Error fetching verification status:', err);
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
        } else {
          console.error('Items fetch failed:', res.status, await res.text());
        }
      } catch (err) {
        console.error('Error fetching items:', err);
      }
      setLoading(false);
    };
    fetchItems();
  }, [router]);

  // Removed useEffect for /partner/notifications/count (endpoint does not exist)

  useEffect(() => {
    // Fetch notification count (pending orders) for badge
    const partner = localStorage.getItem("hotdrop_partner");
    if (!partner) {
      setNotificationCount(0);
      return;
    }
    const { id, shopname } = JSON.parse(partner);
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/orders/orders?partnerId=${encodeURIComponent(id)}`)
      .then(async res => {
        if (!res.ok) {
          console.error('Orders fetch failed:', res.status, await res.text());
          return { orders: [] };
        }
        return res.json();
      })
      .then(data => {
        const pending = (data.orders || []).filter((order: any) => order.shopName === shopname && order.status === 'pending' || /^\d+min$/.test(order.status));
        setNotificationCount(pending.length);
      })
      .catch(err => {
        console.error('Error fetching orders:', err);
      });
  }, []);

  useEffect(() => {
    // Fetch shop name from backend (correct endpoint)
    const fetchShopName = async () => {
      try {
        const partner = localStorage.getItem("hotdrop_partner");
        if (!partner) return;
        const { id: partnerId } = JSON.parse(partner);
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/partner?id=${partnerId}`);
        if (res.ok) {
          const data = await res.json();
          setShopName(data.shopname || "");
        } else {
          console.error('Shop name fetch failed:', res.status, await res.text());
        }
      } catch (err) {
        console.error('Error fetching shop name:', err);
      }
    };
    fetchShopName();
  }, []);

  useEffect(() => {
    // Fetch profile/shopname from backend (correct endpoint)
    const fetchProfile = async () => {
      try {
        const partner = localStorage.getItem("hotdrop_partner");
        if (!partner) return;
        const { id: partnerId } = JSON.parse(partner);
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/partner?id=${partnerId}`);
        if (res.ok) {
          const data = await res.json();
          setProfile({ shopname: data.shopname });
        } else {
          console.error('Profile fetch failed:', res.status, await res.text());
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      }
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

  // Notification permission handler
  const handleNotificationPermission = async () => {
    if (!('Notification' in window)) {
      alert('This browser does not support notifications.');
      setShowNotificationPrompt(false);
      return;
    }
    try {
      const permission = await Notification.requestPermission();
      setShowNotificationPrompt(false);
      if (permission === 'granted') {
        // Register the service worker for push notifications
        if ('serviceWorker' in navigator) {
          try {
            await navigator.serviceWorker.register('/sw.js');
            const reg = await navigator.serviceWorker.ready;
            console.log('Service Worker ready:', reg);
            // Subscribe for push notifications
            const partner = localStorage.getItem('hotdrop_partner');
            if (!partner) return;
            const { id: partnerId } = JSON.parse(partner);
            const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
            if (!vapidPublicKey) {
              alert('VAPID public key not found.');
              return;
            }
            // Convert VAPID key to Uint8Array
            function urlBase64ToUint8Array(base64String: string) {
              const padding = '='.repeat((4 - base64String.length % 4) % 4);
              const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
              const rawData = window.atob(base64);
              const outputArray = new Uint8Array(rawData.length);
              for (let i = 0; i < rawData.length; ++i) {
                outputArray[i] = rawData.charCodeAt(i);
              }
              return outputArray;
            }
            try {
              const subscription = await reg.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
              });
              // Send subscription to backend
              await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/partner/push-subscription`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ partnerId, subscription })
              });
              console.log('Push subscription sent to backend');
            } catch (err) {
              console.error('Push subscription failed:', err);
            }
          } catch (err) {
            console.error('Service Worker registration/ready failed:', err);
          }
        }
      }
    } catch {
      setShowNotificationPrompt(false);
    }
  };

  // Error and loading fallback
  if (loading) {
    return <WaterLoader />;
  }

  // Notification Permission Prompt Card
  if (verificationStatus === true && showNotificationPrompt) {
    return (
      <>
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md flex flex-col items-center relative animate-fadeIn">
            <img src="/logo.png" alt="HotDrop Logo" className="w-16 h-16 mb-4 rounded-full shadow" />
            <h2 className="text-2xl font-bold text-orange-600 mb-2 text-center">Enable Order Notifications</h2>
            <p className="text-gray-700 text-center mb-6">Stay updated! Allow notifications to get instant alerts when you receive new orders, even when HotDrop is closed.</p>
            <button
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-2 rounded-full transition-all text-lg shadow-lg"
              onClick={handleNotificationPermission}
            >
              Enable Notifications
            </button>
            <button
              className="mt-4 text-gray-400 hover:text-gray-700 text-sm underline"
              onClick={() => setShowNotificationPrompt(false)}
            >
              Maybe later
            </button>
          </div>
          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; transform: scale(0.95); }
              to { opacity: 1; transform: scale(1); }
            }
            .animate-fadeIn {
              animation: fadeIn 0.3s ease;
            }
          `}</style>
        </div>
      </>
    );
  }

  if (verificationStatus === false) {
    return (
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
    );
  }

  // Main dashboard UI
  return (
    <>
        <div className={
          (showModal ?
            "min-h-screen flex flex-col items-center justify-start pt-2 p-6 bg-gradient-to-r from-white via-red-200 to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 filter blur-sm"
            :
            "min-h-screen flex flex-col items-center justify-start pt-2 p-6 bg-gradient-to-r from-white via-red-200 to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900"
          )
        }>
          {/* Navbar */}
          <nav className="w-full max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 py-6">
            {/* Left side: Logo + Shop name on mobile */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
              <div className="flex items-center gap-3">
                <motion.img
                  src="/logo.png"
                  alt="Logo"
                  className="w-10 h-10 rounded"
                  initial={{ y: -60, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 120, damping: 18, duration: 1.2 }}
                />
                {/* Show shop name only on mobile */}
                <div className="block md:hidden">
                  <ShopNameSubheading />
                </div>
                {/* Show site heading only on desktop */}
                <motion.div
                  className="hidden md:block text-3xl font-extrabold text-gray-800 dark:text-white"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 180, delay: 0.2, duration: 0.7 }}
                >
                  HotDrop
                </motion.div>
              </div>

              {/* Dashboard button on far right for mobile */}
              <div className="md:hidden ml-auto">
                <button
                  className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-1.5 rounded text-sm font-semibold"
                  onClick={() => router.push("/partner/dashboard")}
                >
                  Dashboard
                </button>
              </div>
            </div>

            {/* Right side: Shop name and Dashboard for desktop */}
            <div className="hidden md:flex items-center gap-4 w-full md:w-auto md:mt-0">
              <ShopNameSubheading />
              <button
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded hover:bg-orange-600 transition-colors duration-300 text-lg font-semibold"
                onClick={() => router.push("/partner/dashboard")}
              >
                Dashboard
              </button>
            </div>
          </nav>

          {/* Heading - force line break on small screens */}
          <h1 className="text-3xl md:text-5xl font-extrabold text-center text-gray-900 dark:text-gray-100 md:mt-8 mb-4">
            Welcome Partner!
            <br className="block md:hidden" />
            <span className="text-2xl md:text-5xl text-orange-500 dark:text-orange-300"> Now sell the best of yours</span>
          </h1>

          {/* Button + Bell Layout */}
          <div className="w-full flex flex-row items-center justify-center md:gap-4 mb-8">
            {/* Add Item Button */}
            <button
              className="bg-black dark:bg-gray-800 text-white dark:text-gray-100 px-6 py-2 rounded text-lg font-semibold hover:bg-black/80 dark:hover:bg-gray-700 transition-colors duration-300 w-4xl "
              onClick={() => setShowModal(true)}
            >
              + Add Item
            </button>
            <button
                className="ml-8 flex items-center justify-center w-12 h-12 rounded-full bg-white dark:bg-gray-800 border border-orange-200 dark:border-gray-700 text-2xl shadow hover:bg-orange-50 dark:hover:bg-gray-700 transition-colors duration-200 relative"
                title="Notifications"
                onClick={() => router.push('/partner/dashboard#notification-section')}
              >
                <span role="img" aria-label="bell">🔔</span>
                {notificationCount > 0 && (
                  <span style={{position:'absolute',top:'-6px',right:'-6px',zIndex:2}} className="bg-orange-500 dark:bg-orange-700 text-white dark:text-gray-100 text-xs font-bold rounded-full px-1.5 py-0.5 min-w-[20px] text-center border border-white dark:border-gray-900 notification-glow">
                    {notificationCount}
                  </span>
                )}
            </button>
          </div>

          {/* Item cards */}
          {loading ? (
            <div className="flex justify-center items-center min-h-[300px] w-full">
              <WaterLoader />
            </div>
          ) : (
            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-0 gap-y-4 items-start justify-center">
              {items.map((item, idx) => (
                <div key={idx} className="bg-gradient-to-r from-white via-red-200 to-blue-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-900 rounded shadow p-0 flex flex-col items-center w-72 h-72 mx-auto">
                  <img src={item.image.startsWith("/images/") ? `${process.env.NEXT_PUBLIC_BACKEND_API}${item.image}` : item.image} alt={item.name} className="w-full h-2/3 object-cover rounded-t" />
                  <div className="flex flex-col justify-between h-1/3 w-full p-4">
                    <div className="flex items-center justify-between w-full">
                      <div className="font-bold text-lg text-gray-900 dark:text-gray-100 truncate">{item.name}</div>
                      <button
                        className={
                          (item.available ? "bg-green-500 dark:bg-green-700" : "bg-gray-400 dark:bg-gray-700") +
                          " text-white dark:text-gray-100 px-3 py-1 rounded-full text-xs font-semibold ml-2 transition-colors duration-200"
                        }
                        onClick={() => toggleAvailability(idx)}
                      >
                        {item.available ? "Available" : "Not Available"}
                      </button>
                    </div>
                    <div className="flex items-center justify-between w-full mt-2">
                      <div className="text-orange-500 dark:text-orange-300 font-semibold text-xl">₹{item.price}</div>
                      <button
                        className="ml-2 text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-sm font-bold border border-red-500 dark:border-red-400 rounded px-3 py-1 transition-colors duration-200"
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
      {showModal && <AddItemModal onClose={() => setShowModal(false)} onAdd={handleAddItem} />}
      {/* Add glowing effect for notification badge */}
      <style jsx global>{`
        .glow-badge {
          box-shadow: 0 0 2px 2px #fb923c, 0 0 16px 4px #fb923c66;
          animation: glow-badge-anim 1.2s ease-in-out infinite alternate;
        }
        @keyframes glow-badge-anim {
          0% { box-shadow: 0 0 2px 2px #fb923c, 0 0 16px 4px #fb923c66; }
          100% { box-shadow: 0 0 6px 6px #fb923c, 0 0 32px 12px #fb923c44; }
        }
        .notification-glow {
          box-shadow: 0 0 2px 2px #fb923c, 0 0 16px 4px #fb923c66;
          animation: notification-glow-pulse 1.5s ease-in-out infinite alternate;
        }
        @keyframes notification-glow-pulse {
          0% {
            box-shadow: 0 0 2px 2px #fb923c, 0 0 16px 4px #fb923c66;
          }
          100% {
            box-shadow: 0 0 6px 6px #fb923c, 0 0 32px 12px #fb923c44;
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
      <div className="bg-white dark:bg-gray-900 p-8 rounded shadow-lg w-full max-w-md flex flex-col items-center relative">
        <button className="absolute top-2 right-2 text-gray-500 dark:text-gray-300 hover:text-black dark:hover:text-white text-2xl" onClick={onClose}>&times;</button>
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Add Item</h2>
        <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit} encType="multipart/form-data">
          <input
            type="text"
            placeholder="Item Name"
            value={itemName}
            onChange={e => setItemName(e.target.value)}
            className="border border-gray-300 dark:border-gray-700 p-2 rounded w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            required
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="border border-gray-300 dark:border-gray-700 p-2 rounded w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            required
          />
          {preview && <img src={preview} alt="Preview" className="w-24 h-24 object-cover rounded mx-auto" />}
          <input
            type="number"
            placeholder="Price"
            value={itemPrice}
            onChange={e => setItemPrice(e.target.value)}
            className="border border-gray-300 dark:border-gray-700 p-2 rounded w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            required
          />
          {error && <div className="text-red-500 dark:text-red-300 text-sm">{error}</div>}
          <button type="submit" className="bg-orange-500 dark:bg-orange-700 text-white dark:text-gray-100 px-4 py-2 rounded-full text-sm hover:bg-orange-600 dark:hover:bg-orange-800 font-semibold" disabled={loading}>
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
        className="text-lg md:text-xl font-bold text-black dark:text-gray-100 focus:outline-none"
        onClick={() => setShowDropdown((v) => !v)}
      >
        {shopname}
      </button>
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded shadow-lg z-50">
          <button
            className="block w-full text-left px-4 py-2 text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
