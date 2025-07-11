"use client";
import { auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState<{ name: string; email: string; id?: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Sign up failed");
      setUser({ name: data.signup.name, email: data.signup.email, id: data.signup.id });
      localStorage.setItem("hotdrop_user", JSON.stringify({ name: data.signup.name, email: data.signup.email, id: data.signup.id }));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      if (!user.displayName || !user.email) throw new Error("Google account missing name or email");
      // Try to create user in backend (if not exists)
      const signupRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: user.displayName,
          email: user.email,
          password: Math.random().toString(36).slice(-8),
        }),
      });
      let signupData;
      try {
        signupData = await signupRes.json();
        if (!signupRes.ok && signupData.error !== "Email already exists") {
          throw new Error(signupData.error || "Google sign up failed");
        }
      } catch (e) {}
      // Always get id and user info from backend if possible
      let userObj: { name: string; email: string; id?: string } = { name: user.displayName || '', email: user.email || '' };
      if (signupData && signupData.signup) {
        userObj = {
          name: signupData.signup.name,
          email: signupData.signup.email,
          id: signupData.signup.id
        };
      } else if (signupData && signupData.error === "Email already exists") {
        // Fetch user by email to get id
        const userRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/user?email=${encodeURIComponent(user.email)}`);
        const userJson = await userRes.json();
        if (userRes.ok && userJson.user) {
          userObj = {
            name: userJson.user.name,
            email: userJson.user.email,
            id: userJson.user.id
          };
        }
      }
      setUser(userObj);
      localStorage.setItem("hotdrop_user", JSON.stringify(userObj));
    } catch (err: any) {
      setError(err.message || "Google sign-in failed");
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
        {/* Decorative elements */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-30"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30"></div>
        <div className="relative z-10">
          <div className="flex justify-center mb-6">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Image src="/logo.png" alt="Logo" width={60} height={60} className="rounded-lg" />
            </motion.div>
          </div>
          <motion.h2
            className="text-3xl font-bold text-center mb-6 text-gray-800"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            Create your account
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
          {!user && (
            <form onSubmit={handleSubmit} className="space-y-5">
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full border border-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-sm transition bg-white/80 backdrop-blur-sm"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full border border-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-sm transition bg-white/80 backdrop-blur-sm"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full border border-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-sm transition bg-white/80 backdrop-blur-sm"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
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
                disabled={loading}
              >
                {loading ? (
                  <span className="flex justify-center items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing up...
                  </span>
                ) : (
                  "Sign Up"
                )}
              </motion.button>
            </form>
          )}
          <div className="my-6 flex items-center">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="mx-4 text-sm text-gray-500">or continue with</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>
          <motion.button
            onClick={handleGoogleSignup}
            className="w-full border border-gray-200 py-3 rounded-xl hover:bg-gray-50 transition flex items-center justify-center gap-3 bg-white"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            disabled={loading}
          >
            <img src="/google.svg" alt="Google" className="w-5 h-5" />
            <span className="text-sm text-gray-700 font-medium">Google</span>
          </motion.button>
          <motion.p
            className="text-center mt-6 text-sm text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Already have an account?{" "}
            <button
              type="button"
              className="text-orange-600 hover:underline font-medium"
              onClick={() => router.push("/signin")}
            >
              Log in
            </button>
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}
