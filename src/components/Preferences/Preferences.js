import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {
  AppBar,
  AppView,
  ButtonIcon,
  TabBar,
  Viewport,
  IconClose,
  font,
} from '@aragon/ui'
import CustomLabels from './CustomLabels'

const SMALL_TABS = ['Network', 'Manage labels']

const TABS = ['Network', 'Addresses', 'Manage labels']

const Preferences = ({ onClose, opened, smallView, ...props }) => {
  if (!opened) {
    return null
  }

  const [selectedTab, setSelectedTab] = React.useState(0 || smallView ? 1 : 2)

  return (
    <StyledAppView
      smallView={smallView}
      padding={0}
      appBar={
        <StyledAppBar>
          <Title>My Preferences</Title>
          <StyledButton label="Close" onClick={onClose}>
            <IconClose />
          </StyledButton>
        </StyledAppBar>
      }
    >
      <Section>
        <TabBar
          items={smallView ? SMALL_TABS : TABS}
          selected={selectedTab}
          onSelect={setSelectedTab}
        />
        <Content>
          {selectedTab === 0 && <Network />}
          {!smallView && selectedTab === 1 && <Addresses />}
          {((!smallView && selectedTab === 2) ||
            (smallView && selectedTab === 1)) && <CustomLabels />}
        </Content>
      </Section>
    </StyledAppView>
  )
}

Preferences.propTypes = {
  onClose: PropTypes.func.isRequired,
  opened: PropTypes.bool.isRequired,
  smallView: PropTypes.bool.isRequired,
}

const Addresses = () => 'Coming soon...'

const Network = () => 'Coming soon...'

const Title = styled.h1`
  ${font({ size: 'xxlarge' })};
`

const Section = styled.section`
  padding: 16px 0;
`

const Content = styled.main`
  padding-top: 16px;
`

const StyledAppBar = styled(AppBar)`
  padding-left: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const StyledButton = styled(ButtonIcon)`
  width: auto;
  height: 100%;
  padding: 0 16px;
`

const StyledAppView = styled(AppView)`
  position: fixed;
  background: #fff;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: ${({ smallView }) => (smallView ? 2 : 4)};
  min-width: 320px;
`

export default props => (
  <Viewport>
    {({ below }) => <Preferences smallView={below('medium')} {...props} />}
  </Viewport>
)
