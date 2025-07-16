"use client";
import { useEffect, useState } from "react";

interface Order {
  id: string;
  items: string;
  shopName: string;
  price: number;
  dateTime: string;
  status: boolean;
}

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "My Orders | HotDrop";
    const user = JSON.parse(localStorage.getItem("hotdrop_user") || "null");
    if (!user || (!user.id && !user.email)) {
      setOrders([]);
      setLoading(false);
      return;
    }
    const userId = user.id || user.email;
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/orders/orders?userId=${encodeURIComponent(userId)}`)
      .then((res) => res.json())
      .then((data) => {
        setOrders(data.orders || []);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 py-10 px-4 flex flex-col items-center">
      <div className="w-full max-w-3xl flex items-center justify-between mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
          My Orders
        </h1>
        <button
          onClick={() => (window.location.href = "/")}
          className="ml-4 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl shadow transition-all font-semibold text-base flex items-center gap-2"
          title="Go to Home"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 12l9-9 9 9M4.5 10.5V21h15V10.5"
            />
          </svg>
          Home
        </button>
      </div>
      <div className="w-full max-w-3xl flex flex-col gap-6">
        {loading ? (
          <div className="text-center text-gray-500 py-12">Loading...</div>
        ) : orders.length === 0 ? (
          <div className="text-center text-gray-500 py-12 text-lg">
            No orders to display.
          </div>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-xl shadow-lg flex flex-col md:flex-row items-center justify-between px-8 py-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-4 w-full">
                <div className="font-bold text-lg text-gray-700">
                  Order #{order.id.slice(-4)}
                </div>
                <div className="text-gray-500 text-base">
                  Items: {order.items}
                </div>
                <div className="text-green-600 font-semibold text-base">
                  Total: ₹{order.price}
                </div>
                <div className="text-blue-500 text-base">
                  Status: {order.status ? "Taken" : (() => {
                    if (typeof window !== 'undefined') {
                      const timer = localStorage.getItem(`hotdrop_timer_${order.id}`);
                      return timer ? `${timer} min` : "Pending";
                    }
                    return "Pending";
                  })()}
                </div>
                <div className="text-gray-400 text-xs">
                  Placed:{" "}
                  {new Date(order.dateTime).toLocaleString()}
                </div>
                <div className="text-orange-500 text-xs font-semibold">
                  Shop: {order.shopName}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
