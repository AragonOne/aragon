import { extendError } from '../../../errors'

// const NOTIFICATION_SERVICE_URL = 'https://notifications.eth.aragon.network'
const NOTIFICATION_SERVICE_URL = 'http://localhost:4000'
export const NOTIFICATION_SERVICE_LOGIN = `${NOTIFICATION_SERVICE_URL}/login`
export const NOTIFICATION_SERVICE_VERIFY = `${NOTIFICATION_SERVICE_URL}/verify`
export const NOTIFICATION_SERVICE_SUBSCRIPTIONS = `${NOTIFICATION_SERVICE_URL}/subscriptions`

export const NOTIFICATION_SERVICE_EMAIL_KEY = 'NOTIFICATION_SERVICE_EMAIL_KEY'
export const NOTIFICATION_SERVICE_TOKEN_KEY = 'NOTIFICATION_SERVICE_TOKEN_KEY'
export const VERIFY_SUBSECTION = '/verify/'

// A user can be in one of these three states
// Only once the user is verified (authenticated) can he create subscriptions
export const AUTH_UNAUTHENTICATED = 'AUTH_UNAUTHENTICATED'
export const AUTH_PREVERIFY = 'AUTH_PREVERIFY' // submitted email but didn't verify
export const AUTH_AUTHENTICATED = 'AUTH_AUTHENTICATED'

export const EXPIRED_TOKEN_MESSAGE = 'Expired token'

export const ExpiredTokenError = extendError('ExpiredToken', {
  defaultMessage: 'Notification Service API token has expired',
})

export const InvalidTokenError = extendError('InvalidToken', {
  defaultMessage: 'Notification Service API token is invalid',
})
