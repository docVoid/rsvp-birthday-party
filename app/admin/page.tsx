import { UserCheck, UserX, Beef, Leaf, Users, Coffee } from "lucide-react";
import { getAllRsvps } from "@/lib/actions";
import { getAllFamilyRsvps } from "@/lib/familyActions";
import AdminSearch from "./AdminSearch";
import AdminLogin from "./AdminLogin";
import { isAdminAuthenticated } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    return <AdminLogin />;
  }

  const [rsvps, familyRsvps] = await Promise.all([
    getAllRsvps(),
    getAllFamilyRsvps(),
  ]);

  // Party stats
  const partyAttending = rsvps.filter((r: any) => r.attending);
  const partyDeclined = rsvps.filter((r: any) => !r.attending);
  const partyTotalGuests = partyAttending.reduce(
    (sum: number, r: any) => sum + r.guests.length,
    0,
  );
  const partyTotalMeat = partyAttending.reduce(
    (sum: number, r: any) =>
      sum + r.guests.filter((g: any) => g.mealPreference === "meat").length,
    0,
  );
  const partyTotalVegetarian = partyAttending.reduce(
    (sum: number, r: any) =>
      sum +
      r.guests.filter((g: any) => g.mealPreference === "vegetarian").length,
    0,
  );

  // Family stats
  const familyAttending = familyRsvps.filter((r: any) => r.attending);
  const familyDeclined = familyRsvps.filter((r: any) => !r.attending);
  const familyTotalGuests = familyAttending.reduce(
    (sum: number, r: any) => sum + r.guests.length,
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

        {/* Guest list with search, event filter, and status filter */}
        <AdminSearch
          rsvps={rsvps}
          familyRsvps={familyRsvps}
          partyStats={{
            totalGuests: partyTotalGuests,
            declined: partyDeclined.length,
            totalMeat: partyTotalMeat,
            totalVegetarian: partyTotalVegetarian,
          }}
          familyStats={{
            totalGuests: familyTotalGuests,
            declined: familyDeclined.length,
          }}
        />
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
