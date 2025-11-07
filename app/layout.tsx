import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import SiteHeader from "@/components/site-header"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "CareMate",
  description: "Intelligent hospital management system",
  generator: "Sanket Yelugotla",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={<div>Loading...</div>}>
          {/* <SiteHeader /> */}
          {children}
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
