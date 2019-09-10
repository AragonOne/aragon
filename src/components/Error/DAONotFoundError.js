import React from 'react'
import PropTypes from 'prop-types'
import { useTheme, textStyle, Link, EmptyStateCard, GU, Info } from '@aragon/ui'
import { network } from '../../environment'
import { isAddress } from '../../web3-utils'
import notFoundImage from '../../assets/dao-not-found.png'

function DAONotFoundError({ dao }) {
  const theme = useTheme()
  return (
    <EmptyStateCard
      css={`
        display: grid;
        grid-template-rows: 1fr auto auto auto;
        grid-template-columns: 1fr;
        padding: ${2 * GU}px;
        width: ${72 * GU}px;
        height: auto;
        box-shadow: 0px 2px 4px rgba(180, 188, 202, 0.5);
      `}
      illustration={
        <img
          src={notFoundImage}
          alt="Organization not found"
          width="147px"
          height="144px"
          css={`
            margin: ${5 * GU}px auto ${1.5 * GU}px;
          `}
        />
      }
      text={
        <React.Fragment>
          <h1
            css={`
              color: ${theme.feedbackSurfaceContent};
              ${textStyle('title2')};
              margin-bottom: ${1.5 * GU}px;
            `}
          >
            Organization not found
          </h1>
          <div
            css={`
              color: ${theme.feedbackSurfaceContentSecondary};
              ${textStyle('body2')};
              margin: auto;
              margin-bottom: ${6 * GU}px;
              max-width: ${52 * GU}px;
            `}
          >
            It looks like there’s no organization associated with{' '}
            {isAddress(dao) ? (
              <span css="font-weight: bold;">“{dao}”</span>
            ) : (
              <React.Fragment>
                the <strong>“{dao}”</strong> ENS domain
              </React.Fragment>
            )}
            on the Ethereum {network.name}.
          </div>
        </React.Fragment>
      }
      action={
        <Info css="text-align: left;">
          If you arrived here through a link, please double check that you were
          given the correct link. Alternatively, you may
          <Link onClick={() => (window.location = window.location.origin)}>
            create a new organization.
          </Link>
        </Info>
      }
    />
  )
}

DAONotFoundError.propTypes = {
  dao: PropTypes.string,
}

export default DAONotFoundError
