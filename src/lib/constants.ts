export const APP_NAME = 'JustUs'

export const ROUTES = {
  home: '/',
  login: '/login',
  signup: '/signup',
  forgotPassword: '/forgot-password',
  verifyEmail: '/verify-email',
  feed: '/feed',
  explore: '/explore',
  notifications: '/notifications',
  messages: '/messages',
  conversation: (id: string) => `/messages/${id}`,
  profile: (username: string) => `/${username}`,
  editProfile: '/edit-profile',
  search: '/search',
  settings: '/settings',
  callHistory: '/calls',
  call: (id: string) => `/calls/${id}`,
} as const

export const AVATAR_PLACEHOLDER = '/avatar-placeholder.svg'
export const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB
export const MAX_IMAGES_PER_POST = 10
export const POST_TEXT_MAX_LENGTH = 2200
