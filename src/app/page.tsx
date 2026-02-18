import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import RamadanCalendar from "@/components/RamadanCalendar";
import PrayerTimes from "@/components/PrayerTimes";

export default async function Home() {
  const session = await auth();
  if (!session) redirect("/login");

  const zone =
    (session.user as Record<string, unknown>)?.zone as string ?? "SGR01";

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold bg-linear-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent">
          Ramadan Mubarak, {session.user?.name} 🌙
        </h1>
        <p className="text-sm text-emerald-400 mt-2">
          Track your fasting journey this Ramadan
        </p>
      </div>

      {/* Prayer Times Card */}
      <section className="bg-emerald-900/40 border border-emerald-800/50 rounded-2xl p-5">
        <PrayerTimes defaultZone={zone} />
      </section>

      {/* Fasting Calendar Card */}
      <section className="bg-emerald-900/40 border border-emerald-800/50 rounded-2xl p-5">
        <RamadanCalendar />
      </section>
    </div>
  );
}
