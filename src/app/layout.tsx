import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope, Noto_Sans_Tamil } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["opsz", "SOFT"],
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const notoTamil = Noto_Sans_Tamil({
  subsets: ["tamil"],
  weight: ["400", "600"],
  variable: "--font-tamil",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SORRY ABI",
  description: "A proper apology. No pressure, no strings.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#0b0a14",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${manrope.variable} ${notoTamil.variable}`}
    >
      <body>
        <div className="aurora" aria-hidden />
        {children}
      </body>
    </html>
  );
}
