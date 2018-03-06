import Aragon from '@aragon/wrapper'
import Web3 from 'web3'
import { providers } from '@aragon/messenger'
import { noop } from './utils'

const ACCOUNTS_POLL_EVERY = 2000

const IPFS_CONF_DEFAULT = {
  rpc: { host: 'ipfs.infura.io', port: '5001', protocol: 'https' },
}

const appSrc = (app = {}) => {
  const hash = app.content && app.content.location
  if (!hash) return ''

  // TODO: move this in the env settings
  // This is the Voting app hash in the dev template
  if (hash === 'QmV5sEjshcZ6mu6uFUhJkWM5nTa53wbHfRFDD4Qy2Yx88m') {
    return 'http://localhost:3001/'
  }

  return `https://gateway.ipfs.io/ipfs/${hash}/`
}

// Filter out apps without UI and add an appSrc property
const prepareFrontendApps = apps =>
  apps
    .filter(app => app.content && app.name !== 'Vault')
    .map(app => ({ ...app, appSrc: appSrc(app) }))

const initWrapper = async (
  daoAddress,
  ensRegistryAddress,
  {
    provider,
    walletProvider = null,
    ipfsConf = IPFS_CONF_DEFAULT,
    onError = noop,
    onApps = noop,
    onForwarders = noop,
    onTransaction = noop,
    onWeb3 = noop,
    onAccounts = noop,
  } = {}
) => {
  const wrapper = new Aragon(daoAddress, {
    ensRegistryAddress,
    provider,
    apm: { ipfs: ipfsConf },
  })

  const web3 = new Web3(walletProvider || provider)
  onWeb3(web3)

  const pollAccounts = () => {
    if (!web3) {
      return
    }
    web3.eth.getAccounts((err, accounts) => {
      if (!err) {
        onAccounts(accounts || [])
      }
      setTimeout(pollAccounts, ACCOUNTS_POLL_EVERY)
    })
  }
  pollAccounts()

  try {
    await wrapper.init()
  } catch (err) {
    if (err.message === 'connection not open') {
      onError('NO_CONNECTION')
      return
    }
    throw err
  }

  const { apps, forwarders, transactions } = wrapper

  const subscriptions = {
    apps: apps.subscribe(apps => {
      const frontendApps = prepareFrontendApps(apps)
      onApps(frontendApps, apps)
    }),
    forwarders: forwarders.subscribe(onForwarders),
    transactions: transactions.subscribe(onTransaction),
    connectedApp: null,
  }

  wrapper.connectAppIframe = (iframeElt, proxyAddress) => {
    const provider = new providers.WindowMessage(iframeElt.contentWindow)
    const result = wrapper.runApp(provider, proxyAddress)
    if (subscriptions.connectedApp) {
      subscriptions.connectedApp.unsubscribe()
    }
    subscriptions.connectedApp = result.shutdown
    return result
  }

  wrapper.cancel = () => {
    Object.values(subscriptions).forEach(subscription => {
      if (subscription) {
        subscription.unsubscribe()
      }
    })
  }

  return wrapper
}

export default initWrapper
