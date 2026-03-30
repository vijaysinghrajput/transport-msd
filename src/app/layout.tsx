import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import AntdProvider from "../components/AntdProvider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Mudrabase Transportation CRM",
  description: "Transportation & Vehicle Management CRM for Mudrabase",
  keywords: ["transportation", "CRM", "vehicles", "drivers", "shipments", "logistics"],
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AntdProvider>
          {children}
        </AntdProvider>
      </body>
    </html>
  )
}