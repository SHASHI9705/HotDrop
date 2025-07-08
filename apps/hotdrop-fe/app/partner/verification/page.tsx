"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PartnerVerificationPage() {
  const [form, setForm] = useState({
    name: "",
    aadhaarNumber: "",
    shopAddress: "",
    fssaiNumber: ""
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [partnerId, setPartnerId] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Get partnerId from localStorage after signup/signin
    const partner = localStorage.getItem("hotdrop_partner");
    if (partner) {
      try {
        const parsed = JSON.parse(partner);
        if (parsed && parsed.id) setPartnerId(parsed.id);
      } catch {}
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/partner/verification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ ...form, partnerId }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to submit verification");
      }
      setSuccess("Verification submitted! We will review your details soon.");
      setForm({ name: "", aadhaarNumber: "", shopAddress: "", fssaiNumber: "" });
      setTimeout(() => {
        router.push("/partner");
      }, 1200);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 via-red-50 to-blue-50 py-12 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg">
        <h1 className="text-3xl font-bold text-orange-600 mb-6 text-center">Partner Verification</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Name (as per Aadhaar)</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border border-orange-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-200"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Aadhaar Number</label>
            <input
              type="text"
              name="aadhaarNumber"
              value={form.aadhaarNumber}
              onChange={handleChange}
              className="w-full border border-orange-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-200"
              pattern="\d{12}"
              maxLength={12}
              minLength={12}
              required
              placeholder="12-digit Aadhaar number"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Shop Address</label>
            <textarea
              name="shopAddress"
              value={form.shopAddress}
              onChange={handleChange}
              className="w-full border border-orange-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-200"
              rows={3}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">FSSAI License Number</label>
            <input
              type="text"
              name="fssaiNumber"
              value={form.fssaiNumber}
              onChange={handleChange}
              className="w-full border border-orange-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-200"
              pattern="\d{14}"
              maxLength={14}
              minLength={14}
              required
              placeholder="14-digit FSSAI number"
            />
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          {success && <div className="text-green-600 text-sm">{success}</div>}
          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-full transition-all text-lg mt-2"
            disabled={loading || !partnerId}
          >
            {loading ? "Submitting..." : "Save Profile"}
          </button>
          {!partnerId && <div className="text-red-500 text-xs mt-2">Partner ID not found. Please sign in as a partner.</div>}
        </form>
      </div>
    </div>
  );
}
