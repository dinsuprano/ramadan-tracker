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
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#e6edf3]">
          Ramadan Mubarak, {session.user?.name} 🌙
        </h1>
        <p className="text-sm text-[#8b949e] mt-2">
          Track your fasting journey this Ramadan
        </p>
      </div>

      {/* Prayer Times Card */}
      <section className="bg-[#161b22] border border-[#30363d] rounded-2xl p-5">
        <PrayerTimes defaultZone={zone} />
      </section>

      {/* Fasting Calendar Card */}
      <section className="bg-[#161b22] border border-[#30363d] rounded-2xl p-5">
        <RamadanCalendar />
      </section>
    </div>
  );
}
