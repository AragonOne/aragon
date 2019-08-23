import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {
  Button,
  GU,
  Info,
  Link,
  SidePanel,
  SidePanelSeparator,
  SidePanelSplit,
  textStyle,
  useTheme,
} from '@aragon/ui'
import { RepoType } from '../../prop-types'
import RepoBadge from './RepoBadge'
import { parseHub } from '../../url-utils'

class UpgradeAppPanel extends React.PureComponent {
  static propTypes = {
    repo: RepoType,
    onClose: PropTypes.func.isRequired,
    onUpgrade: PropTypes.func.isRequired,
  }
  state = {
    repo: null,
  }
  static getDerivedStateFromProps(props, state) {
    // `repo` is saved in the state, so that the selected app
    // can still be visible while the panel is being closed.
    if (props.repo !== state.repo && props.repo) {
      return { repo: props.repo }
    }
    return {}
  }
  handleUpgradeClick = () => {
    const {
      repo: { appId, versions },
      onUpgrade,
    } = this.props
    const { contractAddress } = versions[versions.length - 1]
    onUpgrade(appId, contractAddress)
  }
  render() {
    const { repo } = this.state
    const { repo: propsRepo, onClose, theme } = this.props

    if (!repo) {
      return null
    }

    const { currentVersion, latestVersion, repoAddress } = repo
    const {
      name,
      changelog_url: changelogUrl,
      source_url: sourceUrl,
    } = latestVersion.content
    const [{ proxyAddress }] = repo.instances

    return (
      <SidePanel
        title={`Upgrade “${name || 'Unknown'}”`}
        opened={Boolean(propsRepo)}
        onClose={onClose}
        css={``}
      >
        <SidePanelSplit
          css={`
            border-bottom: 1px solid ${theme.border};
            ${textStyle('body2')};
          `}
        >
          <div>
            <Heading2 theme={theme}>Current version</Heading2>
            <RepoVersionWrapper>
              {currentVersion.version} <RepoBadge repo={currentVersion} />
            </RepoVersionWrapper>
          </div>
          <div>
            <Heading2 theme={theme}>New version</Heading2>
            <RepoVersionWrapper>
              {latestVersion.version} <RepoBadge repo={latestVersion} />
            </RepoVersionWrapper>
          </div>
        </SidePanelSplit>

        <Part>
          <Heading2 theme={theme}>Changelog</Heading2>
          <p>
            {changelogUrl ? (
              <Link href={changelogUrl} target="_blank">
                {parseHub(changelogUrl)}
              </Link>
            ) : (
              'There is no changelog for this version.'
            )}
          </p>

          <Heading2 theme={theme}>Source code</Heading2>
          <p>
            {sourceUrl ? (
              <Link href={sourceUrl} target="_blank">
                {parseHub(sourceUrl)}
              </Link>
            ) : (
              'There is no available source for this app.'
            )}
          </p>
        </Part>

        <SidePanelSeparator />
        <Part>
          <Heading2 theme={theme}>Permissions</Heading2>
          <p>This upgrade doesn’t introduce any new permissions.</p>
        </Part>

        <SidePanelSeparator />

        <Part>
          <div
            css={`
              margin: ${4 * GU}px 0 ${2 * GU}px;
            `}
          >
            <Button mode="strong" wide onClick={this.handleUpgradeClick}>
              Upgrade
            </Button>
          </div>

          <Info.Action>
            All the “{name}” app instances installed on your organization will
            be upgraded.
          </Info.Action>
        </Part>
      </SidePanel>
    )
  }
}

const RepoVersionWrapper = styled.div`
  display: inline-grid;
  grid-template-columns: auto auto;
  grid-gap: ${1 * GU}px;
  align-items: center;
`

const Heading2 = styled.h2`
  color: ${({ theme }) => theme.contentSecondary};
  ${textStyle('label2')};
  white-space: nowrap;
  margin-bottom: ${2 * GU}px;
`

const Part = styled.div`
  ${textStyle('body2')};
  padding: ${GU}px 0 ${3 * GU}px;
  h2 {
    margin: ${2 * GU}px 0 ${GU}px;
  }
`

export default props => {
  const theme = useTheme()
  return <UpgradeAppPanel {...props} theme={theme} />
}
