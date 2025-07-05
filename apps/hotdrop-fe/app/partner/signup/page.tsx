"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PartnerSignup() {
  const [shopname, setShopname] = useState("");
  const [shopcategory, setShopcategory] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:3001/partner/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shopname, shopcategory, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Sign up failed");
      // Store partner login in localStorage
      localStorage.setItem("hotdrop_partner", JSON.stringify({ shopname, shopcategory }));
      router.push("/partner");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-white via-orange-100 to-orange-300">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md flex flex-col items-center border border-orange-200">
        <h2 className="text-3xl font-extrabold mb-6 text-orange-500 tracking-tight">Partner Sign Up</h2>
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
          <input
            type="text"
            placeholder="Shop Name"
            value={shopname}
            onChange={e => setShopname(e.target.value)}
            className="border-2 border-orange-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 p-3 rounded-full w-full text-lg transition"
            required
          />
          <select
            value={shopcategory}
            onChange={e => setShopcategory(e.target.value)}
            className="border-2 border-orange-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 p-3 rounded-full w-full text-lg transition"
            required
          >
            <option value="" disabled>Select Shop Category</option>
            <option value="food">Food</option>
            <option value="stationary">Stationary</option>
            <option value="clothes">Clothes</option>
          </select>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="border-2 border-orange-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 p-3 rounded-full w-full text-lg transition"
            required
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-orange-500 to-orange-400 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-md hover:from-orange-600 hover:to-orange-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2"
            disabled={loading}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </form>
        <p className="mt-4 text-sm text-gray-600">
          Already have an account?{" "}
          <a
            href="/partner/signin"
            className="text-orange-600 hover:underline font-semibold"
          >
            Login here
          </a>
        </p>
      </div>
    </div>
  );
}
