"use client";

import { useEffect, useState, useCallback } from "react";
import { format, isToday, isPast } from "date-fns";
import { RAMADAN_DAYS, dateKey } from "@/lib/ramadan";

interface FastingMap {
  [date: string]: boolean;
}

export default function RamadanCalendar() {
  const [fasting, setFasting] = useState<FastingMap>({});
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<string | null>(null);

  // Fetch existing logs
  const fetchLogs = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/fasting?start=2026-02-18&end=2026-03-19`
      );
      if (!res.ok) return;
      const data = await res.json();
      const map: FastingMap = {};
      for (const log of data.logs) {
        // date comes as "2026-02-18" or with time
        const d = (log.date as string).split("T")[0];
        map[d] = log.is_fasting;
      }
      setFasting(map);
    } catch (err) {
      console.error("Failed to fetch fasting logs", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const toggle = async (day: Date) => {
    const dk = dateKey(day);
    setToggling(dk);
    const current = fasting[dk] ?? false;
    const next = !current;

    // Optimistic update
    setFasting((prev) => ({ ...prev, [dk]: next }));

    try {
      await fetch("/api/fasting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: dk, isFasting: next }),
      });
    } catch {
      // Revert on failure
      setFasting((prev) => ({ ...prev, [dk]: current }));
    } finally {
      setToggling(null);
    }
  };

  const totalFasted = Object.values(fasting).filter(Boolean).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-amber-400 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div>
      {/* Stats bar */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-amber-300">
          🗓️ Ramadan 1447H / 2026
        </h2>
        <span className="text-sm text-emerald-300">
          Fasted: <strong className="text-amber-400">{totalFasted}</strong> / {RAMADAN_DAYS.length} days
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-emerald-900 rounded-full h-2.5 mb-6">
        <div
          className="bg-linear-to-r from-amber-400 to-amber-600 h-2.5 rounded-full transition-all duration-500"
          style={{ width: `${(totalFasted / RAMADAN_DAYS.length) * 100}%` }}
        />
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-7 gap-2">
        {RAMADAN_DAYS.map((day, idx) => {
          const dk = dateKey(day);
          const fasted = fasting[dk] ?? false;
          const today = isToday(day);
          const past = isPast(day) && !today;
          const isToggling = toggling === dk;

          return (
            <button
              key={dk}
              onClick={() => toggle(day)}
              disabled={isToggling}
              className={`
                relative flex flex-col items-center justify-center p-2 rounded-xl
                text-xs sm:text-sm font-medium transition-all duration-200
                border
                ${
                  fasted
                    ? "bg-amber-500/20 border-amber-500 text-amber-300 shadow-lg shadow-amber-500/10"
                    : past
                    ? "bg-red-500/10 border-red-500/30 text-red-300/60"
                    : "bg-emerald-900/50 border-emerald-700/40 text-emerald-300 hover:border-amber-400/60"
                }
                ${today ? "ring-2 ring-amber-400 ring-offset-2 ring-offset-emerald-950" : ""}
                ${isToggling ? "opacity-60" : ""}
              `}
            >
              {/* Day number (Ramadan day) */}
              <span className="text-[10px] text-emerald-400/70">Day {idx + 1}</span>
              <span className="font-bold text-sm">{format(day, "d MMM")}</span>
              {/* Status icon */}
              <span className="mt-1 text-base">
                {fasted ? "✅" : past ? "❌" : "⬜"}
              </span>
              {today && (
                <span className="absolute -top-1 -right-1 text-[10px] bg-amber-500 text-emerald-950 px-1 rounded-md font-bold">
                  TODAY
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
