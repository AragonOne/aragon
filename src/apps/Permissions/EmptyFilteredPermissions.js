import React from 'react'
import PropTypes from 'prop-types'
import { ButtonText, GU, textStyle, useTheme } from '@aragon/ui'
import noResultsSvg from '../../assets/no-results.svg'

function EmptyFilteredPermissions({ onClear }) {
  const theme = useTheme()

  return (
    <div
      css={`
        margin-top: ${4 * GU}px;
        display: flex;
        flex-direction: column;
        align-items: center;
      `}
    >
      <img
        css={`
          margin: ${4 * GU}px 0;
          height: 176px;
        `}
        src={noResultsSvg}
        alt="No results"
      />
      <h3
        css={`
          font-size: 28px;
          color: ${theme.content};
        `}
      >
        No results found.
      </h3>
      <div
        css={`
          max-width: 270px;
          text-align: center;
          margin-top: ${1 * GU}px;
          margin-bottom: ${4 * GU}px;
          color: ${theme.surfaceContentSecondary};
          ${textStyle('body2')}
        `}
      >
        There are no permissions matching your search criteria.{' '}
        <ButtonText horizontalPadding="none" onClick={onClear}>
          Clear filters
        </ButtonText>
      </div>
    </div>
  )
}

EmptyFilteredPermissions.propTypes = {
  onClear: PropTypes.func.isRequired,
}

export default React.memo(EmptyFilteredPermissions)
