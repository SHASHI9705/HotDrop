"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

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
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackOrderId, setFeedbackOrderId] = useState<string | null>(null);
  const [feedbackName, setFeedbackName] = useState("");
  const [feedbackStars, setFeedbackStars] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState("");
  type FeedbackResult = { success: boolean; message: string } | null;
  const [feedbackResult, setFeedbackResult] = useState<FeedbackResult>(null);

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
    const interval = setInterval(fetchOrders, 120000); // 30 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-white via-red-100 to-red-300 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 flex flex-col items-center pt-8 px-4 pb-24">
      {/* Nav Bar with Back, Heading, and Home */}
      <div className="w-full max-w-5xl mx-auto flex items-center justify-between mb-8 px-0 md:px-4 py-3 bg-white/80 dark:bg-gray-800/80 rounded-xl shadow border border-orange-200 dark:border-gray-700">
        {/* Back Button (left) */}
        <button
          className="flex items-center px-3 py-1.5 md:px-5 md:py-2 hover:bg-orange-200 dark:hover:bg-gray-600 text-orange-600 dark:text-orange-300 font-semibold rounded-lg shadow transition ml-2"
          title="Back"
          onClick={() => window.history.back()}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="#fb923c" className="w-6 h-6 mr-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          <span className="hidden md:inline">Back</span>
        </button>
        {/* Centered logo and heading */}
        <div className="flex items-center mx-auto">
          
          <h1 className="text-xl md:text-3xl font-bold text-orange-500 drop-shadow-sm whitespace-nowrap">My Orders</h1>
        </div> 
        <div className="w-[65px]"></div>
      </div>

      {/* Tab section for Active/Completed */}
      <div className="w-full max-w-3xl flex justify-center mb-8">
        <div className="flex w-full max-w-xs bg-white dark:bg-gray-800 rounded-full shadow border border-orange-200 dark:border-gray-700 overflow-hidden">
          <button
            className={`flex-1 py-2 text-sm font-semibold transition ${tab === 'active' ? 'bg-orange-100 dark:bg-gray-700 text-orange-600 dark:text-orange-300' : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-300'}`}
            onClick={() => setTab('active')}
          >
            Active
          </button>
          <button
            className={`flex-1 py-2 text-sm font-semibold transition ${tab === 'completed' ? 'bg-orange-100 dark:bg-gray-700 text-orange-600 dark:text-orange-300' : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-300'}`}
            onClick={() => setTab('completed')}
          >
            Completed
          </button>
        </div>
      </div>

      <div className="w-full max-w-3xl flex flex-col gap-6">
        {loading ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-12">Loading...</div>
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
              return <div className="text-center text-gray-500 dark:text-gray-400 py-12 text-lg">No orders to display.</div>;
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
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg flex flex-col px-6 py-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300 relative"
                >
                  {/* Top row: Shop name (label) left, status right */}
                  <div className="flex items-start justify-between mb-2 w-full">
                    <div className="flex flex-col items-start">
                      <div className="bg-orange-100 dark:bg-gray-700 text-orange-600 dark:text-orange-300 text-lg -ml-1 font-extrabold rounded px-2 mb-1 shadow-sm tracking-wide">{order.shopName}</div>
                      <div className="font-semibold text-base text-gray-700 dark:text-gray-100 mt-1">Order <span className="text-gray-400 dark:text-gray-300">#{order.id.slice(-4)}</span></div>
                    </div>
                    <div className={`flex items-center px-2  rounded-full font-semibold text-xs shadow-sm ${statusColor}`}
                      style={{ minWidth: 'fit-content', minHeight: '1.8rem' }}
                    >
                      {statusIcon}
                      {statusLabel}
                    </div>
                  </div>
                  {/* Items List (dot left of name, bold font, left aligned) */}
                  <div className="flex flex-wrap gap-2 mb-2">
                    {itemsArr.map((item, idx) => (
                      <span key={item.name + idx} className="flex items-center text-gray-800 dark:text-gray-100 font-bold text-base py-1">
                        <span className="w-2 h-2 rounded-full bg-orange-400 dark:bg-orange-600 mr-2 inline-block"></span>
                        {item.name}
                      </span>
                    ))}
                  </div>
                  {/* Divider above Date/Time and Total Row */}
                  <div className="w-full border-t border-gray-200 dark:border-gray-700 my-2" />
                  {/* Feedback button and price side by side */}
                  <div className="flex flex-row justify-between w-full items-center mb-2">
                    <button
                      className="px-2 rounded font-semibold shadow transition text-base bg-orange-500 text-white hover:bg-orange-600 dark:bg-orange-600 dark:text-white dark:hover:bg-orange-700"
                      style={{ minWidth: 120, minHeight: '2rem' }}
                      onClick={() => {
                        setFeedbackOrderId(order.id);
                        setShowFeedbackModal(true);
                        setFeedbackName("");
                        setFeedbackStars(5);
                        setFeedbackComment("");
                      }}
                    >
                      Give Feedback
                    </button>
                    <div className="text-base font-bold text-black dark:text-white flex items-center gap-1">
                      <span className="bg-green-100 dark:bg-green-900 px-3 py-1 rounded">Total: ₹{order.price}</span>
                    </div>
                  </div>
                  {/* Date/Time at the bottom left of the card */}
                  <div className="flex w-full mt-1 -mb-3">
                    <div className="text-gray-500 dark:text-gray-300 text-xs flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-400 dark:text-gray-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" /></svg>
                      <span className="font-medium">{new Date(order.dateTime).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</span>
                    </div>
                  </div>
                </div>
              );
            });
          })()
        )}
      </div>
      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg w-full max-w-md flex flex-col items-center relative">
            <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200" onClick={() => setShowFeedbackModal(false)}>&times;</button>
            <h2 className="text-xl font-bold text-orange-500 mb-4">Order Feedback</h2>
            <form className="w-full flex flex-col gap-4" onSubmit={async e => {
              e.preventDefault();
              try {
                if (!feedbackName || !feedbackOrderId || !feedbackComment) {
                  setFeedbackResult({ success: false, message: "All fields are required." });
                  return;
                }
                const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/feedbacks/feedback`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    orderId: feedbackOrderId,
                    name: feedbackName,
                    stars: feedbackStars,
                    comment: feedbackComment
                  })
                });
                if (!res.ok) {
                  setFeedbackResult({ success: false, message: "Failed to submit feedback." });
                  return;
                }
                setFeedbackResult({ success: true, message: "Feedback submitted successfully!" });
              } catch (err) {
                setFeedbackResult({ success: false, message: "Network error. Please try again." });
              }
            }}>
      {/* Feedback result modal */}
      {typeof feedbackResult !== 'undefined' && feedbackResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg w-full max-w-xs flex flex-col items-center relative">
            <h2 className={`text-xl font-bold mb-4 ${feedbackResult.success ? 'text-green-600' : 'text-red-500'}`}>{feedbackResult.success ? 'Success' : 'Error'}</h2>
            <div className="text-base text-center mb-6 text-gray-700 dark:text-gray-200">{feedbackResult.message}</div>
            <button
              className="bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700 text-white font-bold py-2 px-6 rounded-lg shadow transition"
              onClick={() => {
                setFeedbackResult(null);
                setShowFeedbackModal(false);
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}
              <input
                type="text"
                className="border border-orange-200 dark:border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                placeholder="Your Name"
                value={feedbackName}
                onChange={e => setFeedbackName(e.target.value)}
                required
              />
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">Stars</label>
                <div className="flex gap-1">
                  {[1,2,3,4,5].map(star => (
                    <button
                      type="button"
                      key={star}
                      className={
                        (star <= feedbackStars ? "text-yellow-400" : "text-gray-300 dark:text-gray-600") +
                        " text-2xl focus:outline-none"
                      }
                      onClick={() => setFeedbackStars(star)}
                    >★</button>
                  ))}
                </div>
              </div>
              <textarea
                className="border border-orange-200 dark:border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                placeholder="Your feedback..."
                value={feedbackComment}
                onChange={e => setFeedbackComment(e.target.value)}
                rows={3}
                required
              />
              <button
                type="submit"
                className="mt-2 bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700 text-white font-bold py-2 px-6 rounded-lg shadow transition"
              >
                Submit Feedback
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
