import type { Metadata } from "next";
import "./globals.css";
import AuthGuard from "@/components/AuthGuard";

export const metadata: Metadata = {
  title: "CTARTech ZentyCore — Zero Trust Control Plane",
  description: "Enterprise Zero Trust Security & Compliance Monitoring Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-slate-950 text-slate-100 min-h-screen">
        <AuthGuard>
          {children}
        </AuthGuard>
      </body>
    </html>
  );
}
