import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { PwaRegister } from '@/components/pwa-register'
import './globals.css'

export const metadata: Metadata = {
  title: 'Statistics · SMAZA16 Election Portal',
  description: 'Real-time OSIS election statistics and participation dashboard for SMAZA16 Semarang.',
  generator: 'v0.app',
  manifest: '/manifest.webmanifest',
  icons: {
    icon: [
      { url: 'https://cdn.zakilabs.my.id/pemilos/logoosis.png', media: '(prefers-color-scheme: light)' },
      { url: 'https://cdn.zakilabs.my.id/pemilos/logoosis.png', media: '(prefers-color-scheme: dark)' },
      { url: 'https://cdn.zakilabs.my.id/pemilos/logoosis.png', type: 'image/png' },
    ],
    apple: 'https://cdn.zakilabs.my.id/pemilos/logoosis.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#7057d9',
  userScalable: false,
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="id"><body className="antialiased"><PwaRegister />{children}{process.env.NODE_ENV === 'production' && <Analytics />}</body></html>
}
