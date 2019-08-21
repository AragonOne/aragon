import React, { useContext, useMemo } from 'react'
import PropTypes from 'prop-types'
import { Transition, animated } from 'react-spring'
import {
  ButtonText,
  GU,
  textStyle,
  springs,
  useTheme,
  useViewport,
} from '@aragon/ui'
import { ActivityContext } from '../../contexts/ActivityContext'
import { AppType } from '../../prop-types'
import { addressesEqual } from '../../web3-utils'
import ActivityItem from './ActivityItem'

const MAX_HEIGHT_CLAMP = 80 * GU
const MAX_HEIGHT_WINDOW_SCALE = 0.75

const getAppByProxyAddress = (proxyAddress, apps) =>
  apps.find(app => addressesEqual(app.proxyAddress, proxyAddress)) || null

function ActivityList({ apps }) {
  const theme = useTheme()
  const { height } = useViewport()
  const { activities, clearActivities } = useContext(ActivityContext)
  const activityItems = useMemo(
    () =>
      activities
        .sort((a, b) => b.createdAt - a.createdAt)
        .map(activity => ({
          ...activity,
          app: getAppByProxyAddress(activity.targetAppProxyAddress, apps),
        })),
    [activities, apps]
  )

  const maxHeight = Math.min(
    MAX_HEIGHT_CLAMP,
    Math.ceil(MAX_HEIGHT_WINDOW_SCALE * height)
  )

  return (
    <div
      css={`
        width: ${42 * GU}px;
      `}
    >
      {activityItems.length > 0 && (
        <React.Fragment>
          <div
            css={`
              display: flex;
              align-items: center;
              justify-content: space-between;
              height: ${4 * GU}px;
              padding: 0 ${2 * GU}px;
              border-bottom: 1px solid ${theme.border};
            `}
          >
            <label
              css={`
                text-transform: uppercase;
                font-size: 12px;
                color: ${theme.surfaceContentSecondary};
              `}
            >
              Activity
            </label>
            <ButtonText
              onClick={clearActivities}
              css={`
                padding: 0;
                ${textStyle('label2')}
              `}
            >
              Clear all
            </ButtonText>
          </div>
          <div
            css={`
              max-height: ${maxHeight}px;
              overflow-x: hidden;
              overflow-y: scroll;
            `}
          >
            <Transition
              native
              items={activityItems}
              keys={activity => activity.transactionHash}
              trail={50}
              from={{
                opacity: 0.3,
                transform: 'translate3d(-20px, 0, 0)',
              }}
              enter={{
                opacity: 1,
                transform: 'translate3d(0px, 0, 0)',
              }}
              leave={{
                opacity: 0,
                transform: 'translate3d(-20px, 0, 0)',
              }}
              config={springs.smooth}
            >
              {activity => transitionStyles => (
                <div
                  css={`
                    & + & {
                      border-top: 1px solid ${theme.border};
                    }
                  `}
                >
                  <animated.div
                    style={{ ...transitionStyles, overflow: 'hidden' }}
                  >
                    <ActivityItem activity={activity} />
                  </animated.div>
                </div>
              )}
            </Transition>
          </div>
        </React.Fragment>
      )}
    </div>
  )
}
ActivityList.propTypes = {
  apps: PropTypes.arrayOf(AppType).isRequired,
}

export default ActivityList
