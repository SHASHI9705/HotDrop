import React, { useEffect, useState } from 'react';

interface Order {
  id: string;
  items: string;
  shopName: string;
  price: number;
  dateTime: string;
  status: boolean;
  userId: string;
}

export default function NotificationSection() {
  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingOrders();
    // eslint-disable-next-line
  }, []);

  const fetchPendingOrders = () => {
    const partner = localStorage.getItem("hotdrop_partner");
    if (!partner) {
      setPendingOrders([]);
      setLoading(false);
      return;
    }
    const { id, shopname } = JSON.parse(partner);
    // Fetch all orders for this partner
    fetch(`http://localhost:3001/orders?partnerId=${encodeURIComponent(id)}`)
      .then(res => res.json())
      .then(data => {
        // Only show pending orders for this shop
        const orders = (data.orders || []).filter((order: Order) => order.shopName === shopname && order.status === false);
        setPendingOrders(orders);
      })
      .finally(() => setLoading(false));
  };

  const markAsDelivered = async (orderId: string) => {
    setLoading(true);
    await fetch(`http://localhost:3001/order/${orderId}/delivered`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: true })
    });
    fetchPendingOrders();
  };

  return (
    <div id="notification-section" className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
      <div className="font-bold text-lg text-gray-700 mb-4">Latest Order Notification</div>
      {loading ? (
        <div className="text-gray-500">Loading...</div>
      ) : pendingOrders.length === 0 ? (
        <div className="text-gray-500">No pending orders.</div>
      ) : (
        <div className="flex flex-col gap-4">
          {pendingOrders.map(order => (
            <div key={order.id} className="flex flex-row items-center gap-4 bg-orange-50 border border-orange-200 rounded-xl p-4">
              <div className="bg-orange-100 text-orange-700 px-4 py-2 rounded-full font-semibold">New Order</div>
              <div className="text-gray-700 flex-1">
                Order #{order.id.slice(-4)} for <span className="font-bold">₹{order.price}</span> - <span className="text-yellow-600">Pending</span>
                <div className="text-xs text-gray-500 mt-1">Items: {order.items}</div>
                <div className="text-xs text-gray-400">Placed: {new Date(order.dateTime).toLocaleString()}</div>
              </div>
              <button
                className="ml-4 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold text-sm shadow"
                onClick={() => markAsDelivered(order.id)}
              >
                Mark as Delivered
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}