import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { AuthLayout } from '../components/AuthLayout'
import { AuthForm } from '../components/AuthForm'
import { useSignup } from '../hooks/useSignup'
import { signupSchema, type SignupFormData } from '../schemas/auth.schema'
import { ROUTES } from '@/lib/constants'

export default function SignupPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const signup = useSignup()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  })

  const onSubmit = (data: SignupFormData) => {
    signup.mutate(data, {
      onSuccess: () => {
        navigate(ROUTES.verifyEmail)
      },
    })
  }

  return (
    <AuthLayout
      title={t('auth.signup')}
      subtitle="Create an account to connect with others"
    >
      <AuthForm onSubmit={handleSubmit(onSubmit)} isLoading={signup.isPending}>
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
            htmlFor="username"
            className="text-sm font-medium text-[hsl(var(--foreground))]"
          >
            {t('auth.username')}
          </label>
          <input
            id="username"
            type="text"
            autoComplete="username"
            className="flex h-10 w-full rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
            {...register('username')}
          />
          {errors.username && (
            <p className="text-sm text-[hsl(var(--destructive))]">
              {errors.username.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="displayName"
            className="text-sm font-medium text-[hsl(var(--foreground))]"
          >
            {t('auth.displayName')}
          </label>
          <input
            id="displayName"
            type="text"
            className="flex h-10 w-full rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
            {...register('displayName')}
          />
          {errors.displayName && (
            <p className="text-sm text-[hsl(var(--destructive))]">
              {errors.displayName.message}
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
            autoComplete="new-password"
            className="flex h-10 w-full rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
            {...register('password')}
          />
          {errors.password && (
            <p className="text-sm text-[hsl(var(--destructive))]">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="confirmPassword"
            className="text-sm font-medium text-[hsl(var(--foreground))]"
          >
            {t('auth.confirmPassword')}
          </label>
          <input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            className="flex h-10 w-full rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
            {...register('confirmPassword')}
          />
          {errors.confirmPassword && (
            <p className="text-sm text-[hsl(var(--destructive))]">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {signup.error && (
          <p className="text-sm text-[hsl(var(--destructive))]">
            {signup.error.message}
          </p>
        )}

        <button
          type="submit"
          disabled={signup.isPending}
          className="w-full rounded-md bg-[hsl(var(--primary))] px-4 py-2 text-sm font-medium text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--primary))/90] disabled:opacity-50 transition-colors"
        >
          {signup.isPending ? t('common.loading') : t('auth.signup')}
        </button>

        <p className="text-center text-sm text-[hsl(var(--muted-foreground))]">
          {t('auth.hasAccount')}{' '}
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
