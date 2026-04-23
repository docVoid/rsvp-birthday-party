import { Sparkles, CalendarDays, MapPin } from "lucide-react";
import RsvpForm from "@/app/components/RsvpForm";
import { createRsvp } from "@/lib/actions";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-12 sm:py-20">
      {/* Hero */}
      <div className="mb-8 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-1.5 text-sm font-medium text-rose-600 shadow-sm backdrop-blur-sm">
          <Sparkles className="h-4 w-4" />
          Du bist eingeladen!
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
          <span className="bg-gradient-to-r from-rose-500 via-purple-500 to-amber-500 bg-clip-text text-transparent">
            30. Geburtstag
          </span>
        </h1>
        <p className="mt-4 text-lg text-gray-600 max-w-md mx-auto">
          Feiere mit uns! Sag uns Bescheid, ob du dabei bist.
        </p>
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-3 text-sm text-gray-500">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="h-4 w-4 text-rose-400" />
            Samstag, 15. Mai 2026 — 18:00 Uhr
          </span>
          <span className="hidden sm:inline text-gray-300">•</span>
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-rose-400" />
            Musterstraße 42, Berlin
          </span>
        </div>
      </div>

      {/* Form card */}
      <div className="w-full max-w-lg">
        <div className="rounded-2xl border border-white/60 bg-white/50 p-6 shadow-xl shadow-rose-100/30 backdrop-blur-md sm:p-8">
          <RsvpForm action={createRsvp} />
        </div>
      </div>
    </main>
  );
}
