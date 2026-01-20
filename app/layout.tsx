import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Betti Central Hub",
  description: "Central hub for Betti dashboard experiences.",
  icons: {
    icon: [
      { url: "/betti-logo.png", sizes: "32x32", type: "image/png" },
      { url: "/betti-logo.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: "/betti-logo.png",
    apple: "/betti-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
