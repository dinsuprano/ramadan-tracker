"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="w-full bg-emerald-950/80 backdrop-blur border-b border-amber-500/20">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo / Title */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🌙</span>
          <span className="text-lg font-bold bg-linear-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
            Ramadan Tracker
          </span>
        </Link>

        {/* User info */}
        {session?.user ? (
          <div className="flex items-center gap-4">
            <span className="text-sm text-emerald-200 hidden sm:block">
              {session.user.name}
            </span>
            <button
              onClick={() => signOut()}
              className="text-xs bg-emerald-800 hover:bg-emerald-700 text-amber-200 px-3 py-1.5 rounded-lg transition"
            >
              Log out
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="text-sm bg-amber-500 hover:bg-amber-400 text-emerald-950 font-semibold px-4 py-1.5 rounded-lg transition"
          >
            Log in
          </Link>
        )}
      </div>
    </nav>
  );
}
