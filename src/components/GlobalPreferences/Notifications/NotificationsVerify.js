import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { ButtonBase, Info, LoadingRing, useTheme } from '@aragon/ui'
import { verifyEmailToken } from './notification-service-api'
import {
  VERIFY_SUBSECTION,
  UnauthorizedError,
  ExpiredTokenError,
} from './constants'
import NotificationsVerifyBox from './NotificationsVerifyBox'

export function NotificationsVerify({
  subsection,
  onTokenChange,
  onEmailChange,
  navigateToNotifications,
}) {
  const [isFetching, setIsFetching] = useState(true)
  const [verified, setVerified] = useState(false)
  const [error, setError] = useState(null)
  const theme = useTheme()

  useEffect(() => {
    // Parse token from subsection /verify/[TOKEN] -> [TOKEN]
    const token = subsection.substring(VERIFY_SUBSECTION.length)
    verifyEmailToken(token)
      .then(longLivedToken => {
        setIsFetching(false)
        setVerified(true)
        onTokenChange(longLivedToken)
        return longLivedToken
      })
      .catch(e => {
        // if an invalid token is passed. we can clear email and token to reset the stae
        // or present the user with the error and give some options
        // onEmailChange(null)
        // onTokenChange(null)

        if (e instanceof ExpiredTokenError) {
          setError('Your email link has expired.')
        } else if (e instanceof UnauthorizedError) {
          setError(
            "Oops, it looks something went wrong and you weren't authorized. Please try again."
          )
        }
        setIsFetching(false)
        setVerified(false)
      })
  }, [subsection, onTokenChange, onEmailChange])

  if (isFetching) {
    return (
      <NotificationsVerifyBox header="Verifying">
        <div
          css={`
            display: flex;
            justify-content: center;
            align-items: center;
          `}
        >
          <LoadingRing />
        </div>
      </NotificationsVerifyBox>
    )
  }
  if (verified) {
    return (
      <NotificationsVerifyBox header="Verification Successful" success>
        <div>
          Your email was verified and now you can subscribe to app events to
          receive email notifications.{' '}
          <ButtonBase
            css={`
              font-weight: bold;
              color: ${theme.link};
              cursor: pointer;
            `}
            onClick={navigateToNotifications}
          >
            Go to Notification preferences.
          </ButtonBase>
        </div>
      </NotificationsVerifyBox>
    )
  }
  if (error) {
    return (
      <NotificationsVerifyBox header="Verification Failed">
        <div>
          <Info mode="error">{error}</Info>
        </div>
      </NotificationsVerifyBox>
    )
  }
}

NotificationsVerify.propTypes = {
  subsection: PropTypes.string,
  onTokenChange: PropTypes.func,
  onEmailChange: PropTypes.func,
  navigateToNotifications: PropTypes.func,
}

export function NotificationsPreVerify({ email }) {
  return (
    <NotificationsVerifyBox
      success
      header="Awaiting verification. Please check your email!"
    >
      <div>
        We’ve sent an email to <strong>{email}</strong>. Verify your email
        address so you can manage your notifications subscriptions.
      </div>
    </NotificationsVerifyBox>
  )
}

NotificationsPreVerify.propTypes = {
  email: PropTypes.string,
}
