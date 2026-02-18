"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="w-full bg-[#161b22]/90 backdrop-blur border-b border-[#30363d]">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo / Title */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🌙</span>
          <span className="text-lg font-bold text-[#e6edf3]">
            Ramadan Tracker
          </span>
        </Link>

        {/* User info */}
        {session?.user ? (
          <div className="flex items-center gap-4">
            <span className="text-sm text-[#8b949e] hidden sm:block">
              {session.user.name}
            </span>
            <button
              onClick={() => signOut()}
              className="text-xs bg-[#21262d] hover:bg-[#30363d] text-[#e6edf3] border border-[#30363d] px-3 py-1.5 rounded-lg transition"
            >
              Log out
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="text-sm bg-[#238636] hover:bg-[#2ea043] text-white font-semibold px-4 py-1.5 rounded-lg transition"
          >
            Log in
          </Link>
        )}
      </div>
    </nav>
  );
}
