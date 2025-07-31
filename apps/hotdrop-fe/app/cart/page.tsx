

"use client";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PhoneFooter from "../../components/PhoneFooter";

// Utility to remove null bytes from strings
function sanitizeString(str: string) {
  return typeof str === "string" ? str.replace(/\0/g, "") : str;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export default function CartPage() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-white via-orange-100 to-orange-200 flex flex-col items-center pt-8 px-4 pb-24">
      <div className="w-full max-w-4xl mx-auto flex items-center justify-between mb-8 px-0 md:px-4 py-3 bg-white/80 rounded-xl shadow border border-orange-200">
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
          <img src="/logo.png" alt="HotDrop Logo" className="w-10 h-10 md:w-14 md:h-14" />
          <h1 className="text-xl md:text-3xl font-bold text-orange-500 drop-shadow-sm whitespace-nowrap">Your Cart</h1>
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
      <Suspense fallback={<div className="text-center text-gray-500 py-12">Loading...</div>}>
        <CartContent />
      </Suspense>
      <div className="md:hidden">
        <PhoneFooter />
      </div>
    </div>
  );
}

function CartContent() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  // Heading is now in nav, so only use foodHeading for accessibility if needed
  // const foodHeading = searchParams.get("food") || "Your Cart";

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
            let shopInfo = null;
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
    <div className="min-h-screen  flex flex-col items-center pt-4 px-4">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-8 mb-8 border border-orange-200">
        {loading ? (
          <div className="text-center text-gray-500 py-12">Loading...</div>
        ) : cart.length === 0 ? (
          <div className="text-center text-gray-500 py-12 text-lg">Your cart is empty 🛒</div>
        ) : (
          <div className="flex flex-col gap-6">
            {cart.map((item) => (
              <div key={item.id} className="flex flex-col md:flex-row items-center justify-between gap-4 bg-orange-50 rounded-lg p-4 border border-orange-100 shadow-sm">
                <div className="flex items-center gap-4 w-full md:w-1/2">
                  <img src={item.image.startsWith("/images/") ? `${process.env.NEXT_PUBLIC_BACKEND_API}${item.image}` : item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg border border-orange-200" />
                  <div>
                    <div className="font-bold text-lg text-gray-800">{item.name}</div>
                    <div className="text-orange-500 font-semibold text-base">₹{item.price}</div>
                  </div>
                </div>
                {/* Controls Row: plus, minus, price, remove */}
                <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                  <button className="bg-orange-200 text-orange-700 rounded-full w-8 h-8 flex items-center justify-center text-xl font-bold hover:bg-orange-300" onClick={() => updateQuantity(item.id, -1)}>-</button>
                  <span className="font-semibold text-lg text-gray-700">{item.quantity}</span>
                  <button className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-xl font-bold hover:bg-orange-600" onClick={() => updateQuantity(item.id, 1)}>+</button>
                  <div className="font-bold text-lg text-gray-800 ml-2">₹{item.price * item.quantity}</div>
                  <button className="text-red-500 hover:text-red-700 text-xs font-bold border border-red-200 rounded px-3 py-1 transition-colors duration-200 ml-2" onClick={() => removeItem(item.id)}>Remove</button>
                </div>
              </div>
            ))}
          </div>
        )}
        {/* Cart Summary */}
        {cart.length > 0 && (
          <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-6 border-t pt-8 w-full">
            <div className="flex flex-col gap-2 w-full md:w-auto">
              <div className="flex items-center justify-between w-full md:w-72">
                <span className="text-gray-700 font-semibold">Subtotal</span>
                <span className="text-gray-800 font-bold">₹{total}</span>
              </div>
              <div className="flex items-center justify-between w-full md:w-72">
                <span className="text-gray-700 font-semibold">GST (3%)</span>
                <span className="text-gray-800 font-bold">₹{(total * 0.03).toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between w-full md:w-72">
                <span className="text-gray-700 font-semibold">Maintenance Fees</span>
                <span className="text-gray-800 font-bold">₹2.00</span>
              </div>
              <div className="flex items-center justify-between w-full md:w-72 mt-2 border-t pt-2">
                <span className="text-xl font-bold text-gray-800">Total</span>
                <span className="text-xl font-bold text-orange-500">₹{(total + total * 0.03 + 2).toFixed(2)}</span>
              </div>
            </div>
            <button
              className="bg-orange-500 text-white px-8 py-3 rounded-full text-lg font-bold shadow hover:bg-orange-600 transition-colors duration-300 flex items-center gap-2"
              onClick={async () => {
                // Get user and partner info from localStorage
                const user = JSON.parse(localStorage.getItem("hotdrop_user") || "null");
                let partner = JSON.parse(localStorage.getItem("hotdrop_selected_shop") || "null");
                console.log(user)
                if (!partner || !partner.id) {
                  partner = JSON.parse(localStorage.getItem("hotdrop_partner") || "null");
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
                  userId: sanitizeString(user.id),
                  partnerId: sanitizeString(partner.id),
                  items: sanitizeString(cart.map(item => `${sanitizeString(item.name)} x${item.quantity}`).join(", ")),
                  shopName: sanitizeString(partner.name || partner.shopname || ""),
                  price: sanitizeString((total + total * 0.03 + 2).toFixed(2))
                };
                // Razorpay integration
                const loadRazorpay = () => {
                  return new Promise((resolve) => {
                    //@ts-ignore
                    if (window.Razorpay) {
                      resolve(true);
                      return;
                    }
                    const script = document.createElement("script");
                    script.src = "https://checkout.razorpay.com/v1/checkout.js";
                    script.onload = () => resolve(true);
                    document.body.appendChild(script);
                  });
                };
                await loadRazorpay();
                const options = {
                  key: `${process.env.NEXT_PUBLIC_RAZORPAY_KEY}`,
                  amount: Math.round((total + total * 0.03 + 2) * 100), // Use total amount (subtotal + GST + maintenance fees) in paise
                  currency: "INR",
                  name: "HotDrop",
                  description: "Order Payment",
                  image: "/logo.png",
                  handler: async function (response: any) {
                    // On payment success, place order
                    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/orders/order`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(orderData)
                    });
                    if (res.ok) {
                      // Get orderId from response
                      const order = await res.json();
                      // Call split API
                      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/orders/order/split`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          orderId: order.id || order.orderId || "", // adapt to your backend response
                          partnerId: orderData.partnerId,
                          amount: Math.round((total + total * 0.03 + 2) * 100) // in paise
                        })
                      });
                      localStorage.removeItem("hotdrop_cart");
                      setCart([]);
                      alert("Order placed successfully!");
                      router.push("/myorders");
                    } else {
                      const data = await res.json();
                      alert(data.error || "Failed to place order");
                    }
                  },
                  prefill: {
                    name: user.name || "",
                    email: user.email || "",
                  },
                  theme: { color: "#fb923c" },
                };
                // @ts-ignore
                const rzp = new window.Razorpay(options);
                rzp.open();
              }}
            >
              <span role="img" aria-label="rocket">🚀</span> Pay Now
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
