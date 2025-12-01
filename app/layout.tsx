import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "SafetyOps Center",
    template: "%s | SafetyOps Center",
  },
  description: "Plataforma integral para el monitoreo, control y prevención de incidentes en operaciones mineras. Control de flota, alarmas, semáforos IoT y gestión de personal en tiempo real.",
  keywords: [
    "seguridad minera",
    "prevención de incidentes",
    "monitoreo minero",
    "IoT minería",
    "control de flota",
    "semáforos mineros",
    "gestión de alarmas",
    "SafetyOps",
    "minería subterránea",
    "operaciones mineras",
  ],
  authors: [{ name: "SebSRVV", url: "https://github.com/SebSRVV" }],
  creator: "SebSRVV",
  publisher: "SafetyOps Center",
  metadataBase: new URL("https://safetyops.sebrvv.com"),
  openGraph: {
    type: "website",
    locale: "es_PE",
    url: "https://safetyops.sebrvv.com",
    siteName: "SafetyOps Center",
    title: "SafetyOps Center",
    description: "Plataforma integral para el monitoreo, control y prevención de incidentes en operaciones mineras subterráneas y a cielo abierto.",
  },
  twitter: {
    card: "summary_large_image",
    title: "SafetyOps Center",
    description: "Plataforma integral para el monitoreo y prevención de incidentes en operaciones mineras.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
