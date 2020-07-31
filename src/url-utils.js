import isIPFS from 'is-ipfs'
import { appLocator, ipfsDefaultConf } from './environment'
import { appendTrailingSlash } from './utils'

/*
 * Supported locations:
 *   ipfs:{IPFS_HASH}
 *   http:{HOST}
 *   http:{HOST}:{PORT}
 *   http:{HOST}:{PORT}/{PATH}
 *   http:http(s)://{HOST}
 *   http:http(s)://{HOST}:{PORT}
 *   http:http(s)://{HOST}:{PORT}/{PATH}
 */
function contentBaseUrl(content, gateway) {
  if (!content) {
    return ''
  }

  const { provider, location } = content
  if (provider === 'ipfs') {
    return `${gateway}/${location}/`
  }
  if (provider === 'http') {
    return /^https?:\/\//.test(location)
      ? appendTrailingSlash(location)
      : `http://${location}/`
  }
  return ''
}

export function appBaseUrl(app, gateway = ipfsDefaultConf.gateway) {
  // Support overriding app URLs, see network-config.js
  if (appLocator[app.appId]) {
    return appLocator[app.appId]
  }

  return contentBaseUrl(app.content, gateway)
}

export function repoBaseUrl(
  appId,
  repoVersion,
  gateway = ipfsDefaultConf.gateway
) {
  // Support overriding app URLs, see network-config.js
  if (appLocator[appId]) {
    return appLocator[appId]
  }

  return contentBaseUrl(
    // The version's content is the artifact.json and manifest.json, so we need to
    // look up content again for the actual content location
    repoVersion.content && repoVersion.content.content,
    gateway
  )
}

// Removes the HTTP protocol of a URL, and the final slash.
export function stripUrlProtocol(url = '') {
  return url.replace(/^https?:\/\//, '').replace(/\/$/, '')
}

const CODE_REPO_SERVICES = [
  ['GitHub', /^(?:https?:\/\/)?github\.com/i],
  ['GitLab', /^(?:https?:\/\/)?gitlab\.com/i],
  ['Bitbucket', /^(?:https?:\/\/)?bitbucket\.com/i],
]

// Return the name of a repository service based on a URL,
// with or without the HTTP protocol prefix.
export function sanitizeCodeRepositoryUrl(url) {
  for (const [name, re] of CODE_REPO_SERVICES) {
    if (re.test(url)) {
      return name
    }
  }
  return url
}

export function getIpfsCidFromUri(uri) {
  const ipfsCid = string.replace(/^ipfs:/, '')

  if (isIPFS.cid(ipfsCid) || isIPFS.cidPath(ipfsCid)) {
    return ipfsCid
  }
  return ''
}

export function getIpfsUrlfromUri(uri) {
  return `${ipfsDefaultConf.gateway}/${getIpfsCidFromUri(uri)}`
}
