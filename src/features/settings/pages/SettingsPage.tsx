import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  User,
  Shield,
  Bell,
  Moon,
  Globe,
  LogOut,
  Ban,
  Trash2,
} from 'lucide-react'
import { ROUTES } from '@/lib/constants'
import { useAuthStore } from '@/features/auth/stores/auth.store'
import { useLogout } from '@/features/auth/hooks/useLogout'
import { useTheme } from '@/hooks/useTheme'
import { useSettingsStore } from '../stores/settings.store'

interface SettingItemProps {
  icon: React.ReactNode
  label: string
  description?: string
  right?: React.ReactNode
  onClick?: () => void
  danger?: boolean
}

function SettingItem({
  icon,
  label,
  description,
  right,
  onClick,
  danger,
}: SettingItemProps) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 px-4 py-4 hover:bg-[hsl(var(--muted))] transition-colors"
    >
      <span
        className={
          danger ? 'text-[#EF4444]' : 'text-[hsl(var(--muted-foreground))]'
        }
      >
        {icon}
      </span>
      <div className="flex-1 text-left">
        <p
          className={`text-sm font-medium ${
            danger
              ? 'text-[#EF4444]'
              : 'text-[hsl(var(--foreground))]'
          }`}
        >
          {label}
        </p>
        {description && (
          <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">
            {description}
          </p>
        )}
      </div>
      {right && <span className="text-[hsl(var(--muted-foreground))]">{right}</span>}
    </button>
  )
}

export default function SettingsPage() {
  const { t } = useTranslation()
  const user = useAuthStore((s) => s.user)
  const { mutate: doLogout } = useLogout()
  const { setTheme, resolvedTheme } = useTheme()
  const setIsPrivate = useSettingsStore((s) => s.setIsPrivate)

  return (
    <div>
      <div className="flex items-center gap-4 px-4 py-3 border-b border-[hsl(var(--border))]">
        <Link
          to={ROUTES.profile(user?.username ?? '')}
          className="rounded-full p-1 hover:bg-[hsl(var(--muted))] transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-[hsl(var(--foreground))]" />
        </Link>
        <h1 className="text-lg font-bold text-[hsl(var(--foreground))]">
          {t('settings.title')}
        </h1>
      </div>

      <div className="divide-y divide-[hsl(var(--border))]">
        {/* Account */}
        <div>
          <p className="px-4 pt-4 pb-1 text-xs font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
            {t('settings.account')}
          </p>
          <Link to={ROUTES.editProfile}>
            <SettingItem
              icon={<User className="h-5 w-5" />}
              label={t('profile.editProfile')}
            />
          </Link>
        </div>

        {/* Privacy */}
        <div>
          <p className="px-4 pt-4 pb-1 text-xs font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
            {t('settings.privacy')}
          </p>
          <div className="flex items-center justify-between px-4 py-4">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-[hsl(var(--muted-foreground))]" />
              <div>
                <p className="text-sm font-medium text-[hsl(var(--foreground))]">
                  {t('settings.privateAccount')}
                </p>
                <p className="text-xs text-[hsl(var(--muted-foreground))]">
                  {t('settings.privateAccountDesc')}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsPrivate(true)}
              className="h-6 w-11 rounded-full bg-[hsl(var(--muted))] relative"
            >
              <div className="h-5 w-5 rounded-full bg-white shadow absolute top-0.5 left-0.5" />
            </button>
          </div>
          <SettingItem
            icon={<Ban className="h-5 w-5" />}
            label={t('settings.blockedUsers')}
          />
        </div>

        {/* Notifications */}
        <div>
          <p className="px-4 pt-4 pb-1 text-xs font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
            {t('settings.notifications')}
          </p>
          <SettingItem
            icon={<Bell className="h-5 w-5" />}
            label={t('settings.notifications')}
            description="Manage push notification preferences"
          />
        </div>

        {/* Appearance */}
        <div>
          <p className="px-4 pt-4 pb-1 text-xs font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
            {t('settings.appearance')}
          </p>
          <SettingItem
            icon={<Moon className="h-5 w-5" />}
            label={t('settings.darkMode')}
            right={
              <span className="text-sm capitalize">{resolvedTheme}</span>
            }
            onClick={() =>
              setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
            }
          />
          <SettingItem
            icon={<Globe className="h-5 w-5" />}
            label={t('settings.language')}
            right={<span className="text-sm">English</span>}
          />
        </div>

        {/* Logout */}
        <div className="pt-4">
          <SettingItem
            icon={<LogOut className="h-5 w-5" />}
            label={t('auth.logout')}
            danger
            onClick={() => doLogout()}
          />
          <SettingItem
            icon={<Trash2 className="h-5 w-5" />}
            label={t('settings.deleteAccount')}
            danger
          />
        </div>
      </div>
    </div>
  )
}
