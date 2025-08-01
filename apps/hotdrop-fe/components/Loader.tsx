
export default function Loader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-r from-gray-900 via-gray-950 to-gray-900">
      <div className="relative w-16 h-16">
        {/* Main Circle */}
        <svg className="absolute top-0 left-0 w-16 h-16 animate-spin-slow" viewBox="0 0 64 64">
          <circle
            cx="32"
            cy="32"
            r="28"
            fill="none"
            stroke="#fb923c"
            strokeWidth="6"
            opacity="0.15"
          />
        </svg>
        {/* Rotating Arc */}
        <svg className="absolute top-0 left-0 w-16 h-16 animate-spin-fast" viewBox="0 0 64 64">
          <path
            d="M32 4
              a 28 28 0 0 1 0 56
              a 28 28 0 0 1 0 -56"
            fill="none"
            stroke="#fb923c"
            strokeWidth="6"
            strokeDasharray="17.6 158.4"  /* 10% arc, 90% gap */
            strokeLinecap="round"
          />
        </svg>
      </div>
      <style>{`
        .animate-spin-slow {
          animation: spin 1.6s linear infinite;
        }
        .animate-spin-fast {
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
