import appIds from './known-app-ids'

// Known apps and their assigned ports
const DEFAULT_LOCAL_URLS = {
  [appIds['Voting']]: 'http://localhost:3001/',
  [appIds['Finance']]: 'http://localhost:3002/',
  [appIds['TokenManager']]: 'http://localhost:3003/',
  [appIds['Survey']]: 'http://localhost:3004/',
  [appIds['Agent']]: 'http://localhost:3005/',
  [appIds['Fundraising']]: 'http://localhost:3006/',
}

// Split a single bridge declaration into an app + a location
function splitBridge(bridge) {
  const firstColon = bridge.indexOf(':')
  if (firstColon === -1) {
    return [bridge]
  }
  return [
    bridge.slice(0, firstColon).trim(),
    bridge.slice(firstColon + 1).trim(),
  ]
}

function getAppId(app) {
  // known app name
  if (appIds[app]) {
    return appIds[app]
  }

  // probably a valid app ID
  if (app.startsWith('0x') && app.length === 66) {
    return app
  }

  return null
}

function getAppUrl(appId, location) {
  // get the default URL for this appId (if location is local)
  if ((!location || location === 'local') && DEFAULT_LOCAL_URLS[appId]) {
    return DEFAULT_LOCAL_URLS[appId]
  }

  // probably a valid HTTP URL
  if (location.startsWith('http')) {
    return location
  }

  // probably a valid port, default to localhost
  if (/^[0-9]+$/.test(location)) {
    return `http://localhost:${location}/`
  }
  // no URL found
  return null
}

// The app locator object can be used to know where to fetch an app from.
//
// It is generated from a bridge declaration that can look like one of these examples:
//
// "local": load all the known apps from localhost & their known ports.
// "Finance": load the finance app from localhost & its known port.
// "Finance:1234": load the finance app from localhost & the port 1234.
// "Finance,TokenManager": load the finance app and the Tokens app locally.
// "0x6b20…:3333": load the app with 0x6b20… ID from localhost & the 3333 port.
// "Voting:http://example.com:4444/": load the Voting app from example.com & the 4444 port.
//
export default function getAppLocator(assetBridge) {
  if (!assetBridge || assetBridge === 'ipfs') {
    return {}
  }

  if (assetBridge === 'local') {
    return DEFAULT_LOCAL_URLS
  }

  return assetBridge.split(',').reduce((appLocator, bridge) => {
    const [app, location] = splitBridge(bridge)

    const appId = getAppId(app)

    // App not found or invalid app ID
    if (appId === null) {
      return appLocator
    }

    const appUrl = getAppUrl(appId, location)

    // App URL not found (invalid non-local location)
    if (appUrl === null) {
      return appLocator
    }

    // Update the app locator
    return { ...appLocator, [appId]: appUrl }
  }, {})
}
