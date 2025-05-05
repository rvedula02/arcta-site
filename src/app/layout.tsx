import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import "./globals.css";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import AuthProvider from "./providers";

// Configure Inter font with better fallback
const font = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  fallback: ['system-ui', 'arial', 'sans-serif']
});

export const metadata: Metadata = {
  title: "Arcta - Transforming Investment Office Intelligence",
  description: "Transform your investment office workflows with Arcta's unified intelligence and workflow automation platform. Built for modern financial institutions.",
  metadataBase: new URL("https://arcta.ai"),
  openGraph: {
    title: "Arcta - Transforming Investment Office Intelligence",
    description: "Transform your investment office workflows with Arcta's unified intelligence and workflow automation platform. Built for modern financial institutions.",
    url: "https://arcta.ai",
    siteName: "Arcta",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Arcta - Investment Office Intelligence",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Arcta - Transforming Investment Office Intelligence",
    description: "Transform your investment office workflows with Arcta's unified intelligence and workflow automation platform. Built for modern financial institutions.",
    creator: "@arcta",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${font.className} h-full`}>
        <AuthProvider>
          <div className="flex min-h-full flex-col">
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
