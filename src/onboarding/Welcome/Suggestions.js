import React, { useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'
import { EthIdenticon, Box, GU } from '@aragon/ui'
import FavoritesMenu from '../../components/FavoritesMenu/FavoritesMenu'
import { useFavoriteDaos } from '../../contexts/FavoriteDaosContext'
import { network } from '../../environment'
import {
  getKnownOrganization,
  getRecommendedOrganizations,
} from '../../known-organizations'
import { addressesEqual } from '../../web3-utils'

function Suggestions({ suggestedOrgs }) {
  const {
    isAddressFavorited,
    removeFavoriteByAddress,
    addFavorite,
  } = useFavoriteDaos()

  const updateFavorite = useCallback(
    (address, favorite) => {
      const org = suggestedOrgs.find(org =>
        addressesEqual(org.address, address)
      )

      // Can’t find the org
      if (!org) {
        return
      }

      if (favorite) {
        addFavorite(org)
      } else {
        removeFavoriteByAddress(org.address)
      }
    },
    [addFavorite, removeFavoriteByAddress, suggestedOrgs]
  )

  const openOrg = useCallback(
    address => {
      const org = suggestedOrgs.find(org =>
        addressesEqual(org.address, address)
      )
      window.location.hash = `/${(org && org.name) || address}`
    },
    [suggestedOrgs]
  )

  if (suggestedOrgs.length === 0) {
    return null
  }

  return (
    <Box heading="Explore" padding={0}>
      <FavoritesMenu
        items={suggestedOrgs.map(org => {
          const knownOrg = getKnownOrganization(network.type, org.address)
          return {
            favorited: isAddressFavorited(org.address),
            id: org.address,
            roundedImage: !knownOrg,
            image: knownOrg ? (
              <img
                src={knownOrg.image}
                width={3 * GU}
                alt=""
                css={`
                  object-fit: contain;
                  width: 100%;
                  height: 100%;
                `}
              />
            ) : (
              <EthIdenticon address={org.address} />
            ),
            name: knownOrg ? knownOrg.name : org.name || org.address,
            secondary: knownOrg ? knownOrg.template : '',
          }
        })}
        onActivate={openOrg}
        onFavoriteUpdate={updateFavorite}
      />
    </Box>
  )
}

Suggestions.propTypes = {
  suggestedOrgs: PropTypes.array.isRequired,
}

export default Suggestions
