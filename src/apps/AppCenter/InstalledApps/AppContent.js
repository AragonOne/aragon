import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Button, SafeLink, Viewport } from '@aragon/ui'
import { AppCenterAppType } from '../../../prop-types'
import LocalIdentityBadge from '../../../components/IdentityBadge/LocalIdentityBadge'
import { TextLabel } from '../../../components/TextStyles'
import { GU } from '../../../utils'
import { MENU_WIDTH } from '../../../components/MenuPanel/MenuPanel'
import Screenshots from '../Screenshots'

// Exclude the width of MenuPanel
const appBelow = (below, value) =>
  below(value + (below('medium') ? 0 : MENU_WIDTH))

const AppContent = React.memo(
  ({
    app: {
      appName,
      author,
      name,
      icons,
      description,
      screenshots,
      instances,
      canUpgrade,
      sourceUrl,
    },
    appVersions,
    onRequestUpgrade,
  }) => (
    <Viewport>
      {({ below, breakpoints }) => {
        const compact = appBelow(below, breakpoints.medium)
        return (
          <div
            css={`
              padding: ${6 * GU}px ${4 * GU}px ${8 * GU}px;
            `}
          >
            <div
              css={`
                display: flex;
                justify-content: space-between;
                margin-bottom: ${6 * GU}px;
                overflow: hidden;

                flex-direction: ${compact ? 'column' : 'row'};
                align-items: ${compact ? 'flex-start' : 'flex-end'};
              `}
            >
              <div
                css={`
                  display: flex;
                  align-items: flex-end;
                `}
              >
                <div
                  css={`
                    margin: 0 ${3 * GU}px 0 0;
                  `}
                >
                  <img
                    alt=""
                    src={icons.large}
                    width="80"
                    height="80"
                    css={`
                      display: block;
                      width: 80px;
                      height: 80px;
                    `}
                  />
                </div>
                <div>
                  <h1
                    css={`
                      white-space: nowrap;
                      margin-bottom: -${2 * GU}px;
                      font-size: 22px;
                    `}
                  >
                    {name}
                  </h1>

                  <Heading2>Created by</Heading2>
                  <div>
                    <LocalIdentityBadge entity={author} />
                  </div>
                </div>
              </div>
              <div
                css={`
                  padding: ${compact
                    ? `${3 * GU}px 0 0 ${80 + 3 * GU}px`
                    : '0'};
                `}
              >
                {canUpgrade && onRequestUpgrade && (
                  <Button mode="strong" onClick={onRequestUpgrade}>
                    Upgrade
                  </Button>
                )}
              </div>
            </div>
            {screenshots.length > 0 && (
              <div>
                <Screenshots screenshots={screenshots} />
              </div>
            )}
            <div
              css={`
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                width: 100%;

                flex-direction: ${compact ? 'column' : 'row'};
              `}
            >
              <DetailsGroup compact={compact}>
                <Heading2>Description</Heading2>
                <div>{description}</div>
                <Heading2>Source code</Heading2>
                <div>
                  {sourceUrl ? (
                    <SafeLink href={sourceUrl}>{sourceUrl}</SafeLink>
                  ) : (
                    'No source code link.'
                  )}
                </div>
              </DetailsGroup>
              <DetailsGroup compact={compact}>
                <Heading2>Installed instances</Heading2>
                {instances.map(proxyAddress => (
                  <div
                    key={proxyAddress}
                    css={`
                      & + & {
                        margin-top: ${2 * GU}px;
                      }
                    `}
                  >
                    <LocalIdentityBadge entity={proxyAddress} />
                  </div>
                ))}
                {appVersions && (
                  <div
                    css={`
                      margin-top: ${2 * GU}px;
                    `}
                  >
                    {appVersions}
                  </div>
                )}
              </DetailsGroup>
            </div>
          </div>
        )
      }}
    </Viewport>
  )
)

AppContent.propTypes = {
  app: AppCenterAppType.isRequired,
  appVersions: PropTypes.node,
  onRequestUpgrade: PropTypes.func,
}

const Heading2 = ({ children }) => (
  <h2
    css={`
      margin-top: ${2 * GU}px;
      margin-bottom: ${GU}px;
    `}
  >
    <TextLabel>{children}</TextLabel>
  </h2>
)

Heading2.propTypes = {
  children: PropTypes.node,
}

const DetailsGroup = styled.div`
  width: ${p => (p.compact ? '100%' : '50%')};
  & + & {
    margin-left: ${p => (p.compact ? '0' : `${5 * GU}px`)};
  }
`

export default AppContent
