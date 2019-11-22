import React, { useState, useEffect } from 'react'
import { GU } from '@aragon/ui'
import { web3Providers } from '../../environment'
import { getWeb3 } from '../../web3-utils'

const SyncedInfo = () => {
  const [lastBlockIndex, setLastBlockIndex] = useState()

  useEffect(() => {
    const walletWeb3 = getWeb3(web3Providers.wallet)

    async function getLastBlockNumber() {
      const latest = await walletWeb3.eth.getBlockNumber()
      setLastBlockIndex(latest)
    }
    getLastBlockNumber()
  }, [])

  return (
    <div
      css={`
        margin-top: ${1 * GU}px;
      `}
    >
      <span
        css={`
          padding-right: ${1 * GU}px;
          opacity: 0.8;
        `}
      >
        Synced:
      </span>
      <span>current block: {lastBlockIndex || '…'}</span>
    </div>
  )
}

export default SyncedInfo
