export interface AuthUser {
  id: string
  email: string
  username: string
  displayName: string
  avatarUrl: string | null
  bio: string | null
  isVerified: boolean
}

export interface SignupInput {
  email: string
  password: string
  username: string
  displayName: string
}

export interface LoginInput {
  email: string
  password: string
}

export interface AuthState {
  user: AuthUser | null
  isLoading: boolean
  isAuthenticated: boolean
}

export interface AuthActions {
  setUser: (user: AuthUser | null) => void
  setLoading: (isLoading: boolean) => void
  reset: () => void
}
