import React, { useEffect, useState, useCallback } from 'react'
import {
  Box,
  Button,
  DropDown,
  GU,
  IconMail,
  LoadingRing,
  textStyle,
  useViewport,
  useTheme,
} from '@aragon/ui'
import { AppType } from '../../../prop-types'
import PropTypes from 'prop-types'
import memoize from 'lodash.memoize'
import styled from 'styled-components'
import { getEthNetworkType } from '../../../local-settings'
import { createSubscription } from './notification-service-api'
import notificationImage from './notification.png'

const getEventNamesFromAbi = memoize(abi =>
  abi.filter(item => item.type === 'event').map(item => item.name)
)

const filterSubscribedEvents = (abiEvents, subscribedEvents) =>
  abiEvents.filter(
    eventName =>
      !subscribedEvents.includes(eventName) &&
      eventName !== 'ScriptResult' &&
      eventName !== 'RecoverToVault'
  )

// Get subscribable events for the contractAddress from the ABI and filter out existing subscriptions
function getSubscribableEvents({ subscriptions, abi, contractAddress } = {}) {
  const subscribedEvents = subscriptions
    .filter(subscription => subscription.contractAddress === contractAddress)
    .map(({ eventName }) => eventName)

  const abiEvents = getEventNamesFromAbi(abi)
  return filterSubscribedEvents(abiEvents, subscribedEvents)
}

function getSubscribables(apps, subscriptions) {
  const subscribableApps = apps.filter(
    app =>
      !app.isAragonOsInternalApp &&
      getSubscribableEvents({
        subscriptions,
        abi: app.abi,
        contractAddress: app.proxyAddress,
      }).length > 0 // When subscribed to all events of an app, filter out apps with no subscribable events
  )
  const subscribableEvents = subscribableApps.map(app =>
    getSubscribableEvents({
      subscriptions,
      abi: app.abi,
      contractAddress: app.proxyAddress,
    })
  )

  return [subscribableApps, subscribableEvents]
}

export default function SubscriptionsForm({
  apps,
  dao,
  isFetchingSubscriptions,
  onApiError,
  fetchSubscriptions,
  subscriptions,
  token,
}) {
  const [selectedAppIdx, setSelectedAppIdx] = useState(-1)
  const [selectedEventIdx, setSelectedEventIdx] = useState(-1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [subscribableApps, setSubscribableApps] = useState([])
  const [subscribableEvents, setSubscribableEvents] = useState([])
  useEffect(() => {
    const [newSubscribableApps, newSubscribableEvents] = getSubscribables(
      apps,
      subscriptions
    )
    if (
      !newSubscribableApps[selectedAppIdx] || // case 1: selection is no longer valid
      (subscribableApps[selectedAppIdx] && // case 2: The selection has changed due to a new array of subscribable apps
        newSubscribableApps[selectedAppIdx].proxyAddress !==
          subscribableApps[selectedAppIdx].proxyAddress)
    ) {
      // Reset the app if the selected app is no longer unavailable
      setSelectedAppIdx(-1)
    }

    setSubscribableApps(newSubscribableApps)
    setSubscribableEvents(newSubscribableEvents)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apps, subscriptions])

  const appNames = subscribableApps.map(
    app => `${app.name} ${app.identifier ? `(${app.identifier})` : ''}`
  )
  const selectedApp =
    selectedAppIdx === -1 ? null : subscribableApps[selectedAppIdx]

  let eventNames = selectedApp ? subscribableEvents[selectedAppIdx] : ['']

  const handleAppChange = useCallback(index => {
    setSelectedAppIdx(index)
    setSelectedEventIdx(-1)
  }, [])

  const handleEventChange = useCallback(index => {
    setSelectedEventIdx(index)
  }, [])

  const handleSubscribe = useCallback(
    async e => {
      setIsSubmitting(true)
      const { abi, appName, proxyAddress } = selectedApp
      const eventName = eventNames[selectedEventIdx]

      const abiSubset = [
        abi.find(({ name, type }) => type === 'event' && name === eventName),
      ]

      try {
        const payload = {
          abi: abiSubset,
          appName,
          appContractAddress: proxyAddress,
          ensName: dao,
          eventName: eventNames[selectedEventIdx],
          network: getEthNetworkType(),
          token,
        }
        await createSubscription(payload)
        setSelectedEventIdx(-1)

        await fetchSubscriptions()
      } catch (e) {
        onApiError(e)
      }
      setIsSubmitting(false)
    },
    [
      selectedApp,
      eventNames,
      selectedEventIdx,
      dao,
      token,
      fetchSubscriptions,
      onApiError,
    ]
  )

  const theme = useTheme()
  const { below } = useViewport()

  if (apps.length === 0) {
    // Every DAO must have apps, if apps.length is 0, the DAO is still loading
    return (
      <SubscriptionsFormBox>
        <div
          css={`
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: ${25 * GU}px;
          `}
        >
          <LoadingRing />
          <p
            css={`
              margin-left: ${GU}px;
              ${textStyle('body1')};
            `}
          >
            Loading...
          </p>
        </div>
      </SubscriptionsFormBox>
    )
  }

  if (
    !isFetchingSubscriptions &&
    subscribableApps.length === 0 &&
    apps.length > 0
  ) {
    return (
      <SubscriptionsFormBox>
        <div
          css={`
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          `}
        >
          <img
            src={notificationImage}
            alt="Notifications"
            css={`
              display: block;
              margin: 0 auto ${3 * GU}px;
              height: 193px;
            `}
          />
          You have subscribed to all app events available on this organization!
        </div>
      </SubscriptionsFormBox>
    )
  }

  const isSubscribeDisabled =
    selectedAppIdx === -1 || selectedEventIdx === -1 || isSubmitting

  return (
    <SubscriptionsFormBox>
      <div
        css={`
          margin-bottom: ${2 * GU}px;
        `}
      >
        <Label
          css={`
            color: ${theme.surfaceContentSecondary};
          `}
        >
          App
        </Label>
        <DropDown
          wide
          placeholder="Select an App"
          items={appNames}
          selected={selectedAppIdx}
          onChange={handleAppChange}
        />
      </div>
      <div>
        <Label
          css={`
            color: ${theme.surfaceContentSecondary};
          `}
        >
          Event
        </Label>
        <DropDown
          disabled={selectedAppIdx === -1}
          placeholder="Select an Event"
          width="100%"
          items={eventNames}
          selected={selectedEventIdx}
          onChange={handleEventChange}
        />
      </div>
      <div
        css={`
          margin-top: ${4 * GU}px;
        `}
      >
        <Button
          wide={below('small')}
          disabled={isSubscribeDisabled}
          onClick={handleSubscribe}
        >
          {isSubmitting ? (
            <LoadingRing
              css={`
                margin-right: ${GU}px;
              `}
            />
          ) : (
            <IconMail
              css={`
                color: ${theme.surfaceContentSecondary};
                margin-right: ${GU}px;
              `}
            />
          )}{' '}
          Subscribe
        </Button>
      </div>
    </SubscriptionsFormBox>
  )
}

SubscriptionsForm.propTypes = {
  apps: PropTypes.arrayOf(AppType).isRequired,
  dao: PropTypes.string,
  isFetchingSubscriptions: PropTypes.bool,
  onApiError: PropTypes.func,
  fetchSubscriptions: PropTypes.func,
  subscriptions: PropTypes.array,
  token: PropTypes.string,
}

export const Label = styled.label`
  display: block;
  margin-bottom: ${GU}px;
`

const SubscriptionsFormBox = ({ children }) => {
  const { above } = useViewport()
  return (
    <Box
      padding={above('medium') ? 3 * GU : 2 * GU}
      heading="Create Subscriptions"
    >
      {children}
    </Box>
  )
}
SubscriptionsFormBox.propTypes = {
  children: PropTypes.node,
}
