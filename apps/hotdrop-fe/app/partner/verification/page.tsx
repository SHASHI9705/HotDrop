"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-red-100 to-blue-50 animate-gradient-x p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="backdrop-blur-lg bg-white/90 shadow-xl rounded-3xl px-8 py-10 w-full max-w-md border border-white/20 relative overflow-hidden"
      >
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-30"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30"></div>
        <div className="relative z-10">
          <div className="flex justify-center mb-6">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Image
                src="/logo.png"
                alt="Logo"
                width={60}
                height={60}
                className="rounded-lg"
              />
            </motion.div>
          </div>
          <motion.h2 
            className="text-3xl font-bold text-center mb-6 text-gray-800"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            Partner Verification
          </motion.h2>
          {error && (
            <motion.div 
              className="p-3 bg-red-50 text-red-600 rounded-lg flex items-start mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <svg className="w-5 h-5 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </motion.div>
          )}
          {success && (
            <motion.div 
              className="p-3 bg-green-50 text-green-700 rounded-lg flex items-start mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <svg className="w-5 h-5 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              {success}
            </motion.div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-1">Name (as per Aadhaar)</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full border border-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-sm transition bg-white/80 backdrop-blur-sm"
                required
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-1">Aadhaar Number</label>
              <input
                type="text"
                name="aadhaarNumber"
                value={form.aadhaarNumber}
                onChange={handleChange}
                className="w-full border border-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-sm transition bg-white/80 backdrop-blur-sm"
                pattern="\d{12}"
                maxLength={12}
                minLength={12}
                required
                placeholder="12-digit Aadhaar number"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-1">Shop Address</label>
              <textarea
                name="shopAddress"
                value={form.shopAddress}
                onChange={handleChange}
                className="w-full border border-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-sm transition bg-white/80 backdrop-blur-sm"
                rows={3}
                required
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-1">FSSAI License Number</label>
              <input
                type="text"
                name="fssaiNumber"
                value={form.fssaiNumber}
                onChange={handleChange}
                className="w-full border border-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-sm transition bg-white/80 backdrop-blur-sm"
                pattern="\d{14}"
                maxLength={14}
                minLength={14}
                required
                placeholder="14-digit FSSAI number"
              />
            </motion.div>
            <motion.button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3.5 rounded-xl hover:shadow-lg transition-all font-medium relative overflow-hidden"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              disabled={loading || !partnerId}
            >
              {loading ? (
                <span className="flex justify-center items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </span>
              ) : (
                "Save Profile"
              )}
            </motion.button>
            {!partnerId && <div className="text-red-500 text-xs mt-2">Partner ID not found. Please sign in as a partner.</div>}
          </form>
        </div>
      </motion.div>
    </div>
  );
}
