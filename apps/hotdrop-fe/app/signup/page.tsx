"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/"); // Redirect immediately after signup
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:3001/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Sign up failed");
      setUser({ name: data.signup.name, email: data.signup.email });
      localStorage.setItem("hotdrop_user", JSON.stringify({ name: data.signup.name, email: data.signup.email }));
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
          throw new Error(signupData.error || "Google sign up failed");
        }
      } catch (e) {
        // fallback: if response is not JSON
      }
      setUser({ name: user.displayName, email: user.email });
      localStorage.setItem("hotdrop_user", JSON.stringify({ name: user.displayName, email: user.email }));
    } catch (err: any) {
      setError(err.message || "Google sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-white via-red-200 to-blue-50">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-6">Sign Up</h2>
        {user ? null : (
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={e => setName(e.target.value)}
              className="border p-2 rounded w-full"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="border p-2 rounded w-full"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="border p-2 rounded w-full"
              required
            />
            <button
              type="submit"
              className="bg-black text-white px-4 py-2 rounded-full text-sm hover:bg-black/80"
              disabled={loading}
            >
              {loading ? "Signing up..." : "Sign Up"}
            </button>
            <button
              type="button"
              className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-full text-sm hover:bg-gray-100 flex items-center justify-center gap-2 mt-2"
              onClick={handleGoogleSignup}
              disabled={loading}
            >
              <img src="/google.svg" alt="Google" className="w-5 h-5" />
              Sign up with Google
            </button>
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </form>
        )}
      </div>
    </div>
  );
}
