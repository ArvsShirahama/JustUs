import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { AuthLayout } from '../components/AuthLayout'
import { AuthForm } from '../components/AuthForm'
import { useLogin } from '../hooks/useLogin'
import { loginSchema, type LoginFormData } from '../schemas/auth.schema'
import { ROUTES } from '@/lib/constants'

export default function LoginPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const login = useLogin()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = (data: LoginFormData) => {
    login.mutate(data, {
      onSuccess: () => {
        navigate(ROUTES.feed)
      },
    })
  }

  return (
    <AuthLayout title={t('auth.login')}>
      <AuthForm onSubmit={handleSubmit(onSubmit)} isLoading={login.isPending}>
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

        <div className="space-y-2">
          <label
            htmlFor="password"
            className="text-sm font-medium text-[hsl(var(--foreground))]"
          >
            {t('auth.password')}
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            className="flex h-10 w-full rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
            {...register('password')}
          />
          {errors.password && (
            <p className="text-sm text-[hsl(var(--destructive))]">
              {errors.password.message}
            </p>
          )}
        </div>

        {login.error && (
          <p className="text-sm text-[hsl(var(--destructive))]">
            {login.error.message}
          </p>
        )}

        <button
          type="submit"
          disabled={login.isPending}
          className="w-full rounded-md bg-[hsl(var(--primary))] px-4 py-2 text-sm font-medium text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--primary))/90] disabled:opacity-50 transition-colors"
        >
          {login.isPending ? t('common.loading') : t('auth.login')}
        </button>

        <div className="text-center space-y-2">
          <Link
            to={ROUTES.forgotPassword}
            className="text-sm text-[hsl(var(--primary))] hover:underline"
          >
            {t('auth.forgotPassword')}
          </Link>
          <p className="text-sm text-[hsl(var(--muted-foreground))]">
            {t('auth.noAccount')}{' '}
            <Link
              to={ROUTES.signup}
              className="text-[hsl(var(--primary))] hover:underline font-medium"
            >
              {t('auth.signup')}
            </Link>
          </p>
        </div>
      </AuthForm>
    </AuthLayout>
  )
}
