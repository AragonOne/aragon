import aragonGovernanceImage from './images/aragon-governance.svg'
import aragonOneImage from './images/aragon-one.svg'
import melonCouncilImage from './images/melon-council.svg'

export const KnownOrganizations = {
  main: new Map([
    // meloncouncil.eth
    [
      '0x2ae0aa6976112b3a3227aa5df4b1beee2ea4aab6',
      { name: 'Melon Council', image: melonCouncilImage },
    ],

    // governance.aragonproject.eth
    [
      '0x2de83b50af29678774d5abc4a7cb2a588762f28c',
      { name: 'Aragon Governance', image: aragonGovernanceImage },
    ],

    // a1.aragonid.eth
    [
      '0x635193983512c621e6a3e15ee1dbf36f0c0db8e0',
      { name: 'Aragon One', image: aragonOneImage },
    ],
  ]),
}

export const getKnownOrganization = (networkType, address) => {
  if (!KnownOrganizations[networkType]) return null
  return KnownOrganizations[networkType].get(address) || null
}
