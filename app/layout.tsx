import type { Metadata } from "next";
import "./globals.css";
import ThemeRegistry from "@/components/ThemeRegistry";
import AuthContextProvider from "@/contexts/AuthContext";

export const metadata: Metadata = {
  title: "MediCare HMS",
  description: "Comprehensive Hospital Management System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeRegistry>
          <AuthContextProvider>{children}</AuthContextProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
