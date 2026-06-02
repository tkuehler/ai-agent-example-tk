import type { Metadata } from 'next'
import { Bebas_Neue, Lora, DM_Sans } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
  display: 'swap',
})

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
  style: ['normal', 'italic'],
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Randi — AI Service Assistant for Equipment OEMs',
    template: '%s — Randi',
  },
  description:
    'White-label SMS AI for equipment OEMs and dealers. Randi identifies equipment, pulls OEM procedures, matches parts, and closes the sale — over text.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${bebasNeue.variable} ${lora.variable} ${dmSans.variable} font-sans antialiased`}
      >
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}
