import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UFO Atlas",
  description:
    "Explore the world's most significant UFO and UAP incidents on an interactive 3D map.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-[#0f0f23] text-white antialiased">
        {children}
      </body>
    </html>
  );
}
