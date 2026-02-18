"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const res = await signIn("credentials", {
      email: form.get("email"),
      password: form.get("password"),
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError("Invalid email or password.");
    } else {
      router.push("/");
      router.refresh();
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <div className="w-full max-w-md bg-emerald-900/50 border border-emerald-800/50 rounded-2xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="text-5xl">🌙</span>
          <h1 className="text-2xl font-bold text-amber-300 mt-3">
            Welcome Back
          </h1>
          <p className="text-sm text-emerald-400 mt-1">
            Sign in to your Ramadan Tracker
          </p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/40 text-red-300 text-sm rounded-lg p-3 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-emerald-300 mb-1">Email</label>
            <input
              name="email"
              type="email"
              required
              className="w-full bg-emerald-950 border border-emerald-700 rounded-lg px-4 py-2.5 text-emerald-100
                         focus:ring-2 focus:ring-amber-400 focus:outline-none placeholder:text-emerald-700"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm text-emerald-300 mb-1">
              Password
            </label>
            <input
              name="password"
              type="password"
              required
              className="w-full bg-emerald-950 border border-emerald-700 rounded-lg px-4 py-2.5 text-emerald-100
                         focus:ring-2 focus:ring-amber-400 focus:outline-none placeholder:text-emerald-700"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold py-2.5 rounded-lg
                       transition disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="text-sm text-center text-emerald-500 mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-amber-400 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
