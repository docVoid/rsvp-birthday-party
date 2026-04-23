"use client";

import { useActionState, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  PartyPopper,
  UserPlus,
  Utensils,
  Send,
  Loader2,
  Minus,
  Plus,
  Beef,
  Leaf,
} from "lucide-react";
import type { RsvpFormState, GuestInput } from "@/lib/actions";

type ExistingGuest = {
  id: string;
  label: string;
  mealPreference: string;
};

type ExistingRsvp = {
  id: string;
  firstName: string;
  lastName: string;
  attending: boolean;
  editToken: string;
  guests: ExistingGuest[];
};

type RsvpFormProps = {
  action: (prev: RsvpFormState, data: FormData) => Promise<RsvpFormState>;
  existingData?: ExistingRsvp | null;
  isEdit?: boolean;
};

export default function RsvpForm({
  action,
  existingData,
  isEdit = false,
}: RsvpFormProps) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(action, {
    success: false,
  });

  const [attending, setAttending] = useState(existingData?.attending ?? true);
  const [guestCount, setGuestCount] = useState(
    existingData?.guests.length || 1,
  );
  const [guests, setGuests] = useState<GuestInput[]>(() => {
    if (existingData?.guests.length) {
      return existingData.guests.map((g) => ({
        label: g.label,
        mealPreference: g.mealPreference as "meat" | "vegetarian",
      }));
    }
    return [{ label: "Person 1", mealPreference: "meat" }];
  });

  useEffect(() => {
    if (state.success && state.editToken && !isEdit) {
      router.push(`/success?token=${state.editToken}`);
    }
  }, [state.success, state.editToken, isEdit, router]);

  function handleGuestCountChange(newCount: number) {
    if (newCount < 1) newCount = 1;
    if (newCount > 6) newCount = 6;
    setGuestCount(newCount);

    setGuests((prev) => {
      if (newCount > prev.length) {
        const added = Array.from(
          { length: newCount - prev.length },
          (_, i) => ({
            label: `Person ${prev.length + i + 1}`,
            mealPreference: "meat" as const,
          }),
        );
        return [...prev, ...added];
      }
      return prev.slice(0, newCount);
    });
  }

  function updateGuest(index: number, field: keyof GuestInput, value: string) {
    setGuests((prev) =>
      prev.map((g, i) => (i === index ? { ...g, [field]: value } : g)),
    );
  }

  return (
    <form action={formAction} className="space-y-6">
      {/* Name fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Vorname
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            required
            maxLength={100}
            defaultValue={existingData?.firstName ?? ""}
            className="w-full rounded-xl border border-gray-200 bg-white/70 px-4 py-3 text-gray-900 placeholder-gray-400 backdrop-blur-sm transition focus:border-rose-400 focus:ring-2 focus:ring-rose-200 focus:outline-none"
            placeholder="Max"
          />
        </div>
        <div>
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Nachname
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            required
            maxLength={100}
            defaultValue={existingData?.lastName ?? ""}
            className="w-full rounded-xl border border-gray-200 bg-white/70 px-4 py-3 text-gray-900 placeholder-gray-400 backdrop-blur-sm transition focus:border-rose-400 focus:ring-2 focus:ring-rose-200 focus:outline-none"
            placeholder="Mustermann"
          />
        </div>
      </div>

      {/* Attending status */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Kommst du?
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setAttending(true)}
            className={`flex items-center justify-center gap-2 rounded-xl border-2 px-4 py-3 font-medium transition-all ${
              attending
                ? "border-emerald-400 bg-emerald-50 text-emerald-700 shadow-sm"
                : "border-gray-200 bg-white/50 text-gray-500 hover:border-gray-300"
            }`}
          >
            <PartyPopper className="h-5 w-5" />
            Ich komme!
          </button>
          <button
            type="button"
            onClick={() => setAttending(false)}
            className={`flex items-center justify-center gap-2 rounded-xl border-2 px-4 py-3 font-medium transition-all ${
              !attending
                ? "border-rose-400 bg-rose-50 text-rose-700 shadow-sm"
                : "border-gray-200 bg-white/50 text-gray-500 hover:border-gray-300"
            }`}
          >
            Leider nicht
          </button>
        </div>
        <input
          type="hidden"
          name="attending"
          value={attending ? "yes" : "no"}
        />
      </div>

      {/* Guest count & meal preferences */}
      {attending && (
        <div className="space-y-5 animate-in fade-in duration-300">
          {/* Guest count selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <UserPlus className="inline h-4 w-4 mr-1 -mt-0.5" />
              Wie viele Personen insgesamt? (inkl. dir)
            </label>
            <div className="flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => handleGuestCountChange(guestCount - 1)}
                disabled={guestCount <= 1}
                className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-gray-200 bg-white text-gray-600 transition hover:border-rose-300 hover:text-rose-500 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="text-3xl font-bold text-rose-600 min-w-[3ch] text-center">
                {guestCount}
              </span>
              <button
                type="button"
                onClick={() => handleGuestCountChange(guestCount + 1)}
                disabled={guestCount >= 6}
                className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-gray-200 bg-white text-gray-600 transition hover:border-rose-300 hover:text-rose-500 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <input type="hidden" name="guestCount" value={guestCount} />
          </div>

          {/* Meal preferences */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <Utensils className="inline h-4 w-4 mr-1 -mt-0.5" />
              Essenswünsche
            </label>
            <div className="space-y-3">
              {guests.map((guest, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-gray-200 bg-white/60 p-4 backdrop-blur-sm"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <input
                      type="text"
                      value={guest.label}
                      onChange={(e) => updateGuest(i, "label", e.target.value)}
                      maxLength={100}
                      className="flex-1 rounded-lg border border-gray-200 bg-white/80 px-3 py-2 text-sm text-gray-900 transition focus:border-rose-400 focus:ring-1 focus:ring-rose-200 focus:outline-none"
                      placeholder={`Person ${i + 1}`}
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => updateGuest(i, "mealPreference", "meat")}
                        className={`flex items-center gap-1.5 rounded-lg border-2 px-3 py-2 text-sm font-medium transition-all ${
                          guest.mealPreference === "meat"
                            ? "border-amber-400 bg-amber-50 text-amber-700"
                            : "border-gray-200 bg-white/50 text-gray-500 hover:border-gray-300"
                        }`}
                      >
                        <Beef className="h-4 w-4" />
                        Fleisch
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          updateGuest(i, "mealPreference", "vegetarian")
                        }
                        className={`flex items-center gap-1.5 rounded-lg border-2 px-3 py-2 text-sm font-medium transition-all ${
                          guest.mealPreference === "vegetarian"
                            ? "border-green-400 bg-green-50 text-green-700"
                            : "border-gray-200 bg-white/50 text-gray-500 hover:border-gray-300"
                        }`}
                      >
                        <Leaf className="h-4 w-4" />
                        Vegetarisch
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <input type="hidden" name="guests" value={JSON.stringify(guests)} />
        </div>
      )}

      {/* Error message */}
      {state.error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}

      {/* Success message for edit */}
      {isEdit && state.success && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          Deine Anmeldung wurde erfolgreich aktualisiert!
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={pending}
        className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-purple-500 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-rose-200/50 transition-all hover:from-rose-600 hover:to-purple-600 hover:shadow-xl hover:shadow-rose-300/50 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
      >
        {pending ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <Send className="h-5 w-5" />
        )}
        {isEdit ? "Anmeldung aktualisieren" : "Absenden"}
      </button>
    </form>
  );
}
