import type { Metadata } from 'next'

import { cn } from '@/utilities/ui'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import React from 'react'

import { AdminBar } from '@/components/AdminBar'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { draftMode } from 'next/headers'
import { Geist } from 'next/font/google'
import { Cormorant_Garamond } from 'next/font/google'

import Script from 'next/script'

import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant',
})

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${cormorant.variable} bg-primary`}
      suppressHydrationWarning
    >
      <head>
        <InitTheme />
        <link href="/favicon-theme.svg" rel="icon" type="image/svg+xml" />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
      </head>
      <body>
        <Providers>
          <AdminBar
            adminBarProps={{
              preview: isEnabled,
            }}
          />

          <Header />
          {children}
          <Script
            async
            src="https://analytics.soliths.cloud/script.js"
            data-website-id="4cb5a416-8237-4a83-ae87-feed3d696ccc"
            strategy="afterInteractive"
          />
          <Footer />
        </Providers>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    creator: '@payloadcms',
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' }, // Android
      { url: '/icon-512x512.png', sizes: '512x512', type: 'image/png' }, // Android HD
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png', // iOS 180x180
  },
}
