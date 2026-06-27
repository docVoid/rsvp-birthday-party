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
        <footer className="py-4 text-center text-xs text-gray-400">
          Programmiert mit ❤️ von{" "}
          <a
            href="https://github.com/docVoid/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-gray-600 transition"
          >
            void
          </a>
        </footer>
      </body>
    </html>
  );
}
