// Malaysian zones for JAKIM e-Solat / waktusolat.app
export const ZONES = [
  { code: "JHR01", label: "Pulau Aur dan Pulau Pemanggil" },
  { code: "JHR02", label: "Johor Bahru, Kota Tinggi, Mersing, Kulai" },
  { code: "JHR03", label: "Kluang, Pontian" },
  { code: "JHR04", label: "Batu Pahat, Muar, Segamat, Gemas" },
  { code: "KDH01", label: "Kota Setar, Kubang Pasu, Pokok Sena" },
  { code: "KDH02", label: "Kuala Muda, Yan, Pendang" },
  { code: "KDH03", label: "Padang Terap, Sik" },
  { code: "KDH04", label: "Baling" },
  { code: "KDH05", label: "Kulim, Bandar Baharu" },
  { code: "KDH06", label: "Langkawi" },
  { code: "KDH07", label: "Gunung Jerai" },
  { code: "KTN01", label: "Bachok, Kota Bharu, Machang, Pasir Mas, Pasir Puteh, Tanah Merah, Tumpat, Kuala Krai, Mukim Chiku" },
  { code: "KTN03", label: "Jeli, Gua Musang (Daerah Galas dan Bertam)" },
  { code: "MLK01", label: "Melaka" },
  { code: "NGS01", label: "Tampin, Jempol" },
  { code: "NGS02", label: "Jelebu, Kuala Pilah, Rembau" },
  { code: "PHG01", label: "Rompin, Muadzam Shah" },
  { code: "PHG02", label: "Kuantan, Pekan, Maran" },
  { code: "PHG03", label: "Jerantut, Temerloh, Bera, Chenor, Jengka" },
  { code: "PHG04", label: "Bentong, Lipis, Raub" },
  { code: "PHG05", label: "Genting Highlands, Cameron Highlands" },
  { code: "PLS01", label: "Perlis" },
  { code: "PNG01", label: "Penang Island, Seberang Perai" },
  { code: "PRK01", label: "Tapah, Slim River, Tanjung Malim" },
  { code: "PRK02", label: "Kuala Kangsar, Sg Siput, Ipoh, Kampar, Batu Gajah, Seri Iskandar" },
  { code: "PRK03", label: "Lenggong, Pengkalan Hulu, Grik" },
  { code: "PRK04", label: "Temengor, Belum" },
  { code: "PRK05", label: "Teluk Intan, Bagan Datoh, Kg Gajah, Seri Iskandar, Beruas, Parit, Lumut, Sitiawan, Manjung" },
  { code: "PRK06", label: "Selama, Taiping, Bagan Serai, Parit Buntar" },
  { code: "PRK07", label: "Bukit Larut" },
  { code: "SBH01", label: "Bahagian Sandakan (Timur), ## Kg Selamat, ## ## Batu Putih, Kinabatangan, Beluran, Telupid" },
  { code: "SBH02", label: "Beluran, ## Sandakan (Barat), Tuaran, Ranau, Kota Belud" },
  { code: "SBH03", label: "Lahad Datu, Kunak, Semporna, Tawau, Kalabakan" },
  { code: "SBH04", label: "Pensiangan, Keningau, Tambunan, Nabawan" },
  { code: "SBH05", label: "Kota Kinabalu, Penampang, Papar, Putatan" },
  { code: "SBH06", label: "Gunung Kinabalu" },
  { code: "SBH07", label: "Kudat, Pitas, Kota Marudu, Matunggong" },
  { code: "SBH08", label: "Sipitang, Beaufort, Kuala Penyu, Membakut" },
  { code: "SBH09", label: "Labuan" },
  { code: "SGR01", label: "Gombak, Hulu Selangor, Rawang, Petaling, Sepang, Hulu Langat, Kelang, Shah Alam, Kuala Selangor" },
  { code: "SGR02", label: "Sabak Bernam, Kuala Langat" },
  { code: "SGR03", label: "Kuala Lumpur, Putrajaya" },
  { code: "SWK01", label: "Limbang, Sundar, Lawas, Niah, Miri, Bekenu, Sibuti" },
  { code: "SWK02", label: "Kuching, Bau, Lundu, Sematan, Samarahan, Simunjan, Serian, Sri Aman" },
  { code: "SWK03", label: "Betong, Saratok, Pusa, Kabong, Roban, Debak" },
  { code: "SWK04", label: "Sibu, Kanowit, Kapit, Song, Belaga" },
  { code: "SWK05", label: "Bintulu, Tatau" },
  { code: "SWK06", label: "Sarikei, Julau, Bintangor, Rajang" },
  { code: "SWK07", label: "Mukah, Dalat, Daro, Igan, Oya, Balingian, Matu" },
  { code: "TRG01", label: "Kuala Terengganu, Marang, Kuala Nerus" },
  { code: "TRG02", label: "Besut, Setiu" },
  { code: "TRG03", label: "Hulu Terengganu" },
  { code: "TRG04", label: "Dungun, Kemaman" },
  { code: "WLY01", label: "Kuala Lumpur, Putrajaya" },
  { code: "WLY02", label: "Labuan" },
] as const;

export type ZoneCode = (typeof ZONES)[number]["code"];

export interface PrayerTime {
  hijri: string;
  date: string;
  day: string;
  imsak: string;
  fajr: string;
  syuruk: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

/**
 * Fetch today's prayer time for a given JAKIM zone.
 * Uses api.waktusolat.app which wraps the JAKIM e-Solat API.
 */
export async function fetchPrayerTimes(zone: string): Promise<PrayerTime | null> {
  try {
    const res = await fetch(
      `https://api.waktusolat.app/v2/solat/${zone}`,
      { next: { revalidate: 3600 } } // cache for 1 hour
    );
    if (!res.ok) return null;

    const data = await res.json();
    // The API returns an array of prayer times; find today's entry
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    const prayers = data.prayers ?? data.data ?? [];
    const todayEntry = prayers.find((p: Record<string, string>) => {
      const d = p.date ?? p.Date;
      return d?.startsWith(today);
    });

    if (!todayEntry) {
      // Fallback: return the first entry (current day)
      const p = prayers[0];
      if (!p) return null;
      return normalisePrayer(p);
    }

    return normalisePrayer(todayEntry);
  } catch (err) {
    console.error("Failed to fetch prayer times:", err);
    return null;
  }
}

function normalisePrayer(p: Record<string, string>): PrayerTime {
  return {
    hijri: p.hijri ?? p.Hijri ?? "",
    date: p.date ?? p.Date ?? "",
    day: p.day ?? p.Day ?? "",
    imsak: formatTime(p.imsak ?? p.Imsak ?? ""),
    fajr: formatTime(p.fajr ?? p.Fajr ?? p.subuh ?? p.Subuh ?? ""),
    syuruk: formatTime(p.syuruk ?? p.Syuruk ?? ""),
    dhuhr: formatTime(p.dhuhr ?? p.Dhuhr ?? p.zohor ?? p.Zohor ?? ""),
    asr: formatTime(p.asr ?? p.Asr ?? ""),
    maghrib: formatTime(p.maghrib ?? p.Maghrib ?? ""),
    isha: formatTime(p.isha ?? p.Isha ?? p.isyak ?? p.Isyak ?? ""),
  };
}

/** Strip seconds from "HH:MM:SS" → "HH:MM" */
function formatTime(t: string): string {
  if (!t) return "-";
  const parts = t.split(":");
  return parts.length >= 2 ? `${parts[0]}:${parts[1]}` : t;
}
