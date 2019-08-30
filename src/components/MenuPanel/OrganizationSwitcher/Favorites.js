import React from 'react'
import PropTypes from 'prop-types'
import { EthIdenticon, IconPlus, GU, RADIUS, useTheme } from '@aragon/ui'
import { network } from '../../../environment'
import { getKnownOrganization } from '../../../known-organizations'
import { FavoriteDaoType, DaoItemType } from '../../../prop-types'
import { addressesEqual } from '../../../web3-utils'
import FavoritesMenu from '../../FavoritesMenu/FavoritesMenu'
import FavoritesMenuItemButton from '../../FavoritesMenu/FavoritesMenuItemButton'

class Favorites extends React.Component {
  static propTypes = {
    favoriteDaos: PropTypes.arrayOf(FavoriteDaoType),
    currentDao: DaoItemType,
    onUpdate: PropTypes.func.isRequired,
    theme: PropTypes.object,
  }

  state = { localDaos: [] }

  componentDidMount() {
    this.setState({ localDaos: this.getLocalDaos() })
  }

  componentWillUnmount() {
    const { onUpdate } = this.props
    const { localDaos } = this.state
    onUpdate(
      localDaos
        .filter(dao => dao.favorited)
        .map(dao => ({
          name: dao.name,
          address: dao.address,
        }))
    )
  }

  // Build the local DAO list based on the favorites. The favorite state is not
  // directly reflected in the popup, to let users favorite / unfavorite items
  // without seeing them being immediately removed. For this reason, we need to
  // maintain a separate state.
  getLocalDaos() {
    const { currentDao, favoriteDaos } = this.props

    const localDaos = [
      ...favoriteDaos
        .map(dao => ({ ...dao, favorited: true }))
        .sort(dao => (dao.address === currentDao.address ? -1 : 0)),
    ]

    // If the current DAO is favorited, it is already in the local list
    return this.isDaoFavorited(currentDao)
      ? localDaos
      : [{ ...currentDao, favorited: false }, ...localDaos]
  }

  isDaoFavorited({ address }) {
    return this.props.favoriteDaos.some(dao => dao.address === address)
  }

  currentDaoWithFavoriteState() {
    const { currentDao } = this.props
    const { localDaos } = this.state
    const daoItem = localDaos.find(dao => currentDao.address === dao.address)
    return {
      ...currentDao,
      favorited: daoItem ? daoItem.favorited : false,
    }
  }

  handleGoHome = () => {
    window.location.hash = ''
  }

  handleDaoOpened = address => {
    const { currentDao, favoriteDaos } = this.props
    const dao = [currentDao, ...favoriteDaos].find(
      dao => dao.address === address
    )
    window.location.hash = `/${(dao && dao.name) || address}`
  }

  handleFavoriteUpdate = (address, favorited) => {
    const { localDaos } = this.state

    this.setState({
      localDaos: localDaos.map(dao =>
        dao.address === address ? { ...dao, favorited } : dao
      ),
    })
  }

  render() {
    const { theme } = this.props
    const { localDaos } = this.state
    const currentDao = this.currentDaoWithFavoriteState()

    const allItems = localDaos.map(org => {
      const knownOrg = getKnownOrganization(network.type, org.address)
      return {
        ...org,
        id: org.address,
        roundedImage: true,
        name: knownOrg ? knownOrg.name : org.name || org.address,
        image: knownOrg ? (
          <img
            src={knownOrg.image}
            width="48"
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
      }
    })

    const favoriteItems = [...allItems].sort((org, org2) => {
      return addressesEqual(org.address, currentDao.address)
        ? -1
        : addressesEqual(org2.address, currentDao.address)
        ? 1
        : org.name.localeCompare(org2.name)
    })

    return (
      <section
        aria-label="Organizations"
        css={`
          width: ${42 * GU}px;
        `}
      >
        <FavoritesMenu
          items={favoriteItems}
          onActivate={this.handleDaoOpened}
          onFavoriteUpdate={this.handleFavoriteUpdate}
        />
        <FavoritesMenuItemButton
          onClick={this.handleGoHome}
          css={`
            width: 100%;
            padding: 0 ${2 * GU}px;
            border-top: 1px solid ${theme.border};
          `}
        >
          <span
            css={`
              display: flex;
              align-items: center;
              margin-right: ${1 * GU}px;
              color: ${theme.accentContent};
              background: ${theme.accent};
              border-radius: ${RADIUS}px;
            `}
          >
            <IconPlus />
          </span>
          <span>Open a new organization</span>
        </FavoritesMenuItemButton>
      </section>
    )
  }
}

export default props => {
  const theme = useTheme()
  return <Favorites theme={theme} {...props} />
}
