import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import RsvpForm from "@/app/components/RsvpForm";
import BackButton from "@/app/components/BackButton";
import { getRsvpByToken, updateRsvp } from "@/lib/actions";

export default async function EditPage({
  params,
}: {
  params: Promise<{ editToken: string }>;
}) {
  const { editToken } = await params;
  const rsvp = await getRsvpByToken(editToken);

  if (!rsvp) {
    notFound();
  }

  const boundAction = updateRsvp.bind(null, editToken);

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-12">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-extrabold text-black">
          Anmeldung bearbeiten
        </h1>
        <p className="mt-2 text-gray-600">
          Aktualisiere deine Angaben für die Feier.
        </p>
      </div>

      <div className="w-full max-w-lg">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <RsvpForm action={boundAction} existingData={rsvp} isEdit />
        </div>
      </div>

      <BackButton
        fallbackHref="/"
        className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 transition cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4" />
        Zurück
      </BackButton>
    </main>
  );
}
