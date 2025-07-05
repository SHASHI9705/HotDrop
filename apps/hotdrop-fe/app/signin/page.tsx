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
      localStorage.setItem(
        "hotdrop_user",
        JSON.stringify({ name: user.displayName, email: user.email })
      );
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Google sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-white via-red-200 to-blue-50">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-6">Sign In</h2>
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 rounded w-full"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 rounded w-full"
            required
          />
          <button
            type="submit"
            className="bg-black text-white px-4 py-2 rounded-full text-sm hover:bg-black/80"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
          <button
            type="button"
            className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-full text-sm hover:bg-gray-100 flex items-center justify-center gap-2 mt-2"
            onClick={handleGoogleSignin}
            disabled={loading}
          >
            <img src="/google.svg" alt="Google" className="w-5 h-5" />
            Sign in with Google
          </button>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </form>
      </div>
    </div>
  );
}
