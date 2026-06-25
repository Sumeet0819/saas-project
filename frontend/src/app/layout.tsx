import type { Metadata } from "next";
import { Inter, Hanken_Grotesk, Geist } from "next/font/google";
import { Toaster } from "react-hot-toast";
import StoreProvider from "./StoreProvider";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const hankenGrotesk = Hanken_Grotesk({ subsets: ["latin"], variable: '--font-hanken' });

export const metadata: Metadata = {
  title: "Civil Construction SaaS",
  description: "Construction Project Management Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light" className={cn(inter.variable, hankenGrotesk.variable, "font-sans", geist.variable)}>
      <body>
        <StoreProvider>
          <div id="root">
            {children}
            <Toaster position="top-right" />
          </div>
        </StoreProvider>
      </body>
    </html>
  );
}


