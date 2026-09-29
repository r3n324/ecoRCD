import './globals.css';

export const metadata = {
  title: 'EcoRCD Cochabamba | Materiales disponibles',
  description:
    'Panel de economía circular para el aprovechamiento de residuos de construcción en Cochabamba.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}