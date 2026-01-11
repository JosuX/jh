import type { Metadata } from "next";
import { EB_Garamond, Oswald, Italianno, Big_Shoulders_Inline } from "next/font/google";
import "./globals.css";

const ebGaramond = EB_Garamond({
  variable: "--font-eb-garamond",
  subsets: ["latin"],
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

const italianno = Italianno({
  variable: "--font-italianno",
  subsets: ["latin"],
  weight: "400",
});

const bigShouldersInline = Big_Shoulders_Inline({
  variable: "--font-big-shoulders-inline",
  subsets: ["latin"],
  weight: "400",
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  title: "Jofer & Hope's Wedding",
  description: "Jofer & Hope's Wedding",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${ebGaramond.variable} ${oswald.variable} ${italianno.variable} ${bigShouldersInline.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
