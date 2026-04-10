import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Veradmin",
  description: "Local-first tactical operating system for prop-firm fleet management."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#0b1020" }}>{children}</body>
    </html>
  );
}
