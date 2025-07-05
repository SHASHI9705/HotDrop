"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";

export default function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:3001/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Sign in failed");
      localStorage.setItem(
        "hotdrop_user",
        JSON.stringify({ email: data.signup.email, name: data.signup.name })
      );
      router.push("/"); // Redirect immediately after login
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignin = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      if (!user.displayName || !user.email)
        throw new Error("Google account missing name or email");
      // Try to create user in backend (if not exists)
      const signupRes = await fetch("http://localhost:3001/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: user.displayName,
          email: user.email,
          password: Math.random().toString(36).slice(-8), // random password
        }),
      });
      // If user already exists, ignore error
      let signupData;
      try {
        signupData = await signupRes.json();
        if (!signupRes.ok && signupData.error !== "Email already exists") {
          throw new Error(signupData.error || "Google sign in failed");
        }
      } catch (e) {
        // fallback: if response is not JSON
      }
      localStorage.setItem("hotdrop_user", JSON.stringify({ name: user.displayName, email: user.email }));
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Google sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-white via-orange-100 to-orange-300">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md flex flex-col items-center border border-orange-200">
        <h2 className="text-3xl font-extrabold mb-6 text-orange-500 tracking-tight">Sign In</h2>
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-2 border-orange-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 p-3 rounded-full w-full text-lg transition"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border-2 border-orange-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 p-3 rounded-full w-full text-lg transition"
            required
          />
          <button
            type="submit"
            className="bg-orange-500 text-white px-4 py-3 rounded-full text-lg font-bold shadow hover:bg-orange-600 transition-colors duration-300 mt-2"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
          <button
            type="button"
            className="bg-white border-2 border-orange-300 text-orange-500 px-4 py-3 rounded-full text-lg font-bold hover:bg-orange-50 flex items-center justify-center gap-2 mt-2 transition-colors duration-200"
            onClick={handleGoogleSignin}
            disabled={loading}
          >
            <img src="/google.svg" alt="Google" className="w-5 h-5" />
            Sign in with Google
          </button>
          {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
          <div className="text-center mt-4 text-gray-600 text-base">
            Don't have an account?{' '}
            <button
              type="button"
              className="text-orange-500 font-bold hover:underline focus:outline-none"
              onClick={() => router.push('/signup')}
            >
              Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
