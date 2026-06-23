import { lazy, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/features/auth/stores/auth.store'
import { getCurrentUser } from '@/services/supabase/auth'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { AppShell } from '@/components/layout/AppShell'
import { useRealtimeNotifications } from '@/features/notifications/hooks/useRealtimeNotifications'
import { useIncomingCalls } from '@/features/calls/hooks/useIncomingCalls'
import { IncomingCallDialog } from '@/features/calls/components/IncomingCallDialog'
import { useCallStore } from '@/features/calls/stores/call.store'
import { OfflineBanner } from '@/components/common/OfflineBanner'

const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'))
const SignupPage = lazy(() => import('@/features/auth/pages/SignupPage'))
const ForgotPasswordPage = lazy(
  () => import('@/features/auth/pages/ForgotPasswordPage')
)
const VerifyEmailPage = lazy(
  () => import('@/features/auth/pages/VerifyEmailPage')
)
const ProfilePage = lazy(() => import('@/features/profile/pages/ProfilePage'))
const EditProfilePage = lazy(
  () => import('@/features/profile/pages/EditProfilePage')
)
const FeedPage = lazy(() => import('@/features/feed/pages/FeedPage'))
const ExplorePage = lazy(
  () => import('@/features/feed/pages/ExplorePage')
)
const NotificationsPage = lazy(
  () => import('@/features/notifications/pages/NotificationsPage')
)
const MessagesPage = lazy(
  () => import('@/features/messages/pages/MessagesPage')
)
const ConversationPage = lazy(
  () => import('@/features/messages/pages/ConversationPage')
)
const CallHistoryPage = lazy(
  () => import('@/features/calls/pages/CallHistoryPage')
)
const SearchPage = lazy(() => import('@/features/search/pages/SearchPage'))
const SettingsPage = lazy(
  () => import('@/features/settings/pages/SettingsPage')
)

function AuthenticatedApp({ children }: { children: React.ReactNode }) {
  useRealtimeNotifications()
  useIncomingCalls()
  const incomingCall = useCallStore((s) => s.incomingCall)
  const setIncomingCall = useCallStore((s) => s.setIncomingCall)
  const setActiveCall = useCallStore((s) => s.setActiveCall)
  const setCallType = useCallStore((s) => s.setCallType)
  const setCallStatus = useCallStore((s) => s.setCallStatus)

  const handleAcceptCall = () => {
    if (incomingCall) {
      setActiveCall(incomingCall)
      setCallType(incomingCall.type)
      setCallStatus('connecting')
      setIncomingCall(null)
    }
  }

  const handleDeclineCall = () => {
    setIncomingCall(null)
  }

  return (
    <>
      <OfflineBanner />
      <AppShell>{children}</AppShell>
      {incomingCall && (
        <IncomingCallDialog
          onAccept={handleAcceptCall}
          onDecline={handleDeclineCall}
        />
      )}
    </>
  )
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const isLoading = useAuthStore((s) => s.isLoading)

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <AuthenticatedApp>{children}</AuthenticatedApp>
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const isLoading = useAuthStore((s) => s.isLoading)

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (isAuthenticated) {
    return <Navigate to="/feed" replace />
  }

  return <>{children}</>
}

function AuthCallback() {
  return <LoadingSpinner size="lg" className="min-h-screen" />
}

export default function App() {
  const setUser = useAuthStore((s) => s.setUser)
  const setLoading = useAuthStore((s) => s.setLoading)

  useEffect(() => {
    getCurrentUser()
      .then((user) => {
        setUser(user)
      })
      .catch(() => {
        setUser(null)
      })
  }, [setUser, setLoading])

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <SignupPage />
            </PublicRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPasswordPage />
            </PublicRoute>
          }
        />
        <Route
          path="/verify-email"
          element={
            <PublicRoute>
              <VerifyEmailPage />
            </PublicRoute>
          }
        />

        {/* Auth callback */}
        <Route path="/auth/callback" element={<AuthCallback />} />

        {/* Protected routes */}
        <Route
          path="/feed"
          element={
            <ProtectedRoute>
              <FeedPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/explore"
          element={
            <ProtectedRoute>
              <ExplorePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <NotificationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/messages"
          element={
            <ProtectedRoute>
              <MessagesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/messages/:id"
          element={
            <ProtectedRoute>
              <ConversationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <SearchPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/calls"
          element={
            <ProtectedRoute>
              <CallHistoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <FeedPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-profile"
          element={
            <ProtectedRoute>
              <EditProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />

        {/* Profile route — wildcard, keep after specific routes */}
        <Route
          path="/:username"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
