import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  ),
  title: "🎉 30. Geburtstag – RSVP",
  description: "Du bist eingeladen! Sag mir Bescheid, ob du dabei bist.",
  openGraph: {
    title: "🎉 30. Geburtstag – RSVP",
    description: "Du bist eingeladen! Sag mir Bescheid, ob du dabei bist.",
    images: [
      {
        url: "/Einladung-30er-Thomas.jpg",
        width: 1200,
        height: 630,
        alt: "Einladung zum 30. Geburtstag",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "🎉 30. Geburtstag – RSVP",
    description: "Du bist eingeladen! Sag mir Bescheid, ob du dabei bist.",
    images: ["/Einladung-30er-Thomas.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[var(--background)] font-sans">
        {children}
      </body>
    </html>
  );
}
