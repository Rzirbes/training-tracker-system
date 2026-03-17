import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Inter } from 'next/font/google'
import { cn } from '@/lib/utils'
import { Toaster, RouterProgressBar, ThemeProvider } from '@/components/ui'
import { DialogContextRoot, DrawerContextRoot } from '@/contexts'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' })

export const metadata: Metadata = {
  title: 'Athlete Magenement',
  description: 'Sistema de controle e gestão.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='pt-br' suppressHydrationWarning>
      <body className={cn('min-h-screen bg-background font-sans antialiased', inter.variable)}>
        <Analytics />
        <SpeedInsights />
        <RouterProgressBar />
        <ThemeProvider attribute='class' defaultTheme='dark' enableSystem enableColorScheme disableTransitionOnChange>
          <DialogContextRoot>
            <DrawerContextRoot>{children}</DrawerContextRoot>
          </DialogContextRoot>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  )
}
