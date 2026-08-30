import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Statistics · SMAZA16 Election Portal',
  description: 'Real-time OSIS election statistics and participation dashboard for SMAZA16 Semarang.',
  generator: 'v0.app',
  icons: {
    icon: [
      { url: 'https://pemilos.osisaa16.my.id/logo-osis.png', media: '(prefers-color-scheme: light)' },
      { url: 'https://pemilos.osisaa16.my.id/logo-osis.png', media: '(prefers-color-scheme: dark)' },
      { url: 'https://pemilos.osisaa16.my.id/logo-osis.png', type: 'image/png' },
    ],
    apple: 'https://pemilos.osisaa16.my.id/logo-osis.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#7057d9',
  userScalable: false,
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="id"><body className="antialiased">{children}{process.env.NODE_ENV === 'production' && <Analytics />}</body></html>
}
