"use client";

import { useState } from "react";
import { Search, PartyPopper, X, Beef, Leaf, Filter } from "lucide-react";

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

type StatusFilter = "all" | "attending" | "declined";

export default function AdminSearch({ rsvps }: { rsvps: Rsvp[] }) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const filtered = rsvps.filter((r) => {
    const matchesName =
      !query ||
      r.firstName.toLowerCase().includes(query.toLowerCase()) ||
      r.lastName.toLowerCase().includes(query.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "attending" && r.attending) ||
      (statusFilter === "declined" && !r.attending);

    return matchesName && matchesStatus;
  });

  const sortByNewest = (arr: Rsvp[]) =>
    [...arr].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

  const attending = sortByNewest(filtered.filter((r) => r.attending));
  const declined = sortByNewest(filtered.filter((r) => !r.attending));

  return (
    <div>
      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Nach Name suchen..."
            className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-10 text-black placeholder-gray-400 transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none"
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
        <div className="flex gap-2">
          <FilterButton
            className="cursor-pointer"
            active={statusFilter === "all"}
            onClick={() => setStatusFilter("all")}
            label="Alle"
          />
          <FilterButton
            className="cursor-pointer"
            active={statusFilter === "attending"}
            onClick={() => setStatusFilter("attending")}
            label="Zusagen"
          />
          <FilterButton
            className="cursor-pointer"
            active={statusFilter === "declined"}
            onClick={() => setStatusFilter("declined")}
            label="Absagen"
          />
        </div>
      </div>

      {/* Attending */}
      {attending.length > 0 &&
        (statusFilter === "all" || statusFilter === "attending") && (
          <section className="mb-8">
            <h2 className="mb-3 flex items-center gap-2 text-base font-bold text-black">
              <PartyPopper className="h-4 w-4 text-blue-600" />
              Zusagen ({attending.length})
            </h2>
            <div className="space-y-2">
              {attending.map((rsvp) => (
                <div
                  key={rsvp.id}
                  className="rounded-lg border border-gray-200 bg-white p-4"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-black">
                      {rsvp.firstName} {rsvp.lastName}
                    </h3>
                    <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                      {rsvp.guests.length}{" "}
                      {rsvp.guests.length === 1 ? "Person" : "Personen"}
                    </span>
                  </div>
                  {rsvp.guests.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {rsvp.guests.map((g) => (
                        <span
                          key={g.id}
                          className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-gray-50 px-2 py-1 text-xs font-medium text-gray-700"
                        >
                          {g.mealPreference === "meat" ? (
                            <Beef className="h-3 w-3" />
                          ) : (
                            <Leaf className="h-3 w-3" />
                          )}
                          {g.label} —{" "}
                          {g.mealPreference === "meat"
                            ? "Fleisch"
                            : "Vegetarisch"}
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
      {declined.length > 0 &&
        (statusFilter === "all" || statusFilter === "declined") && (
          <section>
            <h2 className="mb-3 flex items-center gap-2 text-base font-bold text-black">
              <X className="h-4 w-4 text-gray-500" />
              Absagen ({declined.length})
            </h2>
            <div className="space-y-2">
              {declined.map((rsvp) => (
                <div
                  key={rsvp.id}
                  className="rounded-lg border border-gray-200 bg-white p-4"
                >
                  <h3 className="font-semibold text-black">
                    {rsvp.firstName} {rsvp.lastName}
                  </h3>
                  <span className="text-xs text-gray-400">Abgesagt</span>
                </div>
              ))}
            </div>
          </section>
        )}

      {filtered.length === 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-400">
          {query || statusFilter !== "all"
            ? "Keine Ergebnisse gefunden."
            : "Noch keine Anmeldungen vorhanden."}
        </div>
      )}
    </div>
  );
}

function FilterButton({
  active,
  onClick,
  label,
  className,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition-all ${
        active
          ? "border-blue-600 bg-blue-600 text-white"
          : "border-gray-300 bg-white text-gray-600 hover:border-gray-400"
      } ${className ?? ""}`}
    >
      {label}
    </button>
  );
}
