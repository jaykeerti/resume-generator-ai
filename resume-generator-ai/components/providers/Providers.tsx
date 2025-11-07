'use client'

import { NotificationProvider } from '@/lib/contexts/NotificationContext'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NotificationProvider>
      {children}
    </NotificationProvider>
  )
}
