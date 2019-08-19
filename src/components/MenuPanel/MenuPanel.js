import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Spring, animated } from 'react-spring'
import { ButtonBase, springs, unselectable, useTheme } from '@aragon/ui'
import memoize from 'lodash.memoize'
import { AppInstanceGroupType, AppsStatusType } from '../../prop-types'
import { staticApps } from '../../static-apps'
import MenuPanelAppGroup from './MenuPanelAppGroup'
import MenuPanelAppsLoader from './MenuPanelAppsLoader'
import AppIcon from '../AppIcon/AppIcon'
import IconArrow from '../../icons/IconArrow'

export const MENU_PANEL_SHADOW_WIDTH = 15
export const MENU_PANEL_WIDTH = 220
export const MENU_ITEM_HEIGHT = 40

const APP_APPS_CENTER = staticApps.get('apps').app
const APP_HOME = staticApps.get('home').app
const APP_ORGANIZATION = staticApps.get('organization').app
const APP_PERMISSIONS = staticApps.get('permissions').app

const systemAppsOpenedState = {
  key: 'SYSTEM_APPS_OPENED_STATE',
  isOpen: function() {
    return localStorage.getItem(this.key) === '1'
  },
  set: function(opened) {
    localStorage.setItem(this.key, opened ? '1' : '0')
  },
}

// Interpolate the elevation of a toggle from which a drawer slides down.
// In / out example: [0, 0.25, 0.5, 0.75, 1] => [0, 0.5, 1, 0.5, 0]
const interpolateToggleElevation = (value, fn = v => v) =>
  value.interpolate(v => fn(1 - Math.abs(v * 2 - 1)))

class MenuPanel extends React.PureComponent {
  static propTypes = {
    theme: PropTypes.object,
    activeInstanceId: PropTypes.string,
    appInstanceGroups: PropTypes.arrayOf(AppInstanceGroupType).isRequired,
    appsStatus: AppsStatusType.isRequired,
    onOpenApp: PropTypes.func.isRequired,
    onRequestAppsReload: PropTypes.func.isRequired,
  }

  _systemAppsToggled = false

  state = {
    notifications: [],
    systemAppsOpened: systemAppsOpenedState.isOpen(),
    systemAppsToggled: false,
  }

  getRenderableAppGroups = memoize(appGroups =>
    appGroups
      .filter(appGroup => appGroup.hasWebApp)
      .map(appGroup => ({
        ...appGroup,
        icon: <AppIcon app={appGroup.app} size={22} />,
      }))
  )

  handleToggleSystemApps = () => {
    this.setState(
      ({ systemAppsOpened }) => ({
        systemAppsOpened: !systemAppsOpened,
        systemAppsToggled: true,
      }),
      () => systemAppsOpenedState.set(this.state.systemAppsOpened)
    )
  }

  render() {
    const { appInstanceGroups, theme } = this.props
    const { systemAppsOpened, systemAppsToggled } = this.state

    const appGroups = this.getRenderableAppGroups(appInstanceGroups)
    const menuApps = [APP_HOME, appGroups]
    const systemApps = [APP_PERMISSIONS, APP_APPS_CENTER, APP_ORGANIZATION]

    return (
      <Main
        css={`
          background: ${theme.surface};
        `}
      >
        <div
          css={`
            position: relative;
            z-index: 2;
            display: flex;
            flex-direction: column;
            height: 100%;
            flex-shrink: 1;
            border-right: 1px solid ${theme.border};
            box-shadow: 1px 0 ${MENU_PANEL_SHADOW_WIDTH}px rgba(0, 0, 0, 0.1);
          `}
        >
          <Content
            css={`
              h1 {
                color: ${theme.surfaceContentSecondary};
              }
            `}
          >
            <div className="in">
              <h1>Apps</h1>

              <div>
                {menuApps.map(app =>
                  // If it's an array, it's the group being loaded from the ACL
                  Array.isArray(app)
                    ? this.renderLoadedAppGroup(app)
                    : this.renderAppGroup(app, false)
                )}
              </div>
              <Spring
                config={springs.smooth}
                from={{ openProgress: 0 }}
                to={{ openProgress: Number(systemAppsOpened) }}
                immediate={!systemAppsToggled}
                native
              >
                {({ openProgress }) => (
                  <div>
                    <SystemAppsToggle
                      onClick={this.handleToggleSystemApps}
                      activeBackground={theme.surfacePressed}
                    >
                      <SystemAppsToggleShadow
                        style={{
                          transform: interpolateToggleElevation(
                            openProgress,
                            v => `scale3d(${v}, 1, 1)`
                          ),
                          opacity: interpolateToggleElevation(openProgress),
                        }}
                      />
                      <h1
                        css={`
                          display: flex;
                          justify-content: flex-start;
                          align-items: flex-end;
                        `}
                      >
                        <span>System</span>
                        <SystemAppsToggleArrow
                          style={{
                            marginLeft: '5px',
                            transform: openProgress.interpolate(
                              v => `rotate(${(1 - v) * 180}deg)`
                            ),
                            transformOrigin: '50% calc(50% - 0.5px)',
                          }}
                        />
                      </h1>
                    </SystemAppsToggle>
                    <div css="overflow: hidden">
                      <animated.div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'flex-end',
                          width: '100%',
                          opacity: openProgress,
                          height: openProgress.interpolate(
                            v => v * systemApps.length * MENU_ITEM_HEIGHT + 'px'
                          ),
                        }}
                      >
                        {systemApps.map(app => this.renderAppGroup(app, true))}
                      </animated.div>
                    </div>
                  </div>
                )}
              </Spring>
            </div>
          </Content>
        </div>
      </Main>
    )
  }

  renderAppGroup(app, isSystem) {
    const { activeInstanceId, onOpenApp } = this.props

    const { appId, name, icon, instances } = app
    const isActive =
      instances.findIndex(
        ({ instanceId }) => instanceId === activeInstanceId
      ) !== -1

    return (
      <div key={appId}>
        <MenuPanelAppGroup
          name={name}
          icon={icon}
          system={isSystem}
          instances={instances}
          active={isActive}
          expand={isActive}
          activeInstanceId={activeInstanceId}
          onActivate={onOpenApp}
        />
      </div>
    )
  }

  renderLoadedAppGroup(appGroups) {
    const { appsStatus, activeInstanceId, onRequestAppsReload } = this.props

    // Used by the menu transition
    const expandedInstancesCount = appGroups.reduce(
      (height, { instances }) =>
        instances.length > 1 &&
        instances.findIndex(
          ({ instanceId }) => instanceId === activeInstanceId
        ) > -1
          ? height + instances.length
          : height,
      0
    )

    // Wrap the DAO apps in the loader
    return (
      <MenuPanelAppsLoader
        key="menu-apps"
        appsStatus={appsStatus}
        onRetry={onRequestAppsReload}
        appsCount={appGroups.length}
        expandedInstancesCount={expandedInstancesCount}
      >
        {() => appGroups.map(app => this.renderAppGroup(app))}
      </MenuPanelAppsLoader>
    )
  }
}

const SystemAppsToggle = styled(ButtonBase)`
  position: relative;
  width: 100%;
  padding: 0;
  margin: 20px 0 0;
  background: none;
  border: none;
  cursor: pointer;
  width: 100%;
  text-align: left;
  outline: none;
  &:active {
    background: ${p => p.activeBackground};
  }
`

const SystemAppsToggleArrow = props => (
  <animated.div {...props}>
    <div
      css={`
        display: flex;
        align-items: center;
        justify-content: center;
        width: 22px;
        height: 22px;
      `}
    >
      <IconArrow />
    </div>
  </animated.div>
)

const SystemAppsToggleShadow = props => (
  <div
    css={`
      position: absolute;
      left: 20px;
      right: 20px;
      bottom: 0;
    `}
  >
    <animated.div {...props}>
      <div
        css={`
          height: 1px;
          box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
        `}
      />
    </animated.div>
  </div>
)

const Main = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex: none;
  flex-direction: column;
  ${unselectable};
`

const Content = styled.nav`
  overflow-y: auto;
  flex: 1 1 0;
  .in {
    padding: 10px 0 10px;
  }
  h1 {
    margin: 10px 30px;
    text-transform: lowercase;
    font-variant: small-caps;
    font-weight: 600;
  }
  ul {
    list-style: none;
  }
  li {
    display: flex;
    align-items: center;
  }
`
export default function(props) {
  const theme = useTheme()
  return <MenuPanel {...props} theme={theme} />
}
