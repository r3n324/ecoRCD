import './globals.css';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'EcoRCD Cochabamba | Materiales disponibles',
  description:
    'Panel de economía circular para el aprovechamiento de residuos de construcción en Cochabamba.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
