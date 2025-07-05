"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function PartnerHome() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [items, setItems] = useState<Array<{ id: string; name: string; image: string; price: string; available?: boolean }>>([]);

  useEffect(() => {
    // Check for partner auth in localStorage
    const partner = localStorage.getItem("hotdrop_partner");
    if (!partner) {
      router.replace("/partner/signup");
      return;
    }
    // Fetch items from backend for this partner
    const { id: partnerId } = JSON.parse(partner);
    const fetchItems = async () => {
      try {
        const res = await fetch(`http://localhost:3001/partner/items?partnerId=${partnerId}`);
        if (res.ok) {
          const data = await res.json();
          setItems(data.items);
        }
      } catch {}
    };
    fetchItems();
  }, [router]);

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
    // Send update to backend
    try {
      const res = await fetch(`http://localhost:3001/partner/items/${item.id}/availability`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ available: !item.available }),
      });
      if (!res.ok) {
        // Revert UI if backend fails
        setItems(items);
        alert("Failed to update availability");
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
      const res = await fetch(`http://localhost:3001/partner/items/${item.id}`, {
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
            <img
              src="/logo.png"
              alt="Logo"
              className="w-10 h-10 rounded"
            />
            <div className="text-3xl font-extrabold text-gray-800">HotDrop</div>
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
        <div className="w-full flex flex-col items-center justify-center mb-8">
          <button className="bg-black text-white px-6 py-2 rounded-full text-lg font-semibold hover:bg-black/80 transition-colors duration-300 w-full max-w-xs" onClick={() => setShowModal(true)}>
            + Add Item
          </button>
        </div>
        {/* Item cards */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-0 gap-y-4 items-start justify-center">
          {items.map((item, idx) => (
            <div key={idx} className="bg-white rounded shadow p-0 flex flex-col items-center w-72 h-72 mx-auto">
              <img src={item.image.startsWith("/images/") ? `http://localhost:3001${item.image}` : item.image} alt={item.name} className="w-full h-2/3 object-cover rounded-t" />
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
      </div>
      {showModal && <AddItemModal onClose={() => setShowModal(false)} onAdd={handleAddItem} />}
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
    if (!itemName || !itemImage || !itemPrice) return;
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
      const res = await fetch("http://localhost:3001/partner/items", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to add item");
        setLoading(false);
        return;
      }
      const data = await res.json();
      onAdd({ id: data.item.id, name: data.item.name, image: data.item.image, price: data.item.price });
      setLoading(false);
      onClose();
    } catch (err) {
      setError("Failed to add item");
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
