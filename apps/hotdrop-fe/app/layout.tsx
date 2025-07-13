import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";


const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "HotDrop – Skip the Queue, Grab Your Order Instantly",
  description:
    "HotDrop lets you pre-order food and essentials from nearby shops and pick them up without waiting in line. Save time, skip queues!",
  keywords: [
    "HotDrop",
    "food pickup",
    "skip the line",
    "food ordering",
    "simple food order",
    "no wait in queue",
    "pre-order app",
    "local stores",
    "queue management",
    "food takeway",
    "fast food takeway",
    "food order",
    "Grab and go food app",
  ],
  metadataBase: new URL("https://hotdrop.tech"),
  openGraph: {
    title: "HotDrop – Skip the Queue, Grab Your Order Instantly",
    description:
      "Pre-order from nearby shops and pick up your order without waiting. HotDrop is the smart way to save time!",
    url: "https://hotdrop.tech",
    siteName: "HotDrop",
    images: [
      {
        url: "/Preview-image.png", // make sure this image exists in /public
        width: 1200,
        height: 630,
        alt: "HotDrop Preview",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HotDrop – Skip the Queue, Grab Your Order Instantly",
    description:
      "Pre-order and pick up from shops near you. Avoid queues with HotDrop!",
    images: ["/preview-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <link rel="icon" href="/logo.png" type="image/x-icon" />

      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
