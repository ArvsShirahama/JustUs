import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { AuthLayout } from '../components/AuthLayout'
import { ROUTES } from '@/lib/constants'

export default function VerifyEmailPage() {
  const { t } = useTranslation()

  return (
    <AuthLayout title={t('auth.verifyEmail')}>
      <div className="text-center space-y-4">
        <div className="rounded-full bg-[hsl(var(--primary))/10] w-16 h-16 flex items-center justify-center mx-auto">
          <svg
            className="w-8 h-8 text-[hsl(var(--primary))]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>
        <p className="text-sm text-[hsl(var(--muted-foreground))]">
          {t('auth.verifyEmailSent')}
        </p>
        <Link
          to={ROUTES.login}
          className="inline-block text-sm text-[hsl(var(--primary))] hover:underline font-medium"
        >
          {t('auth.login')}
        </Link>
      </div>
    </AuthLayout>
  )
}
