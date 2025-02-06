import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Arcta AI - Advanced RAG & Agentic AI Platform",
  description: "Transform your data into intelligent insights with Arcta AI's advanced RAG and agentic AI platform. Built for enterprise scale.",
  metadataBase: new URL("https://arcta.ai"),
  openGraph: {
    title: "Arcta AI - Advanced RAG & Agentic AI Platform",
    description: "Transform your data into intelligent insights with Arcta AI's advanced RAG and agentic AI platform. Built for enterprise scale.",
    url: "https://arcta.ai",
    siteName: "Arcta AI",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Arcta AI",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Arcta AI - Advanced RAG & Agentic AI Platform",
    description: "Transform your data into intelligent insights with Arcta AI's advanced RAG and agentic AI platform. Built for enterprise scale.",
    creator: "@arctaai",
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
      <body className={`${inter.className} h-full`}>
        <div className="flex min-h-full flex-col">
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
