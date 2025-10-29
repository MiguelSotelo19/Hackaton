import type { Metadata } from "next";
import "./globals.css";
import 'mapbox-gl/dist/mapbox-gl.css';

export const metadata: Metadata = {
  title: "AgroCane - Tokenización de Créditos de Carbono",
  description: "Plataforma blockchain para tokenizar CO₂ capturado por caña de azúcar",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="antialiased">{children}</body>
    </html>
  );
}