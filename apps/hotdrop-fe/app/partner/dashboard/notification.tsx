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
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/orders/orders?partnerId=${encodeURIComponent(id)}`)
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
    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/orders/order/${orderId}/delivered`, {
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
              {/* Timer Dropdown Button */}
              <div className="relative ml-2">
                <TimerDropdown orderId={order.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// TimerDropdown component (should be outside NotificationSection)
// TimerDropdown now takes an orderId prop to persist selection per order
function TimerDropdown({ orderId }: { orderId: string }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const options = [5, 10, 15, 20, 30];

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(`hotdrop_timer_${orderId}`);
    if (stored) setSelected(Number(stored));
  }, [orderId]);

  // Save to localStorage when selected changes
  useEffect(() => {
    if (selected) {
      localStorage.setItem(`hotdrop_timer_${orderId}`, String(selected));
    }
  }, [selected, orderId]);

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        className={`px-3 py-2 ${selected ? 'bg-orange-300 cursor-not-allowed' : 'bg-orange-200 hover:bg-orange-300'} text-orange-700 rounded-xl font-semibold text-sm shadow flex items-center gap-1`}
        onClick={() => { if (!selected) setOpen(o => !o); }}
        disabled={!!selected}
      >
        {selected ? `${selected} min` : "Set Timer"}
        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
      </button>
      {!selected && open && (
        <div className="absolute right-0 mt-2 w-28 bg-white border border-orange-200 rounded-xl shadow-lg z-10">
          {options.map((opt) => (
            <button
              key={opt}
              className={`block w-full text-left px-4 py-2 text-sm hover:bg-orange-100 ${selected === opt ? 'bg-orange-50 font-bold' : ''}`}
              onClick={() => { setSelected(opt); setOpen(false); }}
            >
              {opt} min
            </button>
          ))}
        </div>
      )}
    </div>
  );
}