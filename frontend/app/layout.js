import { Newsreader, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";

import { AuthProvider } from "@/lib/auth/AuthProvider";

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
});

const ibmPlexSans = IBM_Plex_Sans({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-ibm-plex-sans",
});

export const metadata = {
  title: "PlantDx",
  description: "Agricultural leaf analysis for Tomato and Potato.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${newsreader.variable} ${ibmPlexSans.variable} antialiased bg-background text-text font-body min-h-screen flex flex-col selection:bg-primary/20 selection:text-primary`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

