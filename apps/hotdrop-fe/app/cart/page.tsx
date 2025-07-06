"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const foodHeading = searchParams.get("food") || "Your Cart";

  useEffect(() => {
    // Example: fetch cart from localStorage or API
    const stored = localStorage.getItem("hotdrop_cart");
    if (stored) {
      setCart(JSON.parse(stored));
      // Auto-restore selected shop if missing and all items are from the same shop
      const selectedShop = localStorage.getItem("hotdrop_selected_shop");
      if (!selectedShop) {
        try {
          const arr = JSON.parse(stored);
          // If all items have the same shopId, restore it
          if (arr.length > 0 && arr[0].shopId) {
            const shopId = arr[0].shopId;
            // Try to find shop info from previous partner or fallback
            let shopInfo = null;
            // Try hotdrop_partner
            const legacy = localStorage.getItem("hotdrop_partner");
            if (legacy) {
              const legacyObj = JSON.parse(legacy);
              if (legacyObj.id === shopId) shopInfo = legacyObj;
            }
            // If not found, just use the info from the cart item
            if (!shopInfo) {
              shopInfo = {
                id: arr[0].shopId,
                name: arr[0].shopName || arr[0].name,
                shopname: arr[0].shopName || arr[0].name,
                image: arr[0].shopImage,
              };
            }
            localStorage.setItem("hotdrop_selected_shop", JSON.stringify(shopInfo));
          }
        } catch {}
      }
    }
    setLoading(false);
  }, []);

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) => {
      const updated = prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
      );
      localStorage.setItem("hotdrop_cart", JSON.stringify(updated));
      return updated;
    });
  };

  const removeItem = (id: string) => {
    setCart((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      localStorage.setItem("hotdrop_cart", JSON.stringify(updated));
      return updated;
    });
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-r from-white via-orange-100 to-orange-200 flex flex-col items-center pt-8 px-4">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-8 mb-8 border border-orange-200">
        <div className="flex items-center gap-4 mb-8">
          <img src="/logo.png" alt="Logo" className="w-12 h-12 rounded" />
          <h1 className="text-3xl font-extrabold text-orange-500">{foodHeading}</h1>
        </div>
        {loading ? (
          <div className="text-center text-gray-500 py-12">Loading...</div>
        ) : cart.length === 0 ? (
          <div className="text-center text-gray-500 py-12 text-lg">Your cart is empty 🛒</div>
        ) : (
          <div className="flex flex-col gap-6">
            {cart.map((item) => (
              <div key={item.id} className="flex flex-col md:flex-row items-center justify-between gap-4 bg-orange-50 rounded-lg p-4 border border-orange-100 shadow-sm">
                <div className="flex items-center gap-4 w-full md:w-1/2">
                  <img src={item.image.startsWith("/images/") ? `http://localhost:3001${item.image}` : item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg border border-orange-200" />
                  <div>
                    <div className="font-bold text-lg text-gray-800">{item.name}</div>
                    <div className="text-orange-500 font-semibold text-base">₹{item.price}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button className="bg-orange-200 text-orange-700 rounded-full w-8 h-8 flex items-center justify-center text-xl font-bold hover:bg-orange-300" onClick={() => updateQuantity(item.id, -1)}>-</button>
                  <span className="font-semibold text-lg text-gray-700">{item.quantity}</span>
                  <button className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-xl font-bold hover:bg-orange-600" onClick={() => updateQuantity(item.id, 1)}>+</button>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="font-bold text-lg text-gray-800">₹{item.price * item.quantity}</div>
                  <button className="text-red-500 hover:text-red-700 text-xs font-bold border border-red-200 rounded px-3 py-1 transition-colors duration-200" onClick={() => removeItem(item.id)}>Remove</button>
                </div>
              </div>
            ))}
          </div>
        )}
        {/* Cart Summary */}
        {cart.length > 0 && (
          <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-6 border-t pt-8">
            <div className="text-xl font-bold text-gray-800">Total: <span className="text-orange-500">₹{total}</span></div>
            <button
              className="bg-orange-500 text-white px-8 py-3 rounded-full text-lg font-bold shadow hover:bg-orange-600 transition-colors duration-300 flex items-center gap-2"
              onClick={async () => {
                // Get user and partner info from localStorage
                const user = JSON.parse(localStorage.getItem("hotdrop_user") || "null");
                // Use selected shop info instead of hotdrop_partner
                let partner = JSON.parse(localStorage.getItem("hotdrop_selected_shop") || "null");
                // Fallback: if not found, try hotdrop_partner (legacy)
                if (!partner || !partner.id) {
                  partner = JSON.parse(localStorage.getItem("hotdrop_partner") || "null");
                }
                // Debug: log what is found
                if (!partner) {
                  console.error("No partner/shop found in localStorage", {
                    hotdrop_selected_shop: localStorage.getItem("hotdrop_selected_shop"),
                    hotdrop_partner: localStorage.getItem("hotdrop_partner")
                  });
                } else {
                  console.log("Using partner/shop for order:", partner);
                }
                if (!user || !user.id) {
                  alert("User ID missing. Please log in again to place an order.");
                  return;
                }
                if (!partner || !partner.id) {
                  alert("No partner selected for this order. Please go to a shop and add items again.");
                  return;
                }
                // Prepare order data
                const orderData = {
                  userId: user.id, // Only send user.id, never email
                  partnerId: partner.id,
                  items: cart.map(item => `${item.name} x${item.quantity}`).join(", "),
                  shopName: partner.name || partner.shopname || "",
                  price: total
                };
                
                const res = await fetch("http://localhost:3001/order", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(orderData)
                });
                
                if (res.ok) {
                  localStorage.removeItem("hotdrop_cart");
                  setCart([]);
                  alert("Order placed successfully!");
                  router.push("/myorders");
                } else {
                  const data = await res.json();
                  alert(data.error || "Failed to place order");
                }
              }}
            >
              <span role="img" aria-label="rocket">🚀</span> Checkout
            </button>
          </div>
        )}
        <div className="mt-8 flex justify-center">
          <button className="bg-orange-100 text-orange-500 px-6 py-2 rounded-full font-semibold hover:bg-orange-200 transition-colors duration-200" onClick={() => router.push("/")}>Continue Shopping</button>
        </div>
      </div>
    </div>
  );
}
