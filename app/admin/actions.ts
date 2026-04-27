"use server";

import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

const COOKIE_NAME = "admin_auth";
const COOKIE_MAX_AGE = 60 * 60 * 24; // 24 hours

function getSignedToken(password: string): string {
  const secret = process.env.ADMIN_PASSWORD || "";
  return createHmac("sha256", secret)
    .update("admin-authenticated")
    .digest("hex");
}

export async function verifyAdminPassword(
  _prevState: { error?: string },
  formData: FormData,
): Promise<{ error?: string; success?: boolean }> {
  const password = formData.get("password")?.toString();
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return { error: "Admin-Passwort ist nicht konfiguriert." };
  }

  if (!password) {
    return { error: "Bitte Passwort eingeben." };
  }

  // Timing-safe comparison
  const inputBuf = Buffer.from(password);
  const expectedBuf = Buffer.from(adminPassword);

  if (
    inputBuf.length !== expectedBuf.length ||
    !timingSafeEqual(inputBuf, expectedBuf)
  ) {
    return { error: "Falsches Passwort." };
  }

  const token = getSignedToken(adminPassword);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/admin",
  });

  return { success: true };
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return true; // No password set = no protection

  const cookieStore = await cookies();
  const cookie = cookieStore.get(COOKIE_NAME);
  if (!cookie?.value) return false;

  const expectedToken = getSignedToken(adminPassword);
  try {
    const cookieBuf = Buffer.from(cookie.value);
    const expectedBuf = Buffer.from(expectedToken);
    return (
      cookieBuf.length === expectedBuf.length &&
      timingSafeEqual(cookieBuf, expectedBuf)
    );
  } catch {
    return false;
  }
}
