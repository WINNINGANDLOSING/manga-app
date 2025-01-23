
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;

import AppBar from "@/components/ui/appBar";
import TrendingSection from "@/components/trending/page";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    
      <html lang="en">
        <body>
          <AppBar />

          <main>{children}</main>
        </body>
      </html>
   
  );
}
