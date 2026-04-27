import type { Metadata } from "next";
import { Sparkles, CalendarDays, MapPin, Coffee } from "lucide-react";
import FamilyRsvpForm from "@/app/components/FamilyRsvpForm";
import { createFamilyRsvp } from "@/lib/familyActions";

export const metadata: Metadata = {
  title: "☕ Senioren Nachmittag – Kaffee & Kuchen",
  description:
    "Du bist zum Kaffee und Kuchen eingeladen! Sag mir Bescheid, ob du dabei bist.",
  openGraph: {
    title: "☕ Senioren Nachmittag – Kaffee & Kuchen",
    description:
      "Du bist zum Kaffee und Kuchen eingeladen! Sag mir Bescheid, ob du dabei bist.",
    images: [
      {
        url: "/einladung-nachmittag.jpeg",
        width: 1200,
        height: 630,
        alt: "Einladung zum Senioren Nachmittag",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "☕ Senioren Nachmittag – Kaffee & Kuchen",
    description:
      "Du bist zum Kaffee und Kuchen eingeladen! Sag mir Bescheid, ob du dabei bist.",
    images: ["/einladung-nachmittag.jpeg"],
  },
};

export default function FamilyPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-12">
      {/* Hero */}
      <div className="mb-8 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm font-medium text-blue-600">
          <Coffee className="h-4 w-4" />
          Senioren Nachmittag
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-black sm:text-5xl">
          Kaffee &amp; Kuchen
        </h1>
        <p className="mt-4 text-base text-gray-600 max-w-md mx-auto">
          Gemütliches Beisammensein — Ich freue mich auf dich!
        </p>
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-3 text-sm text-gray-500">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="h-4 w-4 text-blue-600" />
            Samstag, 26. September 2026 — 16:00 Uhr
          </span>
          <span className="hidden sm:inline text-gray-300">•</span>
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-blue-600" />
            Feuerwehrhaus Eggingen
          </span>
        </div>
      </div>

      {/* Form card */}
      <div className="w-full max-w-lg">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <FamilyRsvpForm action={createFamilyRsvp} />
        </div>
      </div>
    </main>
  );
}
