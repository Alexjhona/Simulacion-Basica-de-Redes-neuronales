import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://nexolab-crispdm.pages.dev"),
  title: "Laboratorio Interactivo de Modelos",
  description:
    "Del dato a la decisión: laboratorio visual de minería de datos e inteligencia de negocios.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  openGraph: {
    title: "Laboratorio Interactivo de Modelos",
    description: "Explora RN, Random Forest y CNN fase por fase.",
    type: "website",
    images: [{ url: "/og.png", width: 1536, height: 1024, alt: "NexoLab — CRISP-DM en acción" }],
  },
  twitter: { card: "summary_large_image", title: "Laboratorio Interactivo de Modelos", description: "RN, Random Forest y CNN en una sola página.", images: ["/og.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body>
    </html>
  );
}
