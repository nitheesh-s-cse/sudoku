import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sudoku Live — Solve it. Master it. Let them watch.",
  description:
    "A premium, real-time multiplayer Sudoku experience. Play a fresh puzzle every game, share your Room ID, and let friends watch you solve live — with Varshini, your Tanglish AI companion.",
  applicationName: "Sudoku Live",
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/icon.png",
    apple: "/icons/icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Sudoku Live",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#05040f",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-aurora min-h-dvh w-full overflow-x-hidden font-sans antialiased text-slate-50">
        {children}
      </body>
    </html>
  );
}
