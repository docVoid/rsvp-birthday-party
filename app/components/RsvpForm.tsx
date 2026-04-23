"use client";

import { useActionState, useState, useEffect, useRef } from "react";
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
  const firstNameRef = useRef<HTMLInputElement>(null);
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
    return [{ label: "", mealPreference: "meat" }];
  });

  useEffect(() => {
    if (state.success && state.editToken && !isEdit) {
      router.push(`/success?token=${state.editToken}`);
    }
  }, [state.success, state.editToken, isEdit, router]);

  // Sync first guest label with firstName field
  useEffect(() => {
    if (!isEdit && firstNameRef.current) {
      const handler = () => {
        const val = firstNameRef.current?.value ?? "";
        setGuests((prev) =>
          prev.map((g, i) => (i === 0 ? { ...g, label: val } : g)),
        );
      };
      const input = firstNameRef.current;
      input.addEventListener("input", handler);
      return () => input.removeEventListener("input", handler);
    }
  }, [isEdit]);

  function handleGuestCountChange(newCount: number) {
    if (newCount < 1) newCount = 1;
    if (newCount > 6) newCount = 6;
    setGuestCount(newCount);

    setGuests((prev) => {
      if (newCount > prev.length) {
        const added = Array.from({ length: newCount - prev.length }, () => ({
          label: "",
          mealPreference: "meat" as const,
        }));
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
            className="block text-sm font-medium text-black mb-1"
          >
            Vorname
          </label>
          <input
            ref={firstNameRef}
            type="text"
            id="firstName"
            name="firstName"
            required
            maxLength={100}
            defaultValue={existingData?.firstName ?? ""}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-black placeholder-gray-400 transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none"
            placeholder="Max"
          />
        </div>
        <div>
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-black mb-1"
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
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-black placeholder-gray-400 transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none"
            placeholder="Mustermann"
          />
        </div>
      </div>

      {/* Attending status */}
      <div>
        <label className="block text-sm font-medium text-black mb-3">
          Kommst du?
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setAttending(true)}
            className={`flex items-center justify-center gap-2 rounded-lg border-2 px-4 py-2.5 text-sm font-medium transition-all ${
              attending
                ? "border-blue-600 bg-blue-50 text-blue-700"
                : "border-gray-300 bg-white text-gray-500 hover:border-gray-400"
            }`}
          >
            <PartyPopper className="h-4 w-4" />
            Ich komme!
          </button>
          <button
            type="button"
            onClick={() => setAttending(false)}
            className={`flex items-center justify-center gap-2 rounded-lg border-2 px-4 py-2.5 text-sm font-medium transition-all ${
              !attending
                ? "border-black bg-gray-100 text-black"
                : "border-gray-300 bg-white text-gray-500 hover:border-gray-400"
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
        <div className="space-y-5">
          {/* Guest count selector */}
          <div>
            <label className="block text-sm font-medium text-black mb-3">
              <UserPlus className="inline h-4 w-4 mr-1 -mt-0.5" />
              Wie viele Personen insgesamt? (inkl. dir)
            </label>
            <div className="flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => handleGuestCountChange(guestCount - 1)}
                disabled={guestCount <= 1}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-600 transition hover:border-blue-600 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="text-3xl font-bold text-blue-600 min-w-[3ch] text-center">
                {guestCount}
              </span>
              <button
                type="button"
                onClick={() => handleGuestCountChange(guestCount + 1)}
                disabled={guestCount >= 6}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-600 transition hover:border-blue-600 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <input type="hidden" name="guestCount" value={guestCount} />
          </div>

          {/* Meal preferences */}
          <div>
            <label className="block text-sm font-medium text-black mb-3">
              <Utensils className="inline h-4 w-4 mr-1 -mt-0.5" />
              Essenswünsche
            </label>
            <div className="space-y-3">
              {guests.map((guest, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-gray-200 bg-gray-50 p-3"
                >
                  <div className="mb-2">
                    <input
                      type="text"
                      value={guest.label}
                      onChange={(e) => updateGuest(i, "label", e.target.value)}
                      required
                      maxLength={100}
                      readOnly={i === 0 && !isEdit}
                      className={`w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-black placeholder-gray-400 transition focus:border-blue-600 focus:ring-1 focus:ring-blue-100 focus:outline-none ${
                        i === 0 && !isEdit ? "bg-gray-100 text-gray-500" : ""
                      }`}
                      placeholder={`Vorname ${i + 1}`}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => updateGuest(i, "mealPreference", "meat")}
                      className={`flex items-center justify-center gap-1.5 rounded-md border-2 px-2 py-1.5 text-xs font-medium transition-all ${
                        guest.mealPreference === "meat"
                          ? "border-blue-600 bg-blue-50 text-blue-700"
                          : "border-gray-300 bg-white text-gray-500 hover:border-gray-400"
                      }`}
                    >
                      <Beef className="h-3.5 w-3.5" />
                      Fleisch
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        updateGuest(i, "mealPreference", "vegetarian")
                      }
                      className={`flex items-center justify-center gap-1.5 rounded-md border-2 px-2 py-1.5 text-xs font-medium transition-all ${
                        guest.mealPreference === "vegetarian"
                          ? "border-blue-600 bg-blue-50 text-blue-700"
                          : "border-gray-300 bg-white text-gray-500 hover:border-gray-400"
                      }`}
                    >
                      <Leaf className="h-3.5 w-3.5" />
                      Vegetarisch
                    </button>
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
        <div className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}

      {/* Success message for edit */}
      {isEdit && state.success && (
        <div className="rounded-lg border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-700">
          Deine Anmeldung wurde erfolgreich aktualisiert!
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={pending}
        className="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
      >
        {pending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
        {isEdit ? "Anmeldung aktualisieren" : "Absenden"}
      </button>
    </form>
  );
}
