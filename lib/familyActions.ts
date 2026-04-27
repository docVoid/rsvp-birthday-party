"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type FamilyGuestInput = {
  label: string;
};

export type FamilyRsvpFormState = {
  success: boolean;
  editToken?: string;
  error?: string;
};

export async function createFamilyRsvp(
  _prevState: FamilyRsvpFormState,
  formData: FormData,
): Promise<FamilyRsvpFormState> {
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

  let guests: FamilyGuestInput[] = [];
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
        error: "Bitte Namen für alle Personen angeben.",
      };
    }
    for (const g of guests) {
      if (!g.label || g.label.length > 100) {
        return { success: false, error: "Ungültiger Gastname." };
      }
    }
  }

  const rsvp = await prisma.familyRsvp.create({
    data: {
      firstName,
      lastName,
      attending,
      guests: attending
        ? {
            create: guests.map((g) => ({ label: g.label })),
          }
        : undefined,
    },
  });

  revalidatePath("/admin");

  return { success: true, editToken: rsvp.editToken };
}

export async function updateFamilyRsvp(
  editToken: string,
  _prevState: FamilyRsvpFormState,
  formData: FormData,
): Promise<FamilyRsvpFormState> {
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

  const existing = await prisma.familyRsvp.findUnique({
    where: { editToken },
  });
  if (!existing) {
    return { success: false, error: "Anmeldung nicht gefunden." };
  }

  let guests: FamilyGuestInput[] = [];
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
        error: "Bitte Namen für alle Personen angeben.",
      };
    }
    for (const g of guests) {
      if (!g.label || g.label.length > 100) {
        return { success: false, error: "Ungültiger Gastname." };
      }
    }
  }

  await prisma.familyGuest.deleteMany({
    where: { familyRsvpId: existing.id },
  });

  await prisma.familyRsvp.update({
    where: { editToken },
    data: {
      firstName,
      lastName,
      attending,
      guests: attending
        ? {
            create: guests.map((g) => ({ label: g.label })),
          }
        : undefined,
    },
  });

  revalidatePath("/admin");

  return { success: true, editToken };
}

export async function getFamilyRsvpByToken(editToken: string) {
  return prisma.familyRsvp.findUnique({
    where: { editToken },
    include: { guests: true },
  });
}

export async function getAllFamilyRsvps() {
  return prisma.familyRsvp.findMany({
    include: { guests: true },
    orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
  });
}
