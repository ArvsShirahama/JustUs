import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { AuthLayout } from '../components/AuthLayout'
import { AuthForm } from '../components/AuthForm'
import { resetPassword } from '@/services/supabase/auth'
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from '../schemas/auth.schema'
import { ROUTES } from '@/lib/constants'

export default function ForgotPasswordPage() {
  const { t } = useTranslation()
  const [isSent, setIsSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true)
    setError(null)
    try {
      await resetPassword(data.email)
      setIsSent(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSent) {
    return (
      <AuthLayout title={t('auth.checkYourEmail')}>
        <div className="text-center space-y-4">
          <p className="text-sm text-[hsl(var(--muted-foreground))]">
            {t('auth.checkYourEmail')}
          </p>
          <Link
            to={ROUTES.login}
            className="text-sm text-[hsl(var(--primary))] hover:underline font-medium"
          >
            {t('auth.login')}
          </Link>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout title={t('auth.forgotPassword')}>
      <AuthForm onSubmit={handleSubmit(onSubmit)} isLoading={isLoading}>
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="text-sm font-medium text-[hsl(var(--foreground))]"
          >
            {t('auth.email')}
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            className="flex h-10 w-full rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
            {...register('email')}
          />
          {errors.email && (
            <p className="text-sm text-[hsl(var(--destructive))]">
              {errors.email.message}
            </p>
          )}
        </div>

        {error && (
          <p className="text-sm text-[hsl(var(--destructive))]">{error}</p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-md bg-[hsl(var(--primary))] px-4 py-2 text-sm font-medium text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--primary))/90] disabled:opacity-50 transition-colors"
        >
          {isLoading ? t('common.loading') : t('auth.sendResetLink')}
        </button>

        <p className="text-center text-sm text-[hsl(var(--muted-foreground))]">
          <Link
            to={ROUTES.login}
            className="text-[hsl(var(--primary))] hover:underline font-medium"
          >
            {t('auth.login')}
          </Link>
        </p>
      </AuthForm>
    </AuthLayout>
  )
}
