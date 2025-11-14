import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Yaba | Prince of Rhumbacane - Kenyan Rhumba Artist",
  description: "Official website of Yaba, Prince of Rhumbacane. Experience authentic Kenyan Rhumba music. Stream and purchase the new EP WAPE WAPE. Powered by SoldOutAfrica - Africa's leading music distribution platform.",
  keywords: "Yaba, Kenyan Rhumba, African Music, WAPE WAPE, SoldOutAfrica, Music Distribution, Kenyan Artist, Rhumbacane",
  openGraph: {
    title: "Yaba | Prince of Rhumbacane - Kenyan Rhumba Artist",
    description: "Experience authentic Kenyan Rhumba music. Stream and purchase the new EP WAPE WAPE.",
    type: "website",
    images: [
      {
        url: "/images/logo/SOLDOUT LOGO dark-1.png",
        width: 1200,
        height: 630,
        alt: "SoldOutAfrica - Yaba Music",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Yaba | Prince of Rhumbacane - Kenyan Rhumba Artist",
    description: "Experience authentic Kenyan Rhumba music. Stream and purchase the new EP WAPE WAPE.",
    images: ["/images/logo/SOLDOUT LOGO dark-1.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${playfair.variable} ${inter.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
