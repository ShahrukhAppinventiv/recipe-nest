import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { AuthSessionProvider } from "@/components/providers/AuthSessionProvider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://recipenest.app";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "RecipeNest",
    template: "%s | RecipeNest",
  },
  description:
    "Discover, save, and cook thousands of recipes — from everyday favourites to something new for the table.",
  keywords: [
    "recipes",
    "cooking",
    "food",
    "meal ideas",
    "cuisine",
    "RecipeNest",
  ],
  openGraph: {
    type: "website",
    siteName: "RecipeNest",
    title: "RecipeNest",
    description:
      "Discover, save, and cook thousands of recipes — from everyday favourites to something new for the table.",
    url: APP_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "RecipeNest",
    description:
      "Discover, save, and cook thousands of recipes — from everyday favourites to something new for the table.",
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
    <html
      lang="en"
      className={`${inter.variable} ${playfairDisplay.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <AuthSessionProvider>{children}</AuthSessionProvider>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
