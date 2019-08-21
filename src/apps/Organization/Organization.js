import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import {
  Box,
  Button,
  ButtonText,
  Header,
  IconCoin,
  Info,
  Layout,
  GU,
  textStyle,
  unselectable,
  useLayout,
  useTheme,
} from '@aragon/ui'
import LocalIdentityBadge from '../../components/IdentityBadge/LocalIdentityBadge'
import { appIds, network } from '../../environment'
import { sanitizeNetworkType } from '../../network-config'
import { AppType, DaoAddressType, EthereumAddressType } from '../../prop-types'
import getProviderString from '../../provider-strings'
import airdrop, { testTokensEnabled } from '../../testnet/airdrop'
import { toChecksumAddress } from '../../web3-utils'
import useAppWidth from '../useAppWidth'

const Organization = React.memo(
  ({
    account,
    apps,
    appsLoading,
    daoAddress,
    onOpenApp,
    walletNetwork,
    walletWeb3,
    walletProviderId,
  }) => {
    const theme = useTheme()
    const { layoutName } = useLayout()

    const handleDepositTestTokens = useCallback(() => {
      const finance = apps.find(app => app.appId === appIds.Finance)
      if (finance && finance.proxyAddress) {
        airdrop(walletWeb3, finance.proxyAddress, account)
      }
    }, [account, apps, walletWeb3])
    const handleOpenAgentApp = useCallback(() => {
      const agent = apps.find(app => app.appId === appIds.Agent)
      if (agent && agent.proxyAddress) {
        onOpenApp(agent.proxyAddress)
      }
    }, [apps, onOpenApp])
    const handleOpenFinanceApp = useCallback(() => {
      const finance = apps.find(app => app.appId === appIds.Finance)
      if (finance && finance.proxyAddress) {
        onOpenApp(finance.proxyAddress)
      }
    }, [apps, onOpenApp])

    const apmApps = apps.filter(app => !app.isAragonOsInternalApp)
    const hasAgentApp = apps.some(app => app.appId === appIds.Agent)
    const hasFinanceApp = apps.some(app => app.appId === appIds.Finance)
    const checksummedDaoAddr =
      daoAddress.address && toChecksumAddress(daoAddress.address)
    const enableTransactions = !!account && walletNetwork === network.type
    const shortAddresses = layoutName !== 'large'

    const depositFundsHelpText = appsLoading ? (
      ''
    ) : hasFinanceApp || hasAgentApp ? (
      <span>
        If you'd like to deposit funds into this organization, you can do so
        from{' '}
        {hasFinanceApp ? (
          <OpenAppButton onClick={handleOpenFinanceApp}>Finance</OpenAppButton>
        ) : (
          <OpenAppButton onClick={handleOpenAgentApp}>Agent</OpenAppButton>
        )}
        .
      </span>
    ) : (
      `This organization does not have a Finance or Agent app installed and may
       not be able to receive funds. Please check with the organization's
       administrators if any other installed apps are able to receive funds.`
    )

    return (
      <React.Fragment>
        <Header primary="Organization Settings" />
        <Section heading="Organization address">
          <p
            css={`
              ${textStyle('body2')}
            `}
          >
            {checksummedDaoAddr
              ? `This organization is deployed on the Ethereum ${network.name}.`
              : 'Resolving DAO address…'}
          </p>
          {checksummedDaoAddr && (
            <React.Fragment>
              <div
                css={`
                  margin-top: ${2 * GU}px;
                  margin-bottom: ${3 * GU}px;
                `}
              >
                <LocalIdentityBadge
                  entity={checksummedDaoAddr}
                  shorten={shortAddresses}
                />
              </div>
              <Info>
                <strong css="font-weight: 800">
                  Do not send ETH or ERC20 tokens to this address.
                </strong>{' '}
                {depositFundsHelpText}
              </Info>
            </React.Fragment>
          )}
        </Section>
        {hasFinanceApp && testTokensEnabled(network.type) && (
          <Section heading="Request test tokens">
            <p
              css={`
                margin-bottom: ${2 * GU}px;
                ${textStyle('body2')}
              `}
            >
              Deposit some tokens into your organization for testing purposes.
            </p>
            <Button
              label="Request test tokens"
              icon={<IconCoin />}
              display="all"
              onClick={handleDepositTestTokens}
              disabled={!enableTransactions}
              css={`
                margin-bottom: ${2 * GU}px;
              `}
            />
            {enableTransactions ? (
              <Info>
                <p>
                  Requesting tokens will assign random{' '}
                  <strong css="font-weight: 800">test tokens</strong> to your
                  organization. These tokens are named after existing projects,
                  but keep in mind{' '}
                  <strong css="font-weight: 800">
                    they are not real tokens
                  </strong>
                  .
                </p>
                <p
                  css={`
                    margin-top: ${1 * GU}px;
                  `}
                >
                  You can view the received tokens in{' '}
                  <OpenAppButton onClick={handleOpenFinanceApp}>
                    Finance
                  </OpenAppButton>
                  .
                </p>
              </Info>
            ) : (
              <Info mode="warning">
                {walletNetwork !== network.type
                  ? `Please select the ${sanitizeNetworkType(
                      network.type
                    )} network in your Ethereum provider.`
                  : `Please unlock your account in ${getProviderString(
                      'your Ethereum provider',
                      walletProviderId
                    )}.`}
              </Info>
            )}
          </Section>
        )}
        {appsLoading ? (
          <Section heading="Installed Aragon apps">
            <div
              css={`
                display: flex;
                align-items: center;
                justify-content: center;
                height: 180px;
                ${textStyle('body2')}
              `}
            >
              Loading apps…
            </div>
          </Section>
        ) : (
          <Section heading="Installed Aragon apps">
            <ul
              css={`
                list-style: none;
                display: grid;
                grid-template-columns: minmax(50%, 1fr) minmax(50%, 1fr);
                grid-column-gap: ${2 * GU}px;
                margin-bottom: -${3 * GU}px;
              `}
            >
              {apmApps.map(
                ({ appId, description, name, proxyAddress, tags }) => (
                  <li
                    key={proxyAddress}
                    css={`
                      margin-bottom: ${3 * GU}px;
                    `}
                  >
                    <label
                      css={`
                        color: ${theme.surfaceContentSecondary};
                        ${unselectable()};
                        ${textStyle('label2')};
                      `}
                    >
                      {name}
                      {tags.length > 0 ? ` (${tags.join(', ')})` : ''}
                    </label>
                    <div
                      css={`
                        margin-top: ${1 * GU}px;
                      `}
                    >
                      <LocalIdentityBadge
                        entity={proxyAddress}
                        shorten={shortAddresses}
                      />
                    </div>
                  </li>
                )
              )}
            </ul>
          </Section>
        )}
      </React.Fragment>
    )
  }
)

Organization.propTypes = {
  account: EthereumAddressType,
  apps: PropTypes.arrayOf(AppType).isRequired,
  appsLoading: PropTypes.bool.isRequired,
  daoAddress: DaoAddressType.isRequired,
  onOpenApp: PropTypes.func.isRequired,
  walletNetwork: PropTypes.string.isRequired,
  walletWeb3: PropTypes.object.isRequired,
  walletProviderId: PropTypes.string.isRequired,
}

const Section = ({ ...props }) => {
  return <Box padding={3 * GU} {...props} />
}

const OpenAppButton = props => (
  <ButtonText
    css={`
      padding: 0;
      font-weight: 600;
    `}
    {...props}
  />
)

export default props => {
  const appWidth = useAppWidth()
  return (
    <Layout parentWidth={appWidth}>
      <Organization {...props} />
    </Layout>
  )
}
