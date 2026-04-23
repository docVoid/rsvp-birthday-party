import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import RsvpForm from "@/app/components/RsvpForm";
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
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-12 sm:py-20">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Anmeldung bearbeiten
        </h1>
        <p className="mt-2 text-gray-600">
          Aktualisiere deine Angaben für die Feier.
        </p>
      </div>

      <div className="w-full max-w-lg">
        <div className="rounded-2xl border border-white/60 bg-white/50 p-6 shadow-xl shadow-rose-100/30 backdrop-blur-md sm:p-8">
          <RsvpForm action={boundAction} existingData={rsvp} isEdit />
        </div>
      </div>

      <a
        href="/"
        className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-rose-500 hover:text-rose-600 transition"
      >
        <ArrowLeft className="h-4 w-4" />
        Zurück zur Startseite
      </a>
    </main>
  );
}
