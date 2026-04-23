import { CheckCircle, Copy, ExternalLink } from "lucide-react";
import CopyButton from "./CopyButton";

export default async function SuccessPage({
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

  const editUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/edit/${token}`;

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-20">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border-2 border-blue-600 bg-blue-50">
          <CheckCircle className="h-8 w-8 text-blue-600" />
        </div>
        <h1 className="text-3xl font-extrabold text-black">Vielen Dank!</h1>
        <p className="mt-3 text-base text-gray-600">
          Deine Anmeldung wurde erfolgreich gespeichert.
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

        <a
          href="/"
          className="mt-6 inline-block text-sm font-medium text-blue-600 hover:text-blue-700 transition"
        >
          ← Zurück zur Startseite
        </a>
      </div>
    </main>
  );
}
