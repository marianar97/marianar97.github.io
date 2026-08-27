import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/content";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: site.name,
  description: site.description,
  openGraph: {
    title: site.name,
    siteName: site.name,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: site.name,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${geistMono.variable}`}>
      <body>
        <div className="min-h-screen">
          <main className="w-[80%] sm:w-[75%] md:w-[62%] lg:w-[50%] xl:w-[44%] 2xl:w-[36%] max-w-[560px] mx-auto px-6 pt-16 sm:pt-20 pb-20">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
