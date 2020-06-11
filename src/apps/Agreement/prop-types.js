import PropTypes from 'prop-types'

const AppItemType = PropTypes.shape({
  entryActions: PropTypes.arrayOf(PropTypes.array),
  allowedActions: PropTypes.arrayOf(PropTypes.string).isRequired,
  actionCollateral: PropTypes.shape({
    amount: PropTypes.number,
    symbol: PropTypes.string,
    address: PropTypes.string,
  }),
  challengeCollateral: PropTypes.shape({
    amount: PropTypes.number,
    symbol: PropTypes.string,
    address: PropTypes.string,
  }),
  signerEligibility: PropTypes.shape({
    amount: PropTypes.number,
    symbol: PropTypes.string,
    address: PropTypes.string,
  }),
  challengeEligibility: PropTypes.string.isRequired,
  challengePeriod: PropTypes.number.isRequired,
  settlementPeriod: PropTypes.number.isRequired,
})

export const AppItemsType = PropTypes.arrayOf(AppItemType)
