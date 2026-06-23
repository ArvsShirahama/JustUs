import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'
import { Home, Search, PlusSquare, MessageCircle, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ROUTES } from '@/lib/constants'

const navItems = [
  { to: ROUTES.feed, icon: Home, labelKey: 'nav.home' },
  { to: ROUTES.search, icon: Search, labelKey: 'nav.search' },
  { to: ROUTES.explore, icon: PlusSquare, labelKey: 'nav.create' },
  { to: ROUTES.messages, icon: MessageCircle, labelKey: 'nav.messages' },
  { to: '/profile', icon: User, labelKey: 'nav.profile' },
] as const

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] pb-16 md:pb-0">
      <main className="mx-auto max-w-2xl">{children}</main>

      <nav className="fixed bottom-0 left-0 right-0 border-t border-[hsl(var(--border))] bg-[hsl(var(--background))] md:top-0 md:bottom-auto md:border-t-0 md:border-b">
        <div className="mx-auto flex max-w-2xl items-center justify-around py-2 px-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center gap-0.5 text-xs transition-colors',
                  isActive
                    ? 'text-[hsl(var(--primary))]'
                    : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    className={cn(
                      'h-6 w-6',
                      isActive && 'fill-[hsl(var(--primary))]'
                    )}
                  />
                  <span>{t(item.labelKey)}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}
