"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PartnerSignin() {
  const [shopname, setShopname] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:3001/partner/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shopname, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Sign in failed");
      // Store partner login in localStorage (include id for backend requests)
      localStorage.setItem("hotdrop_partner", JSON.stringify({ id: data.partner.id, shopname: data.partner.shopname, shopcategory: data.partner.shopcategory }));
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
        <h2 className="text-3xl font-extrabold mb-6 text-orange-500 tracking-tight">Partner Sign In</h2>
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
          <input
            type="text"
            placeholder="Shop Name"
            value={shopname}
            onChange={e => setShopname(e.target.value)}
            className="border-2 border-orange-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 p-3 rounded-full w-full text-lg transition"
            required
          />
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
            {loading ? "Signing in..." : "Sign In"}
          </button>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </form>
        <p className="mt-4 text-sm text-gray-600">
          Don't have an account?{" "}
          <a
            href="/partner/signup"
            className="text-orange-600 hover:underline font-semibold"
          >
            Sign up here
          </a>
        </p>
      </div>
    </div>
  );
}
