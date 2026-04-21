import type { Metadata } from 'next'
import { Toaster } from 'sonner'
import { QueryProvider } from '@/providers/QueryProvider'
import { Sidebar } from '@/components/layout/Sidebar'
import './globals.css'

export const metadata: Metadata = {
  title: 'ContextVault',
  description: 'Client context manager for freelancers using AI tools',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-y-auto bg-gray-50">
              {children}
            </main>
          </div>
          <Toaster position="top-right" richColors />
        </QueryProvider>
      </body>
    </html>
  )
}
