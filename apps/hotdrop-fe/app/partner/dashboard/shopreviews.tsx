import React from "react";

export default function ShopReviewsSection() {
  return (
          <div className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 border border-gray-200 dark:border-gray-700">
            <div className="font-bold text-lg text-gray-700 dark:text-gray-100 mb-4">Recent Reviews</div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-row items-start gap-4">
                <img src="/profile.svg" className="w-10 h-10 rounded-full" alt="User" />
                <div>
                  <div className="font-semibold text-gray-800 flex items-center gap-2">Amit Sharma <span className="text-xs text-gray-400">2 hours ago</span></div>
                  <div className="text-yellow-500 dark:text-yellow-300">★★★★★</div>
                  <div className="text-gray-600 text-sm mb-1 dark:text-gray-300">Great food and fast delivery!</div>
                  <div className="text-xs text-gray-400">Ordered: Masala Dosa, Idli</div>
                </div>
              </div>
              <div className="flex flex-row items-start gap-4">
                <img src="/profile.svg" className="w-10 h-10 rounded-full" alt="User" />
                <div>
                  <div className="font-semibold text-gray-800 flex items-center gap-2">Priya Singh <span className="text-xs text-gray-400">Yesterday</span></div>
                  <div className="text-yellow-500 dark:text-yellow-300">★★★★☆</div>
                  <div className="text-gray-600 text-sm mb-1 dark:text-gray-300">Loved the pizza, will order again.</div>
                  <div className="text-xs text-gray-400">Ordered: Pizza, Coke</div>
                </div>
              </div>
              <div className="flex flex-row items-start gap-4">
                <img src="/profile.svg" className="w-10 h-10 rounded-full" alt="User" />
                <div>
                  <div className="font-semibold text-gray-800 flex items-center gap-2">Rohit Mehra <span className="text-xs text-gray-400">2 days ago</span></div>
                  <div className="text-yellow-500 dark:text-yellow-300">★★★★★</div>
                  <div className="text-gray-600 text-sm mb-1 dark:text-gray-300">Excellent service and tasty food.</div>
                  <div className="text-xs text-gray-400">Ordered: Burger, Fries</div>
                </div>
              </div>
            </div>
          </div>
  );
}
