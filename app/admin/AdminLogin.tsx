"use client";

import { useActionState } from "react";
import { Lock } from "lucide-react";
import { verifyAdminPassword } from "./actions";

export default function AdminLogin() {
  const [state, formAction, isPending] = useActionState(
    verifyAdminPassword,
    {},
  );

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
            <Lock className="h-6 w-6 text-blue-600" />
          </div>
          <h1 className="text-2xl font-extrabold text-black">Admin-Bereich</h1>
          <p className="mt-1 text-sm text-gray-500">
            Bitte Passwort eingeben, um fortzufahren.
          </p>
        </div>

        <form action={formAction}>
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium text-black"
            >
              Passwort
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoFocus
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-black placeholder-gray-400 transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none"
              placeholder="Admin-Passwort"
            />

            {state.error && (
              <p className="mt-2 text-sm text-red-600">{state.error}</p>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="mt-4 w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
            >
              {isPending ? "Wird geprüft..." : "Anmelden"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
