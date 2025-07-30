"use client";

import { useRouter } from "next/navigation";

export default function OrderPointsPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gradient-to-r from-white via-orange-100 to-orange-200 flex flex-col items-center pt-8 px-4 pb-24">
      {/* Nav Bar */}
      <div className="w-full max-w-2xl mx-auto flex items-center justify-between mb-8 px-0 md:px-4 py-3 bg-white/80 rounded-xl shadow border border-orange-200">
        {/* Back Button (left) */}
        <button
          className="flex items-center px-5 py-2 bg-orange-100 hover:bg-orange-200 text-orange-600 font-semibold rounded-lg shadow transition ml-2"
          title="Back"
          onClick={() => router.back()}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="#fb923c" className="w-6 h-6 mr-0 md:mr-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          <span className="hidden md:inline">Back</span>
        </button>
        {/* Centered Heading */}
        <h1 className="text-xl md:text-3xl font-bold text-orange-500 drop-shadow-sm whitespace-nowrap mx-auto">Order Points</h1>
        {/* Home Button (right) */}
        <button
          className="flex items-center px-5 py-2 bg-orange-100 hover:bg-orange-200 text-orange-600 font-semibold rounded-lg shadow transition mr-2"
          title="Home"
          onClick={() => router.push("/")}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="#fb923c" className="w-6 h-6 mr-0 md:mr-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-9 9 9M4.5 10.5V21h15V10.5" />
          </svg>
          <span className="hidden md:inline">Home</span>
        </button>
      </div>
      {/* Order Points Info */}
      <div className="w-full max-w-2xl mx-auto flex flex-col items-center gap-4">
        <h2 className="text-2xl md:text-3xl font-bold text-orange-600 flex items-center gap-2 mt-2 mb-1">
          <span role="img" aria-label="gift">🎁</span> Your Order Points
        </h2>
        <div className="w-full">
          <ul className="bg-white/90 rounded-xl shadow border border-orange-100 px-4 sm:px-6 py-5 text-base sm:text-lg text-gray-700 font-medium list-disc list-inside space-y-3 text-left">
            <li>
              Earn <span className="text-orange-500 font-bold">5 Order Points</span> every time you place an order. It’s our way of saying thank you for being a loyal customer!
            </li>
            <li>
              Collect more than <span className="text-orange-500 font-bold">50 Order Points</span> and you’ll be automatically entered into our <span className="text-orange-500 font-bold">weekly lucky draw</span>, held every Sunday.
            </li>
            <li>
              Each week, one lucky winner is randomly selected from eligible users and gets a <span className="text-orange-500 font-bold">free food item or reward</span> absolutely free!
            </li>
            <li>
              Keep ordering, keep collecting, and you might just be our next Sunday winner!<span role="img" aria-label="party">🎉</span>
            </li>
          </ul>
        </div>
        {/* Your Order Points Box */}
        <div className="w-full mt-4">
          <div className="bg-white/90 rounded-xl shadow border border-orange-200 px-4 sm:px-6 py-5 flex flex-col gap-2">
            <h3 className="text-lg sm:text-xl font-bold text-orange-500 mb-1">Your Order Points</h3>
            {/* You can display the user's points here in the future */}
            <div className="text-gray-700 text-base sm:text-lg font-medium">Check your current order points here!</div>
          </div>
        </div>
        {/* To Collect More Points Box */}
        <div className="w-full mt-4">
          <div className="bg-white/90 rounded-xl shadow border border-orange-200 px-2 sm:px-6 py-4 flex flex-col gap-2">
            <div className="flex flex-row items-center justify-between w-full">
              <h3 className="text-base sm:text-xl font-bold text-orange-500 mb-0 whitespace-nowrap">To Collect More Points</h3>
              <button
                className="ml-2 sm:ml-3 bg-orange-500 hover:bg-orange-600 text-white font-bold py-1 px-3 sm:py-2 sm:px-6 rounded-lg shadow transition text-xs sm:text-lg whitespace-nowrap"
                onClick={() => router.push("/")}
              >
                Order Now
              </button>
            </div>
            <div className="text-gray-700 text-xs sm:text-lg font-medium mt-1">Place more orders and watch your points grow!</div>
          </div>
        </div>
      </div>
    </div>
  );
}
