import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import FamilyRsvpForm from "@/app/components/FamilyRsvpForm";
import BackButton from "@/app/components/BackButton";
import { getFamilyRsvpByToken, updateFamilyRsvp } from "@/lib/familyActions";

export default async function FamilyEditPage({
  params,
}: {
  params: Promise<{ editToken: string }>;
}) {
  const { editToken } = await params;
  const rsvp = await getFamilyRsvpByToken(editToken);

  if (!rsvp) {
    notFound();
  }

  const boundAction = updateFamilyRsvp.bind(null, editToken);

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-12">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-extrabold text-black">
          Anmeldung bearbeiten
        </h1>
        <p className="mt-2 text-gray-600">
          Aktualisiere deine Angaben für den Nachmittag.
        </p>
      </div>

      <div className="w-full max-w-lg">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <FamilyRsvpForm action={boundAction} existingData={rsvp} isEdit />
        </div>
      </div>

      <BackButton
        fallbackHref="/family"
        className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 transition cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4" />
        Zurück
      </BackButton>
    </main>
  );
}
