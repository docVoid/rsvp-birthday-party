"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type GuestInput = {
  label: string;
  mealPreference: "meat" | "vegetarian";
};

export type RsvpFormState = {
  success: boolean;
  editToken?: string;
  error?: string;
};

export async function createRsvp(
  _prevState: RsvpFormState,
  formData: FormData,
): Promise<RsvpFormState> {
  const firstName = formData.get("firstName")?.toString().trim();
  const lastName = formData.get("lastName")?.toString().trim();
  const attending = formData.get("attending") === "yes";
  const guestCount = parseInt(formData.get("guestCount")?.toString() || "1");
  const guestsJson = formData.get("guests")?.toString();

  if (!firstName || !lastName) {
    return { success: false, error: "Vor- und Nachname sind erforderlich." };
  }

  if (firstName.length > 100 || lastName.length > 100) {
    return {
      success: false,
      error: "Name darf maximal 100 Zeichen lang sein.",
    };
  }

  let guests: GuestInput[] = [];
  if (attending) {
    if (guestCount < 1 || guestCount > 6) {
      return {
        success: false,
        error: "Personenanzahl muss zwischen 1 und 6 liegen.",
      };
    }
    if (guestsJson) {
      try {
        guests = JSON.parse(guestsJson);
      } catch {
        return { success: false, error: "Ungültige Gästedaten." };
      }
    }
    if (guests.length !== guestCount) {
      return {
        success: false,
        error: "Essenspräferenz für alle Personen angeben.",
      };
    }
    for (const g of guests) {
      if (!g.label || g.label.length > 100) {
        return { success: false, error: "Ungültiger Gastname." };
      }
      if (g.mealPreference !== "meat" && g.mealPreference !== "vegetarian") {
        return { success: false, error: "Ungültige Essenspräferenz." };
      }
    }
  }

  const rsvp = await prisma.rsvp.create({
    data: {
      firstName,
      lastName,
      attending,
      guests: attending
        ? {
            create: guests.map((g) => ({
              label: g.label,
              mealPreference: g.mealPreference,
            })),
          }
        : undefined,
    },
  });

  revalidatePath("/admin");

  return { success: true, editToken: rsvp.editToken };
}

export async function updateRsvp(
  editToken: string,
  _prevState: RsvpFormState,
  formData: FormData,
): Promise<RsvpFormState> {
  const firstName = formData.get("firstName")?.toString().trim();
  const lastName = formData.get("lastName")?.toString().trim();
  const attending = formData.get("attending") === "yes";
  const guestCount = parseInt(formData.get("guestCount")?.toString() || "1");
  const guestsJson = formData.get("guests")?.toString();

  if (!firstName || !lastName) {
    return { success: false, error: "Vor- und Nachname sind erforderlich." };
  }

  if (firstName.length > 100 || lastName.length > 100) {
    return {
      success: false,
      error: "Name darf maximal 100 Zeichen lang sein.",
    };
  }

  const existing = await prisma.rsvp.findUnique({ where: { editToken } });
  if (!existing) {
    return { success: false, error: "Anmeldung nicht gefunden." };
  }

  let guests: GuestInput[] = [];
  if (attending) {
    if (guestCount < 1 || guestCount > 6) {
      return {
        success: false,
        error: "Personenanzahl muss zwischen 1 und 6 liegen.",
      };
    }
    if (guestsJson) {
      try {
        guests = JSON.parse(guestsJson);
      } catch {
        return { success: false, error: "Ungültige Gästedaten." };
      }
    }
    if (guests.length !== guestCount) {
      return {
        success: false,
        error: "Essenspräferenz für alle Personen angeben.",
      };
    }
    for (const g of guests) {
      if (!g.label || g.label.length > 100) {
        return { success: false, error: "Ungültiger Gastname." };
      }
      if (g.mealPreference !== "meat" && g.mealPreference !== "vegetarian") {
        return { success: false, error: "Ungültige Essenspräferenz." };
      }
    }
  }

  await prisma.guest.deleteMany({ where: { rsvpId: existing.id } });

  await prisma.rsvp.update({
    where: { editToken },
    data: {
      firstName,
      lastName,
      attending,
      guests: attending
        ? {
            create: guests.map((g) => ({
              label: g.label,
              mealPreference: g.mealPreference,
            })),
          }
        : undefined,
    },
  });

  revalidatePath("/admin");

  return { success: true, editToken };
}

export async function getRsvpByToken(editToken: string) {
  return prisma.rsvp.findUnique({
    where: { editToken },
    include: { guests: true },
  });
}

export async function getAllRsvps() {
  return prisma.rsvp.findMany({
    include: { guests: true },
    orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
  });
}
