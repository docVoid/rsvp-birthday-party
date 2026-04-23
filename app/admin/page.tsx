import { Users, UserCheck, UserX, Beef, Leaf, Search } from "lucide-react";
import { getAllRsvps } from "@/lib/actions";
import AdminSearch from "./AdminSearch";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const rsvps = await getAllRsvps();

  const attending = rsvps.filter((r) => r.attending);
  const declined = rsvps.filter((r) => !r.attending);
  const totalGuests = attending.reduce((sum, r) => sum + r.guests.length, 0);
  const totalMeat = attending.reduce(
    (sum, r) =>
      sum + r.guests.filter((g) => g.mealPreference === "meat").length,
    0,
  );
  const totalVegetarian = attending.reduce(
    (sum, r) =>
      sum + r.guests.filter((g) => g.mealPreference === "vegetarian").length,
    0,
  );

  return (
    <main className="flex flex-1 flex-col px-4 py-8 sm:py-12">
      <div className="mx-auto w-full max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Admin Dashboard
          </h1>
          <p className="mt-1 text-gray-500">Übersicht aller Anmeldungen</p>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard
            icon={<UserCheck className="h-5 w-5 text-emerald-500" />}
            label="Zusagen (Personen)"
            value={totalGuests}
            color="emerald"
          />
          <StatCard
            icon={<UserX className="h-5 w-5 text-rose-500" />}
            label="Absagen"
            value={declined.length}
            color="rose"
          />
          <StatCard
            icon={<Beef className="h-5 w-5 text-amber-500" />}
            label="Fleisch"
            value={totalMeat}
            color="amber"
          />
          <StatCard
            icon={<Leaf className="h-5 w-5 text-green-500" />}
            label="Vegetarisch"
            value={totalVegetarian}
            color="green"
          />
        </div>

        {/* Guest list with search */}
        <AdminSearch rsvps={rsvps} />
      </div>
    </main>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="rounded-2xl border border-white/60 bg-white/50 p-4 shadow-sm backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          {label}
        </span>
      </div>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
}
