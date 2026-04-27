import { Users, UserCheck, UserX, Beef, Leaf, Search } from "lucide-react";
import { getAllRsvps } from "@/lib/actions";
import AdminSearch from "./AdminSearch";
import AdminLogin from "./AdminLogin";
import { isAdminAuthenticated } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    return <AdminLogin />;
  }

  const rsvps = await getAllRsvps();

  const attending = rsvps.filter((r: any) => r.attending);
  const declined = rsvps.filter((r: any) => !r.attending);
  const totalGuests = attending.reduce(
    (sum: number, r: any) => sum + r.guests.length,
    0,
  );
  const totalMeat = attending.reduce(
    (sum: number, r: any) =>
      sum + r.guests.filter((g: any) => g.mealPreference === "meat").length,
    0,
  );
  const totalVegetarian = attending.reduce(
    (sum: number, r: any) =>
      sum +
      r.guests.filter((g: any) => g.mealPreference === "vegetarian").length,
    0,
  );

  return (
    <main className="flex flex-1 flex-col px-4 py-8 sm:py-12">
      <div className="mx-auto w-full max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-black">
            Übersicht aller Anmeldungen
          </h1>
          <p className="mt-1 text-gray-500">30er Thomas</p>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard
            icon={<UserCheck className="h-5 w-5 text-blue-600" />}
            label="Zusagen (Personen)"
            value={totalGuests}
          />
          <StatCard
            icon={<UserX className="h-5 w-5 text-gray-500" />}
            label="Absagen"
            value={declined.length}
          />
          <StatCard
            icon={<Beef className="h-5 w-5 text-blue-600" />}
            label="Fleisch"
            value={totalMeat}
          />
          <StatCard
            icon={<Leaf className="h-5 w-5 text-blue-600" />}
            label="Vegetarisch"
            value={totalVegetarian}
          />
        </div>

        {/* Guest list with search and filter */}
        <AdminSearch rsvps={rsvps} />
      </div>
    </main>
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
