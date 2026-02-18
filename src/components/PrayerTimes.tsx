"use client";

import { useEffect, useState, useCallback } from "react";
import { ZONES } from "@/lib/prayer";
import type { PrayerTime } from "@/lib/prayer";

interface Props {
  defaultZone?: string;
}

export default function PrayerTimes({ defaultZone = "SGR01" }: Props) {
  const [zone, setZone] = useState(defaultZone);
  const [prayer, setPrayer] = useState<PrayerTime | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrayer = useCallback(async (z: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/prayer?zone=${z}`);
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      setPrayer(data);
    } catch {
      setError("Failed to load prayer times");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrayer(zone);
  }, [zone, fetchPrayer]);

  const times = prayer
    ? [
        { label: "Imsak", time: prayer.imsak, icon: "🌑" },
        { label: "Subuh", time: prayer.fajr, icon: "🌒" },
        { label: "Syuruk", time: prayer.syuruk, icon: "🌅" },
        { label: "Zohor", time: prayer.dhuhr, icon: "☀️" },
        { label: "Asar", time: prayer.asr, icon: "🌤️" },
        { label: "Maghrib", time: prayer.maghrib, icon: "🌇" },
        { label: "Isyak", time: prayer.isha, icon: "🌙" },
      ]
    : [];

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <h2 className="text-lg font-semibold text-amber-300">
          🕌 Prayer Times
        </h2>
        <select
          value={zone}
          onChange={(e) => setZone(e.target.value)}
          className="bg-emerald-900 text-emerald-200 border border-emerald-700 rounded-lg
                     text-xs px-3 py-2 focus:ring-2 focus:ring-amber-400 focus:outline-none
                     max-w-70"
        >
          {ZONES.map((z) => (
            <option key={z.code} value={z.code}>
              {z.code} – {z.label}
            </option>
          ))}
        </select>
      </div>

      {prayer?.hijri && (
        <p className="text-xs text-emerald-400 mb-3">{prayer.hijri}</p>
      )}

      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin h-6 w-6 border-4 border-amber-400 border-t-transparent rounded-full" />
        </div>
      )}

      {error && <p className="text-red-400 text-sm">{error}</p>}

      {!loading && !error && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {times.map((t) => (
            <div
              key={t.label}
              className={`flex flex-col items-center py-3 px-2 rounded-xl border
                ${
                  t.label === "Imsak" || t.label === "Maghrib"
                    ? "bg-amber-500/15 border-amber-500/40"
                    : "bg-emerald-900/50 border-emerald-700/30"
                }
              `}
            >
              <span className="text-xl mb-1">{t.icon}</span>
              <span className="text-[11px] text-emerald-400">{t.label}</span>
              <span className="text-sm font-bold text-amber-300">{t.time}</span>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && (
        <p className="text-[10px] text-emerald-600 mt-3 text-center">
          Source: JAKIM e-Solat via waktusolat.app • Imsak & Maghrib highlighted for fasting
        </p>
      )}
    </div>
  );
}
