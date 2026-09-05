import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

export const metadata: Metadata = {
  title: "NAZAR — National Anomaly & Zone-based Review",
  description:
    "Independent Hackathon Prototype. AI-assisted MPLADS analysis platform turning public fund records into evidence-grounded insights.",
  other: {
    "x-watermark": "East",
    "x-signature": "East",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta name="author-signature" content="East" />
      </head>
      <body className="min-h-screen bg-[#fbfbf9] text-[#1c2024] flex overflow-x-hidden">
        {/* Secret Watermark Element (Invisible) */}
        <div
          id="__nazar_sig"
          data-signature="East"
          className="hidden"
          aria-hidden="true"
          style={{ display: "none", position: "absolute", opacity: 0, pointerEvents: "none" }}
        >
          East
        </div>

        {/* Left fixed/sticky sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <Header />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </body>
    </html>
  );
}
