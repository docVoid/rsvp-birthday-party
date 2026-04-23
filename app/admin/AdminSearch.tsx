"use client";

import { useState } from "react";
import { Search, PartyPopper, X, Beef, Leaf } from "lucide-react";

type Guest = {
  id: string;
  label: string;
  mealPreference: string;
};

type Rsvp = {
  id: string;
  firstName: string;
  lastName: string;
  attending: boolean;
  editToken: string;
  guests: Guest[];
  createdAt: Date;
};

export default function AdminSearch({ rsvps }: { rsvps: Rsvp[] }) {
  const [query, setQuery] = useState("");

  const filtered = rsvps.filter((r) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      r.firstName.toLowerCase().includes(q) ||
      r.lastName.toLowerCase().includes(q)
    );
  });

  const attending = filtered.filter((r) => r.attending);
  const declined = filtered.filter((r) => !r.attending);

  return (
    <div>
      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Nach Name suchen..."
          className="w-full rounded-xl border border-gray-200 bg-white/70 py-3 pl-10 pr-10 text-gray-900 placeholder-gray-400 backdrop-blur-sm transition focus:border-rose-400 focus:ring-2 focus:ring-rose-200 focus:outline-none"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Attending */}
      {attending.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-gray-800">
            <PartyPopper className="h-5 w-5 text-emerald-500" />
            Zusagen ({attending.length})
          </h2>
          <div className="space-y-3">
            {attending.map((rsvp) => (
              <div
                key={rsvp.id}
                className="rounded-2xl border border-emerald-100 bg-white/60 p-4 backdrop-blur-sm"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">
                    {rsvp.firstName} {rsvp.lastName}
                  </h3>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                    {rsvp.guests.length}{" "}
                    {rsvp.guests.length === 1 ? "Person" : "Personen"}
                  </span>
                </div>
                {rsvp.guests.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {rsvp.guests.map((g) => (
                      <span
                        key={g.id}
                        className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium ${
                          g.mealPreference === "meat"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-green-50 text-green-700"
                        }`}
                      >
                        {g.mealPreference === "meat" ? (
                          <Beef className="h-3 w-3" />
                        ) : (
                          <Leaf className="h-3 w-3" />
                        )}
                        {g.label}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Declined */}
      {declined.length > 0 && (
        <section>
          <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-gray-800">
            <X className="h-5 w-5 text-rose-500" />
            Absagen ({declined.length})
          </h2>
          <div className="space-y-3">
            {declined.map((rsvp) => (
              <div
                key={rsvp.id}
                className="rounded-2xl border border-rose-100 bg-white/60 p-4 backdrop-blur-sm"
              >
                <h3 className="font-semibold text-gray-900">
                  {rsvp.firstName} {rsvp.lastName}
                </h3>
                <span className="text-xs text-gray-400">Abgesagt</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {filtered.length === 0 && (
        <div className="rounded-2xl border border-gray-200 bg-white/50 p-8 text-center text-gray-400 backdrop-blur-sm">
          {query
            ? "Keine Ergebnisse gefunden."
            : "Noch keine Anmeldungen vorhanden."}
        </div>
      )}
    </div>
  );
}
