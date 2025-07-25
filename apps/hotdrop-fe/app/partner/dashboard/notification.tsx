import React, { useEffect, useState, useRef } from 'react';

interface Order {
  id: string;
  items: string;
  shopName: string;
  price: number;
  dateTime: string;
  status: string;
  userId: string;
}

export default function NotificationSection() {
  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchRef = useRef<() => void>(() => {});

  const fetchPendingOrders = () => {
    setLoading(true);
    const partner = localStorage.getItem("hotdrop_partner");
    if (!partner) {
      setPendingOrders([]);
      setLoading(false);
      return;
    }
    const { id, shopname } = JSON.parse(partner);
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/orders/orders?partnerId=${encodeURIComponent(id)}`)
      .then(res => res.json())
      .then(data => {
        const orders = (data.orders || []).filter((order: Order) =>
          order.shopName === shopname &&
          (order.status === 'pending' || /^\d+min$/.test(order.status))
        );
        setPendingOrders(orders);
      })
      .finally(() => setLoading(false));
  };
  fetchRef.current = fetchPendingOrders;

  useEffect(() => {
    fetchRef.current();
    const interval = setInterval(() => {
      fetchRef.current();
    }, 60000); // 30 seconds
    return () => clearInterval(interval);
  }, []);


  const markAsDelivered = async (orderId: string) => {
    setLoading(true);
    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/orders/order/${orderId}/delivered`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'taken' })
    });
    fetchPendingOrders();
  };

  // Cancel order handler
  const cancelOrder = async (orderId: string) => {
    setLoading(true);
    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/orders/order/${orderId}/cancel`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'cancelled' })
    });
    // Store cancel flag in localStorage for this order
    localStorage.setItem(`hotdrop_cancelled_${orderId}`, 'cancelled');
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
            <div
              key={order.id}
              className="flex flex-col sm:flex-row sm:items-center gap-4 bg-orange-50 border border-orange-200 rounded-xl p-4"
            >
              <div className="bg-orange-100 text-orange-700 px-4 py-2 rounded-full font-semibold w-fit">New Order</div>
              <div className="text-gray-700 flex-1 min-w-0">
                Order #{order.id.slice(-4)} for <span className="font-bold">₹{order.price}</span> - <span className="text-yellow-600">{
                  order.status === 'taken' ? 'Taken'
                  : order.status === 'cancelled' ? 'Cancelled'
                  : order.status === 'pending' ? 'Pending'
                  : /^\d+min$/.test(order.status) ? `Ready in ${order.status.replace('min', '')} min`
                  : order.status
                }</span>
                <div className="text-xs text-gray-500 mt-1 truncate">Items: {order.items}</div>
                <div className="text-xs text-gray-400">Placed: {new Date(order.dateTime).toLocaleString()}</div>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:gap-2 w-full sm:w-auto">
                <button
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold text-sm shadow"
                  onClick={() => markAsDelivered(order.id)}
                >
                  Mark as Delivered
                </button>
                <div className="flex flex-row gap-2">
                  <div className="relative">
                    <TimerDropdown orderId={order.id} disabled={/^\d+min$/.test(order.status)} initialValue={/^\d+min$/.test(order.status) ? order.status : undefined} />
                  </div>
                  <button
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold text-sm shadow"
                    onClick={() => cancelOrder(order.id)}
                  >
                    Cancel Order
                  </button>
                </div>
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
interface TimerDropdownProps {
  orderId: string;
  disabled?: boolean;
  initialValue?: string;
}

function TimerDropdown({ orderId, disabled = false, initialValue }: TimerDropdownProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(initialValue || null);
  const options = [5, 10, 15, 20, 30];

  const handleSelect = async (opt: number) => {
    const timerValue = `${opt}min`;
    setSelected(timerValue);
    setOpen(false);
    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/orders/order/${orderId}/timer`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ timer: timerValue }),
    });
  };

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        className={`px-4 py-2 ${selected || disabled ? 'bg-orange-300 cursor-not-allowed' : 'bg-orange-200 hover:bg-orange-300'} text-orange-700 rounded-xl font-semibold text-sm shadow flex items-center gap-1`}
        onClick={() => { if (!selected && !disabled) setOpen(o => !o); }}
        disabled={!!selected || disabled}
      >
        {selected ? selected : "Set Timer"}
        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
      </button>
      {!selected && !disabled && open && (
        <div className="absolute right-0 mt-2 w-28 bg-white border border-orange-200 rounded-xl shadow-lg z-10">
          {options.map((opt) => (
            <button
              key={opt}
              className={`block w-full text-left px-4 py-2 text-sm hover:bg-orange-100`}
              onClick={() => handleSelect(opt)}
            >
              {opt} min
            </button>
          ))}
        </div>
      )}
    </div>
  );
}