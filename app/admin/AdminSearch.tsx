"use client";

import { useState } from "react";
import {
  Search,
  PartyPopper,
  X,
  Beef,
  Leaf,
  Pencil,
  Coffee,
  UserCheck,
  UserX,
} from "lucide-react";

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

type FamilyGuest = {
  id: string;
  label: string;
};

type FamilyRsvp = {
  id: string;
  firstName: string;
  lastName: string;
  attending: boolean;
  editToken: string;
  guests: FamilyGuest[];
  createdAt: Date;
};

type EventFilter = "party" | "family";
type StatusFilter = "all" | "attending" | "declined";

type PartyStats = {
  totalGuests: number;
  declined: number;
  totalMeat: number;
  totalVegetarian: number;
};

type FamilyStats = {
  totalGuests: number;
  declined: number;
};

export default function AdminSearch({
  rsvps,
  familyRsvps,
  partyStats,
  familyStats,
}: {
  rsvps: Rsvp[];
  familyRsvps: FamilyRsvp[];
  partyStats: PartyStats;
  familyStats: FamilyStats;
}) {
  const [query, setQuery] = useState("");
  const [eventFilter, setEventFilter] = useState<EventFilter>("party");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const isParty = eventFilter === "party";
  const currentRsvps = isParty ? rsvps : familyRsvps;

  const filtered = currentRsvps.filter((r) => {
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

  const sortByNewest = <T extends { createdAt: Date }>(arr: T[]) =>
    [...arr].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

  const attending = sortByNewest(filtered.filter((r) => r.attending));
  const declined = sortByNewest(filtered.filter((r) => !r.attending));

  const editBasePath = isParty ? "/edit" : "/family/edit";

  return (
    <div>
      {/* Event toggle */}
      <div className="flex gap-2 mb-6">
        <button
          type="button"
          onClick={() => {
            setEventFilter("party");
            setStatusFilter("all");
            setQuery("");
          }}
          className={`flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all cursor-pointer ${
            isParty
              ? "border-blue-600 bg-blue-600 text-white"
              : "border-gray-300 bg-white text-gray-600 hover:border-gray-400"
          }`}
        >
          <PartyPopper className="h-4 w-4" />
          Abendfeier
        </button>
        <button
          type="button"
          onClick={() => {
            setEventFilter("family");
            setStatusFilter("all");
            setQuery("");
          }}
          className={`flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all cursor-pointer ${
            !isParty
              ? "border-blue-600 bg-blue-600 text-white"
              : "border-gray-300 bg-white text-gray-600 hover:border-gray-400"
          }`}
        >
          <Coffee className="h-4 w-4" />
          Nachmittag
        </button>
      </div>

      {/* Stats */}
      {isParty ? (
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard
            icon={<UserCheck className="h-5 w-5 text-blue-600" />}
            label="Zusagen (Personen)"
            value={partyStats.totalGuests}
          />
          <StatCard
            icon={<UserX className="h-5 w-5 text-gray-500" />}
            label="Absagen"
            value={partyStats.declined}
          />
          <StatCard
            icon={<Beef className="h-5 w-5 text-blue-600" />}
            label="Fleisch"
            value={partyStats.totalMeat}
          />
          <StatCard
            icon={<Leaf className="h-5 w-5 text-blue-600" />}
            label="Vegetarisch"
            value={partyStats.totalVegetarian}
          />
        </div>
      ) : (
        <div className="mb-6 grid grid-cols-2 gap-3">
          <StatCard
            icon={<UserCheck className="h-5 w-5 text-blue-600" />}
            label="Zusagen (Personen)"
            value={familyStats.totalGuests}
          />
          <StatCard
            icon={<UserX className="h-5 w-5 text-gray-500" />}
            label="Absagen"
            value={familyStats.declined}
          />
        </div>
      )}

      {/* Search & Status Filter */}
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
            active={statusFilter === "all"}
            onClick={() => setStatusFilter("all")}
            label="Alle"
          />
          <FilterButton
            active={statusFilter === "attending"}
            onClick={() => setStatusFilter("attending")}
            label="Zusagen"
          />
          <FilterButton
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
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-black">
                        {rsvp.firstName} {rsvp.lastName}
                      </h3>
                      <a
                        href={`${editBasePath}/${rsvp.editToken}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-blue-600 transition"
                        title="Bearbeiten"
                      >
                        <Pencil className="h-4 w-4" />
                      </a>
                    </div>
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
                          {isParty && "mealPreference" in g ? (
                            <>
                              {(g as Guest).mealPreference === "meat" ? (
                                <Beef className="h-3 w-3" />
                              ) : (
                                <Leaf className="h-3 w-3" />
                              )}
                              {g.label} —{" "}
                              {(g as Guest).mealPreference === "meat"
                                ? "Fleisch"
                                : "Vegetarisch"}
                            </>
                          ) : (
                            g.label
                          )}
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
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-black">
                        {rsvp.firstName} {rsvp.lastName}
                      </h3>
                      <a
                        href={`${editBasePath}/${rsvp.editToken}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-blue-600 transition"
                        title="Bearbeiten"
                      >
                        <Pencil className="h-4 w-4" />
                      </a>
                    </div>
                    <span className="text-xs text-gray-400">Abgesagt</span>
                  </div>
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

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          {label}
        </span>
      </div>
      <p className="text-3xl font-bold text-black">{value}</p>
    </div>
  );
}

function FilterButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition-all cursor-pointer ${
        active
          ? "border-blue-600 bg-blue-600 text-white"
          : "border-gray-300 bg-white text-gray-600 hover:border-gray-400"
      }`}
    >
      {label}
    </button>
  );
}
