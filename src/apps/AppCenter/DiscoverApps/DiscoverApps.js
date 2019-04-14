import React from 'react'
import styled from 'styled-components'
import {
  Card,
  Badge,
  Text,
  SafeLink,
  theme,
  colors,
  unselectable,
  breakpoint,
} from '@aragon/ui'
import { shuffleArray } from '../../../utils'
import AppIcon from '../../../components/AppIcon/AppIcon'
import payrollIcon from './icons/payroll.svg'
import espressoIcon from './icons/espresso.svg'
import agentIcon from './icons/agent.svg'
import surveyIcon from './icons/survey.svg'

const statuses = {
  'pre-alpha': colors.Gold.Brandy,
  alpha: colors.Blue.Danube,
  experimental: colors.Blue.Danube,
  ready: colors.Green['Spring Green'],
}

const appsInDevelopment = [
  // Ready
  ...shuffleArray([
    {
      icon: surveyIcon,
      name: 'Survey',
      status: 'ready',
      description: `Create multi-option signaling votes.`,
      link: 'https://github.com/aragon/aragon-apps/tree/master/apps/survey',
    },
  ]),

  // Experimental
  ...shuffleArray([
    {
      icon: agentIcon,
      name: 'Agent',
      status: 'experimental',
      description: `Hold assets and perform actions from DAOs`,
      link: 'https://github.com/aragon/aragon-apps/tree/master/apps/agent',
    },
    {
      icon: payrollIcon,
      name: 'Payroll',
      status: 'experimental',
      description: `Pay and get paid, by the block.
                    Supports tokens and price feeds.`,
      link:
        'https://github.com/aragon/aragon-apps/tree/master/future-apps/payroll',
    },
    {
      icon: null,
      name: 'That Planning Suite',
      status: 'experimental',
      description: `Suite for open and fluid organizations.
                    Bounties, range voting, and more.`,
      link: 'https://github.com/AutarkLabs/planning-suite',
    },
    {
      icon: null,
      name: 'Pando',
      status: 'experimental',
      description:
        'Distributed git remote protocol based on IPFS, ethereum and aragonOS',
      link: 'https://github.com/pandonetwork/pando',
    },
  ]),

  // Alpha
  ...shuffleArray([]),

  // Pre-alpha
  ...shuffleArray([
    {
      icon: espressoIcon,
      name: 'Espresso',
      status: 'pre-alpha',
      description: `Collaborative data vault.
                    Encrypt and share data with people in your organization.`,
      link: 'https://github.com/espresso-org',
    },
    {
      icon: null,
      name: 'Liquid democracy',
      status: 'pre-alpha',
      description: `Delegate your voting power to others,
                    and vote on important matters.`,
      link: 'https://github.com/aragonlabs/liquid-democracy',
    },
  ]),
]

const DiscoverApps = React.memo(() => (
  <div>
    <p>
      You will soon be able to <em>browse</em> and <em>install</em> new apps
      into your Aragon organization from here.
    </p>
    <p>
      In the meantime, you can{' '}
      <SafeLink href="https://hack.aragon.org/" target="_blank">
        learn how to create apps
      </SafeLink>{' '}
      or preview some of the apps being developed.
    </p>

    <h1
      css={`
        margin: 30px 0;
        font-weight: 600;
      `}
    >
      Apps in development
    </h1>
    <AppsGrid>
      {appsInDevelopment.map((app, i) => (
        <Main key={i}>
          <Icon>
            <AppIcon size={64} src={app.icon} />
          </Icon>
          <Name>{app.name}</Name>
          <TagWrapper>
            <Tag background={statuses[app.status]}>{app.status}</Tag>
          </TagWrapper>
          <Description color={theme.textSecondary}>
            {app.description}
          </Description>
          <Action href={app.link} target="_blank">
            <Text weight="bold" color={theme.textSecondary}>
              Learn more
            </Text>
          </Action>
        </Main>
      ))}
    </AppsGrid>
  </div>
))

const AppsGrid = styled.div`
  display: grid;
  grid-auto-flow: row;
  grid-gap: 25px;
  justify-items: start;
  grid-template-columns: 1fr;
  ${breakpoint(
    'medium',
    `
      grid-template-columns: repeat(auto-fill, 224px);
    `
  )};
`

const Main = styled(Card).attrs({ width: '100%', height: '288px' })`
  ${unselectable};
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 25px;
`

const Icon = styled.div`
  height: 64px;
  margin-bottom: 5px;
  img {
    display: block;
  }
`

const Name = styled.p`
  display: flex;
  width: 100%;
  justify-content: center;
  margin-bottom: 10px;
`

const TagWrapper = styled.div`
  max-width: 100%;
  padding: 0 20px;
  margin-bottom: 10px;
`

const Tag = styled(Badge)`
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
  color: white;
`

const Description = styled(Text)`
  padding: 0 1rem;
  margin-bottom: 30px;
  text-align: center;
`

const Action = styled(SafeLink)`
  position: absolute;
  bottom: 0;
  width: 100%;
  padding-bottom: 30px;
  text-align: center;
  text-decoration: none;
`

export default DiscoverApps
