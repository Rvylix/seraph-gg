import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title:       "SERAPH.GG — Heaven Burns Red Global Resource",
  description: "Memoria database, event tracker, squad showcase, unit profiles and progression guides for Heaven Burns Red Global.",
  keywords:    ["Heaven Burns Red", "HBR", "Memoria", "guide", "tier list", "squad"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-hbr-bg text-hbr-silver antialiased">
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
