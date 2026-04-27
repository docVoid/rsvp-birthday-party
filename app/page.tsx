import { Sparkles, CalendarDays, MapPin } from "lucide-react";
import type { Metadata } from "next";
import RsvpForm from "@/app/components/RsvpForm";
import { createRsvp } from "@/lib/actions";

export const metadata: Metadata = {
  title: "🎉 30. Geburtstag – RSVP",
  description: "Du bist eingeladen! Sag mir Bescheid, ob du dabei bist.",
  openGraph: {
    title: "🎉 30. Geburtstag – RSVP",
    description: "Du bist eingeladen! Sag mir Bescheid, ob du dabei bist.",
    images: [
      {
        url: "/Einladung-30er-Thomas.jpeg",
        width: 1200,
        height: 630,
        alt: "Einladung zum 30. Geburtstag",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "🎉 30. Geburtstag – RSVP",
    description: "Du bist eingeladen! Sag mir Bescheid, ob du dabei bist.",
    images: ["/Einladung-30er-Thomas.jpeg"],
  },
};

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{
    firstName?: string;
    lastName?: string;
    guests?: string;
  }>;
}) {
  const params = await searchParams;

  // Parse prefill data from query params (coming from family success page)
  let prefillGuestNames: string[] | undefined;
  if (params.guests) {
    try {
      prefillGuestNames = JSON.parse(params.guests);
    } catch {
      // ignore invalid JSON
    }
  }

  const prefill =
    params.firstName || params.lastName || prefillGuestNames
      ? {
          firstName: params.firstName ?? "",
          lastName: params.lastName ?? "",
          guestNames: prefillGuestNames,
        }
      : undefined;

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-12">
      {/* Hero */}
      <div className="mb-8 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm font-medium text-blue-600">
          <Sparkles className="h-4 w-4" />
          Opa Thomas wird 30!
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-black sm:text-5xl">
          30. Geburtstag
        </h1>
        <p className="mt-4 text-base text-gray-600 max-w-md mx-auto">
          Senioren Disco in Eggingen - Ich freue mich auf dich!
        </p>
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-3 text-sm text-gray-500">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="h-4 w-4 text-blue-600" />
            Samstag, 26. September 2026 — 19:00 Uhr
          </span>
          <span className="hidden sm:inline text-gray-300">•</span>
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-blue-600" />
            tbd
          </span>
        </div>
      </div>

      {/* Form card */}
      <div className="w-full max-w-lg">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <RsvpForm action={createRsvp} prefill={prefill} />
        </div>
      </div>
    </main>
  );
}
