"use client";
import { useEffect, useState } from "react";

interface Order {
  id: string;
  items: string;
  shopName: string;
  price: number;
  dateTime: string;
  status: string;
}

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'active' | 'completed'>('active');

  useEffect(() => {
    document.title = "My Orders | HotDrop";

    const fetchOrders = () => {
      setLoading(true);
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
    };

    fetchOrders();
    const interval = setInterval(fetchOrders, 60000); // 30 seconds
    return () => clearInterval(interval);
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

      {/* Tab section for Active/Completed */}
      <div className="w-full max-w-3xl flex justify-center mb-8">
        <div className="flex w-full max-w-xs bg-white rounded-full shadow border border-orange-200 overflow-hidden">
          <button
            className={`flex-1 py-2 text-sm font-semibold transition ${tab === 'active' ? 'bg-orange-100 text-orange-600' : 'bg-white text-gray-500'}`}
            onClick={() => setTab('active')}
          >
            Active
          </button>
          <button
            className={`flex-1 py-2 text-sm font-semibold transition ${tab === 'completed' ? 'bg-orange-100 text-orange-600' : 'bg-white text-gray-500'}`}
            onClick={() => setTab('completed')}
          >
            Completed
          </button>
        </div>
      </div>

      <div className="w-full max-w-3xl flex flex-col gap-6">
        {loading ? (
          <div className="text-center text-gray-500 py-12">Loading...</div>
        ) : (
          (() => {
            // Filter orders based on tab
            let filteredOrders: Order[] = [];
            if (tab === 'active') {
              filteredOrders = orders.filter(order => order.status === 'pending' || /^\d+min$/.test(order.status));
            } else {
              filteredOrders = orders.filter(order => order.status === 'taken' || order.status === 'cancelled');
            }
            if (filteredOrders.length === 0) {
              return <div className="text-center text-gray-500 py-12 text-lg">No orders to display.</div>;
            }
            return filteredOrders.map((order) => {
              // Status label and icon
              let statusLabel = '';
              let statusColor = '';
              let statusIcon = null;
              if (order.status === 'pending') {
                statusLabel = 'Pending';
                statusColor = 'text-yellow-600 bg-yellow-100';
                statusIcon = (
                  <svg className="w-5 h-5 mr-1 text-yellow-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" /></svg>
                );
              } else if (/^\d+min$/.test(order.status)) {
                statusLabel = `Ready in ${order.status.replace('min', '')} min`;
                statusColor = 'text-blue-600 bg-blue-100';
                statusIcon = (
                  <svg className="w-5 h-5 mr-1 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" /></svg>
                );
              } else if (order.status === 'taken') {
                statusLabel = 'Taken';
                statusColor = 'text-green-600 bg-green-100';
                statusIcon = (
                  <svg className="w-5 h-5 mr-1 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" /></svg>
                );
              } else if (order.status === 'cancelled') {
                statusLabel = 'Cancelled';
                statusColor = 'text-red-600 bg-red-100';
                statusIcon = (
                  <svg className="w-5 h-5 mr-1 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 9l-6 6m0-6l6 6" /></svg>
                );
              } else {
                statusLabel = order.status;
                statusColor = 'text-gray-600 bg-gray-100';
              }

              // Parse items: support both string and array (for future-proofing)
              let itemsArr: { name: string; image?: string }[] = [];
              try {
                if (Array.isArray(order.items)) {
                  itemsArr = order.items;
                } else if (typeof order.items === 'string') {
                  // Try to parse as JSON array, fallback to comma split
                  if (order.items.trim().startsWith('[')) {
                    itemsArr = JSON.parse(order.items);
                  } else {
                    itemsArr = order.items.split(',').map((name: string) => ({ name: name.trim() }));
                  }
                }
              } catch {
                itemsArr = [{ name: order.items }];
              }

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-xl shadow-lg flex flex-col px-6 py-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300 relative"
                >
                  {/* Top row: Shop name (label) left, status right */}
                  <div className="flex items-start justify-between mb-2 w-full">
                    <div className="flex flex-col items-start">
                      <div className="bg-orange-100 text-orange-600 text-lg font-extrabold rounded-full px-2 mb-1 shadow-sm tracking-wide">{order.shopName}</div>
                      <div className="font-semibold text-base text-gray-700 mt-1">Order <span className="text-gray-400">#{order.id.slice(-4)}</span></div>
                    </div>
                    <div className={`flex items-center px-3 py-1 rounded-full font-semibold text-xs shadow-sm ${statusColor}`}
                      style={{ minWidth: 'fit-content', minHeight: '2.2rem' }}
                    >
                      {statusIcon}
                      {statusLabel}
                    </div>
                  </div>
                  {/* Items List (dot left of name, bold font, left aligned) */}
                  <div className="flex flex-wrap gap-2 mb-2">
                    {itemsArr.map((item, idx) => (
                      <span key={item.name + idx} className="flex items-center text-gray-800 font-bold text-base py-1">
                        <span className="w-2 h-2 rounded-full bg-orange-400 mr-2 inline-block"></span>
                        {item.name}
                      </span>
                    ))}
                  </div>
                  {/* Divider above Date/Time and Total Row */}
                  <div className="w-full border-t border-gray-200 my-2" />
                  {/* Date/Time and Total Row */}
                  <div className="flex items-end justify-between w-full">
                    <div className="text-gray-500 text-sm flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" /></svg>
                      <span className="font-medium">{new Date(order.dateTime).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</span>
                    </div>
                    <div className="text-base font-bold text-green-700 flex items-center gap-1">
                      <span className="bg-green-100 px-3 py-1 rounded-full">Total: ₹{order.price}</span>
                    </div>
                  </div>
                </div>
              );
            });
          })()
        )}
      </div>
    </div>
  );
}
