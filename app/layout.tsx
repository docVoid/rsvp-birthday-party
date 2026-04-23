import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "🎉 30. Geburtstag – RSVP",
  description: "Du bist eingeladen! Sag uns Bescheid, ob du dabei bist.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-gradient-to-br from-amber-50 via-rose-50 to-purple-50 font-sans">
        {children}
      </body>
    </html>
  );
}
