"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import Link from "next/link";
import { ZONES } from "@/lib/prayer";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const body = {
      name: form.get("name"),
      email: form.get("email"),
      password: form.get("password"),
      zone: form.get("zone"),
    };

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Registration failed.");
        setLoading(false);
        return;
      }

      // Auto-redirect to login
      router.push("/login");
    } catch {
      setError("Something went wrong.");
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <div className="w-full max-w-md bg-[#161b22] border border-[#30363d] rounded-2xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="text-5xl">🌙</span>
          <h1 className="text-2xl font-bold text-[#e6edf3] mt-3">
            Create Account
          </h1>
          <p className="text-sm text-[#8b949e] mt-1">
            Join Ramadan Tracker 1447H
          </p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/40 text-red-300 text-sm rounded-lg p-3 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-[#8b949e] mb-1">Name</label>
            <input
              name="name"
              type="text"
              required
              className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-4 py-2.5 text-[#e6edf3]
                         focus:ring-2 focus:ring-[#58a6ff] focus:outline-none placeholder:text-[#484f58]"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="block text-sm text-[#8b949e] mb-1">Email</label>
            <input
              name="email"
              type="email"
              required
              className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-4 py-2.5 text-[#e6edf3]
                         focus:ring-2 focus:ring-[#58a6ff] focus:outline-none placeholder:text-[#484f58]"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm text-[#8b949e] mb-1">
              Password
            </label>
            <input
              name="password"
              type="password"
              required
              minLength={6}
              className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-4 py-2.5 text-[#e6edf3]
                         focus:ring-2 focus:ring-[#58a6ff] focus:outline-none placeholder:text-[#484f58]"
              placeholder="Min 6 characters"
            />
          </div>

          <div>
            <label className="block text-sm text-[#8b949e] mb-1">
              Prayer Zone (Malaysia)
            </label>
            <select
              name="zone"
              defaultValue="SGR01"
              className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-4 py-2.5 text-[#e6edf3]
                         focus:ring-2 focus:ring-[#58a6ff] focus:outline-none"
            >
              {ZONES.map((z) => (
                <option key={z.code} value={z.code}>
                  {z.code} – {z.label}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#238636] hover:bg-[#2ea043] text-white font-bold py-2.5 rounded-lg
                       transition disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="text-sm text-center text-[#8b949e] mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-[#58a6ff] hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
