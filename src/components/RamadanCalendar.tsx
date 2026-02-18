"use client";

import { useEffect, useState, useCallback } from "react";
import { format, isToday, isPast } from "date-fns";
import { RAMADAN_DAYS, RAMADAN_START, RAMADAN_END, dateKey } from "@/lib/ramadan";

export default function RamadanCalendar() {
  // A Set of date strings like "2026-02-19" that are fasted
  const [fastedDates, setFastedDates] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [busyDates, setBusyDates] = useState<Set<string>>(new Set());

  // Fetch existing logs
  const fetchLogs = useCallback(async () => {
    try {
      const start = dateKey(RAMADAN_START);
      const end = dateKey(RAMADAN_END);
      const res = await fetch(`/api/fasting?start=${start}&end=${end}`);
      if (!res.ok) return;
      const data = await res.json();
      setFastedDates(new Set(data.dates as string[]));
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
    if (busyDates.has(dk)) return; // prevent double-click

    const isFasted = fastedDates.has(dk);

    // Mark busy
    setBusyDates((prev) => new Set(prev).add(dk));

    // Optimistic update
    setFastedDates((prev) => {
      const next = new Set(prev);
      if (isFasted) {
        next.delete(dk);
      } else {
        next.add(dk);
      }
      return next;
    });

    try {
      let res: Response;
      if (isFasted) {
        // Untick → DELETE the row
        res = await fetch(`/api/fasting?date=${dk}`, { method: "DELETE" });
      } else {
        // Tick → INSERT a row
        res = await fetch("/api/fasting", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ date: dk }),
        });
      }
      if (!res.ok) {
        // Revert on server error
        setFastedDates((prev) => {
          const reverted = new Set(prev);
          if (isFasted) reverted.add(dk);
          else reverted.delete(dk);
          return reverted;
        });
      }
    } catch {
      // Revert on network error
      setFastedDates((prev) => {
        const reverted = new Set(prev);
        if (isFasted) reverted.add(dk);
        else reverted.delete(dk);
        return reverted;
      });
    } finally {
      setBusyDates((prev) => {
        const next = new Set(prev);
        next.delete(dk);
        return next;
      });
    }
  };

  const totalFasted = fastedDates.size;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-[#58a6ff] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div>
      {/* Stats bar */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-[#e6edf3]">
          🗓️ Ramadan 1447H / 2026
        </h2>
        <span className="text-sm text-[#8b949e]">
          Fasted: <strong className="text-[#3fb950]">{totalFasted}</strong> / {RAMADAN_DAYS.length} days
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-[#21262d] rounded-full h-2.5 mb-6">
        <div
          className="bg-linear-to-r from-[#238636] to-[#3fb950] h-2.5 rounded-full transition-all duration-500"
          style={{ width: `${(totalFasted / RAMADAN_DAYS.length) * 100}%` }}
        />
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-7 gap-2">
        {RAMADAN_DAYS.map((day, idx) => {
          const dk = dateKey(day);
          const fasted = fastedDates.has(dk);
          const today = isToday(day);
          const past = isPast(day) && !today;
          const isBusy = busyDates.has(dk);

          return (
            <button
              key={dk}
              onClick={() => toggle(day)}
              disabled={isBusy}
              className={`
                relative flex flex-col items-center justify-center p-2 rounded-xl
                text-xs sm:text-sm font-medium transition-all duration-200
                border
                ${
                  fasted
                    ? "bg-[#238636]/20 border-[#3fb950] text-[#3fb950] shadow-lg shadow-[#3fb950]/10"
                    : past
                    ? "bg-[#da3633]/10 border-[#da3633]/30 text-[#f85149]/60"
                    : "bg-[#161b22] border-[#30363d] text-[#8b949e] hover:border-[#58a6ff]/60"
                }
                ${today ? "ring-2 ring-[#58a6ff] ring-offset-2 ring-offset-[#0d1117]" : ""}
                ${isBusy ? "opacity-60" : ""}
              `}
            >
              {/* Day number (Ramadan day) */}
              <span className="text-[10px] text-[#484f58]">Day {idx + 1}</span>
              <span className="font-bold text-sm">{format(day, "d MMM")}</span>
              {/* Status icon */}
              <span className="mt-1 text-base">
                {fasted ? "✅" : past ? "❌" : "⬜"}
              </span>
              {today && (
                <span className="absolute -top-1 -right-1 text-[10px] bg-[#58a6ff] text-[#0d1117] px-1 rounded-md font-bold">
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
