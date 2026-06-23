import type { ReactNode } from 'react'
import { APP_NAME } from '@/lib/constants'

interface AuthLayoutProps {
  children: ReactNode
  title: string
  subtitle?: string
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[hsl(var(--background))] px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-[hsl(var(--foreground))]">
            {APP_NAME}
          </h1>
          <h2 className="text-xl font-semibold text-[hsl(var(--foreground))]">
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm text-[hsl(var(--muted-foreground))]">
              {subtitle}
            </p>
          )}
        </div>
        {children}
      </div>
    </div>
  )
}
