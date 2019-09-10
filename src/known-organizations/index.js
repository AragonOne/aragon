import aragonGovernanceImage from './images/aragon-governance.svg'
import aragonOneImage from './images/aragon-one.svg'
import brightIdImage from './images/brightid.svg'
import melonCouncilImage from './images/melon-council.svg'
import blankDaoImage from './images/blankdao.svg'
import livepeerImage from './images/livepeer.svg'
import myBitImage from './images/mybit.svg'
import onehive from './images/1hive.svg'
import aragonMesh from './images/aragon-mesh.svg'

const TEMPLATE_DEMOCRACY = 'Democracy'
const TEMPLATE_REPUTATION = 'Reputation'
const TEMPLATE_COMPANY = 'Company'
const TEMPLATE_MEMBERSHIP = 'Membership'

export const KnownOrganizations = {
  main: new Map(
    [
      {
        address: '0xfe1f2de598f42ce67bb9aad5ad473f0272d09b74',
        domain: 'meloncouncil.eth',
        image: melonCouncilImage,
        name: 'Melon Council',
        template: TEMPLATE_DEMOCRACY,
      },
      {
        address: '0x2de83b50af29678774d5abc4a7cb2a588762f28c',
        domain: 'governance.aragonproject.eth',
        name: 'Aragon Governance',
        image: aragonGovernanceImage,
        recommended: true,
        template: TEMPLATE_DEMOCRACY,
      },
      {
        address: '0x635193983512c621e6a3e15ee1dbf36f0c0db8e0',
        domain: 'a1.aragonid.eth',
        name: 'Aragon One',
        image: aragonOneImage,
        template: TEMPLATE_DEMOCRACY,
      },
      {
        address: '0x67757A18eDA83125270Ef94dCec7658Eb39bD8a5',
        domain: 'blankdao.aragonid.eth',
        name: 'BlankDAO',
        image: blankDaoImage,
        recommended: true,
        template: TEMPLATE_DEMOCRACY,
      },
      {
        address: '0xcD3d9b832BfF15E0a519610372c6AAC651872DdE',
        domain: '',
        name: 'MyBit',
        image: myBitImage,
        recommended: true,
        template: TEMPLATE_DEMOCRACY,
      },
      {
        address: '0x0ee165029b09d91a54687041Adbc705F6376C67F',
        domain: '',
        name: 'Livepeer',
        image: livepeerImage,
        recommended: true,
        template: TEMPLATE_DEMOCRACY,
      },
      {
        address: '0x5aad137d8f7d2dc6e1b2548c059b1483360bcc6a',
        domain: 'brightid.aragonid.eth',
        name: 'BrightID',
        image: brightIdImage,
        recommended: true,
        template: TEMPLATE_DEMOCRACY,
      },
    ].map(org => [org.address, org])
  ),
  rinkeby: new Map(
    [
      {
        address: '0x43374144C33DEF77A0ebaceC72E9C944A6c375FE',
        domain: 'reputation08.aragonid.eth',
        name: 'Example reputation organization',
        image: null,
        recommended: true,
        template: TEMPLATE_REPUTATION,
      },
      {
        address: '0xb2a22974bd09EB5D1B5c726E7C29f4faeF636dd2',
        domain: 'company08.aragonid.eth',
        name: 'Example company',
        image: null,
        recommended: true,
        template: TEMPLATE_COMPANY,
      },
      {
        address: '0x0d9938b8720EB5124371C9FA2049144626F67D2E',
        domain: 'membership08.aragonid.eth',
        name: 'Example membership',
        image: null,
        recommended: true,
        template: TEMPLATE_MEMBERSHIP,
      },
      {
        address: '0xe520428C232F6Da6f694b121181f907931fD2211',
        domain: 'hive.aragonid.eth',
        name: '1Hive',
        image: onehive,
        recommended: true,
        template: null,
      },
      {
        address: '0xa48300a4E89b59A79452Db7d3CD408Df57f4aa78',
        domain: 'mesh.aragonid.eth',
        name: 'Aragon Mesh',
        image: aragonMesh,
        recommended: true,
        template: null,
      },
    ].map(org => [org.address, org])
  ),
}

// Get the organizations that might appear in the suggestions,
// using the format `{ address, name }` where name is the ENS domain.
export const getRecommendedOrganizations = (networkType, max = -1) => {
  if (!KnownOrganizations[networkType]) {
    return []
  }

  const recommended = []
  for (const [address, org] of KnownOrganizations[networkType]) {
    if (org.recommended) {
      recommended.push({ address, name: org.domain })
      if (recommended.length === max) {
        break
      }
    }
  }

  return recommended
}

export const getKnownOrganization = (networkType, address) => {
  if (!KnownOrganizations[networkType]) return null
  return KnownOrganizations[networkType].get(address.toLowerCase()) || null
}
