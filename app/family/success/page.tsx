import { CheckCircle, ExternalLink, PartyPopper } from "lucide-react";
import CopyButton from "@/app/success/CopyButton";
import BackButton from "@/app/components/BackButton";
import { getFamilyRsvpByToken } from "@/lib/familyActions";
import { redirect } from "next/navigation";

export default async function FamilySuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <main className="flex flex-1 items-center justify-center px-4 py-20">
        <p className="text-gray-500">Kein Token gefunden.</p>
      </main>
    );
  }

  const rsvp = await getFamilyRsvpByToken(token);

  const editUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "https://invation.pngrtz.com"}/family/edit/${token}`;

  // Build prefill params for party signup from family data
  const prefillParams = new URLSearchParams();
  if (rsvp) {
    prefillParams.set("firstName", rsvp.firstName);
    prefillParams.set("lastName", rsvp.lastName);
    if (rsvp.attending && rsvp.guests.length > 0) {
      prefillParams.set(
        "guests",
        JSON.stringify(rsvp.guests.map((g: { label: string }) => g.label)),
      );
    }
  }
  const partySignupUrl = `/?${prefillParams.toString()}`;

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-20">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border-2 border-blue-600 bg-blue-50">
          <CheckCircle className="h-8 w-8 text-blue-600" />
        </div>
        <h1 className="text-3xl font-extrabold text-black">Vielen Dank!</h1>
        <p className="mt-3 text-base text-gray-600">
          Deine Anmeldung zum Kaffee &amp; Kuchen wurde gespeichert.
        </p>

        <div className="mt-8 rounded-xl border border-gray-200 bg-white p-5">
          <p className="mb-3 text-sm font-medium text-gray-700">
            Speichere diesen Link, um deine Anmeldung später anzupassen:
          </p>
          <div className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2.5 text-sm">
            <ExternalLink className="h-4 w-4 shrink-0 text-gray-400" />
            <span className="truncate text-gray-700">{editUrl}</span>
            <CopyButton text={editUrl} />
          </div>
        </div>

        {/* Party signup CTA */}
        {rsvp?.attending && (
          <div className="mt-6 rounded-xl border-2 border-blue-100 bg-blue-50 p-5">
            <p className="mb-3 text-sm font-semibold text-black">
              <PartyPopper className="inline h-4 w-4 mr-1 -mt-0.5 text-blue-600" />
              Auch zur Party kommen?
            </p>
            <p className="mb-4 text-xs text-gray-600">
              Melde dich gleich auch für die Party am Abend an — deine Daten
              werden vorausgefüllt.
            </p>
            <a
              href={partySignupUrl}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 active:scale-[0.98]"
            >
              <PartyPopper className="h-4 w-4" />
              Zur Party anmelden
            </a>
          </div>
        )}

        <BackButton
          fallbackHref="/family"
          forceHref
          className="mt-6 inline-block text-sm font-medium text-blue-600 hover:text-blue-700 transition cursor-pointer"
        >
          ← Zurück
        </BackButton>
      </div>
    </main>
  );
}
