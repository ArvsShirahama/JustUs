import type { ReactNode } from 'react'

interface AuthFormProps {
  onSubmit: (e: React.FormEvent) => void
  children: ReactNode
  isLoading?: boolean
}

export function AuthForm({ onSubmit, children, isLoading }: AuthFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <fieldset disabled={isLoading} className="space-y-4 border-0 p-0 m-0">
        {children}
      </fieldset>
    </form>
  )
}
