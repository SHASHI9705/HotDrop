import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

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
  const [visibleCount, setVisibleCount] = useState(9);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const fetchRef = useRef<() => void>(() => {});
  const router = useRouter();

  const fetchOrderList = () => {
    setLoading(true);
    const partner = localStorage.getItem("hotdrop_partner");
    if (!partner) {
      setAllOrders([]);
      setOrders([]);
      setLoading(false);
      return;
    }
    const { id } = JSON.parse(partner);
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/orders/orders?partnerId=${encodeURIComponent(id)}`)
      .then((res) => res.json())
      .then((data) => {
        const filtered = (data.orders || []).filter((order: Order) => order.status === 'taken' || order.status === 'cancelled');
        setAllOrders(filtered);
        setOrders(filtered.slice(0, visibleCount));
      })
      .finally(() => setLoading(false));
  };
  fetchRef.current = fetchOrderList;

  useEffect(() => {
    fetchRef.current();
    const interval = setInterval(() => {
      fetchRef.current();
    }, 180000); // 60 seconds
    return () => clearInterval(interval);
  }, []);

  // When visibleCount changes, update orders
  useEffect(() => {
    setOrders(allOrders.slice(0, visibleCount));
  }, [visibleCount, allOrders]);

  return (
    <div className="w-full max-w-4xl flex flex-col gap-6">
      {loading ? (
        <div className="text-center text-gray-500 dark:text-gray-300 py-12">Loading...</div>
      ) : orders.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-300 py-12 text-lg">No orders to display.</div>
      ) : (
        <>
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg flex flex-col md:flex-row items-center justify-between px-8 py-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-4 w-full">
                <div className="font-bold text-lg text-gray-700 dark:text-gray-100">Order #{order.id.slice(-4)}</div>
                <div className="text-gray-500 dark:text-gray-300 text-base">Items: {order.items}</div>
                <div className="text-green-600 dark:text-green-400 font-semibold text-base">Total: ₹{order.price}</div>
                <div className="text-blue-500 dark:text-blue-300 text-base">Status: {
                  order.status === 'taken' ? 'Taken'
                  : order.status === 'cancelled' ? 'Cancelled'
                  : order.status
                }</div>
                <div className="text-gray-400 dark:text-gray-300 text-xs">Placed: {new Date(order.dateTime).toLocaleString()}</div>
                <div className="text-orange-500 dark:text-orange-300 text-xs font-semibold">Shop: {order.shopName}</div>
              </div>
            </div>
          ))}
          <div className="flex flex-row justify-center gap-4 mt-6">
            {visibleCount < allOrders.length && (
              <button
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white font-bold py-2 px-6 rounded-lg shadow transition"
                onClick={() => setVisibleCount(v => v + 9)}
              >
                Load More
              </button>
            )}
            <button
              className="bg-red-600 hover:bg-gray-300 text-white font-bold py-2 px-6 rounded-lg shadow transition hover:bg-red-700"
              onClick={() => {
                localStorage.removeItem('hotdrop_partner');
                router.push('/partner/signup');
              }}
            >
              Logout
            </button>
          </div>
        </>
      )}
    </div>
  );
}
