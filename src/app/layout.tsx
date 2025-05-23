import React, { Suspense } from 'react'
import type { Metadata } from 'next'
import { Providers } from '@/providers'
import { Analytics } from '@/providers/analytics'
import { RouteProgressBar } from '@/components/ui/route-progress-bar'
import { Navbar } from '@/components/navbar'
import '@/styles/global.css'

const title = 'Inverter Network | The Token Programmability Layer',
  description =
    'Inverter is a modular protocol for Primary Issuance Markets, enabling maximal value capture from token economies.'

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    type: 'website',
    title,
    description,
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
}

function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* PWA config */}
      <link rel="manifest" href="/manifest.json" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Inverter PWA" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta
        name="viewport"
        content="width=device-width height=device-height initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no"
      />
      <link rel="icon" href="/icon-512x512.png" />
      <meta name="theme-color" content="#000000" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black" />
      <body>
        <div className="content">
          <Analytics />
          <Providers>
            <RouteProgressBar />
            {/* CONTENT */}
            <div className="body">
              <Navbar />
              <div className="children">
                <div className="children-content">
                  <Suspense>{children}</Suspense>
                </div>
              </div>
            </div>
          </Providers>
        </div>
      </body>
    </html>
  )
}

export default RootLayout
