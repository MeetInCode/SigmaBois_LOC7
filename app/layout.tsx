import './globals.css'
import { Inter } from 'next/font/google'
import VoiceNavigationComponent from "@/components/voice"; 


const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>

        <div className="fixed bottom-4 right-4 z-50">
        <VoiceNavigationComponent />
      </div>
   
      </html>
  )
}
