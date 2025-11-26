import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { SessionProvider } from "@/components/providers/session-provider"
import "./globals.css"
import RemoveV0Badge from "./remove-v0-badge"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Coxilha Coffee - Painel de Gestão",
  description: "Sistema de gestão de estoque e análise financeira para Coxilha Coffee",
  icons: {
    icon: "/logo-coxilha.jpg",
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className="font-sans antialiased">
        <SessionProvider>
          <RemoveV0Badge />
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}
