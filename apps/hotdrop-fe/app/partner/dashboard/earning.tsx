import React from "react";

export default function EarningSection() {
  return (
    <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-6 mb-8 flex flex-col items-center justify-between border border-gray-200">
      <div className="font-bold text-lg text-gray-700 mb-4 self-start">Earning Summary</div>
      <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 w-full justify-between mt-2">
        <div className="flex flex-col items-center flex-1">
          <div className="text-2xl font-bold text-green-600">₹12,500</div>
          <div className="text-gray-500 text-sm">Total Earned</div>
        </div>
        <div className="flex flex-col items-center flex-1">
          <div className="text-2xl font-bold text-blue-500">₹1,200</div>
          <div className="text-gray-500 text-sm">Earned Today</div>
        </div>
        <div className="flex flex-col items-center flex-1">
          <div className="text-2xl font-bold text-orange-500">120</div>
          <div className="text-gray-500 text-sm">Total Orders</div>
        </div>
        <div className="flex flex-col items-center flex-1">
          <div className="text-2xl font-bold text-purple-500">4.7★</div>
          <div className="text-gray-500 text-sm">Avg. Rating</div>
        </div>
      </div>
    </div>
  );
}
