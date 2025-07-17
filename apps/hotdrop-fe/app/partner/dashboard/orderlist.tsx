import React, { useEffect, useState } from "react";

interface Order {
  id: string;
  items: string;
  shopName: string;
  price: number;
  dateTime: string;
  status: string;
  userId: string;
}

export default function OrderListSection() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const partner = localStorage.getItem("hotdrop_partner");
    if (!partner) {
      setOrders([]);
      setLoading(false);
      return;
    }
    const { id } = JSON.parse(partner);
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/orders/orders?partnerId=${encodeURIComponent(id)}`)
      .then((res) => res.json())
      .then((data) => {
        // Show orders that are either taken or cancelled
        setOrders((data.orders || []).filter((order: Order) => order.status === 'taken' || order.status === 'cancelled'));
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="w-full max-w-4xl flex flex-col gap-6">
      {loading ? (
        <div className="text-center text-gray-500 py-12">Loading...</div>
      ) : orders.length === 0 ? (
        <div className="text-center text-gray-500 py-12 text-lg">No orders to display.</div>
      ) : (
        orders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-xl shadow-lg flex flex-col md:flex-row items-center justify-between px-8 py-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex flex-col md:flex-row md:items-center gap-4 w-full">
              <div className="font-bold text-lg text-gray-700">Order #{order.id.slice(-4)}</div>
              <div className="text-gray-500 text-base">Items: {order.items}</div>
              <div className="text-green-600 font-semibold text-base">Total: ₹{order.price}</div>
              <div className="text-blue-500 text-base">Status: {
                order.status === 'taken' ? 'Taken'
                : order.status === 'cancelled' ? 'Cancelled'
                : order.status
              }</div>
              <div className="text-gray-400 text-xs">Placed: {new Date(order.dateTime).toLocaleString()}</div>
              <div className="text-orange-500 text-xs font-semibold">Shop: {order.shopName}</div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
