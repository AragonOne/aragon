import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { Accordion, GU, Info, textStyle, useTheme } from '@aragon/ui'
import Header from '../../onboarding2/Header/Header'
import PrevNextFooter from './PrevNextFooter'

function Review({
  back,
  data,
  next,
  items,
  screenTitle = 'Review information',
  screenSubtitle = 'Have one last look at your settings below',
}) {
  const theme = useTheme()

  const handleNext = useCallback(() => {
    next(data)
  }, [data, next])

  return (
    <React.Fragment>
      <Header title={screenTitle} subtitle={screenSubtitle} />

      <Accordion
        items={items.map(item => [
          item.label,
          <div
            css={`
              padding: ${7 * GU}px;
            `}
          >
            {item.fields.map(([label, content]) => (
              <section
                key={label}
                css={`
                  & + & {
                    margin-top: ${3 * GU}px;
                  }
                `}
              >
                <h1
                  css={`
                    margin-bottom: ${1 * GU}px;
                    ${textStyle('label2')}
                    color: ${theme.contentSecondary};
                  `}
                >
                  {label}
                </h1>
                <div
                  css={`
                    ${textStyle('body1')};
                  `}
                >
                  {content}
                </div>
              </section>
            ))}
          </div>,
        ])}
      />

      <Info
        css={`
          margin: ${3 * GU}px 0;
        `}
      >
        Carefully review your configuration settings. If something doesn’t look
        right, you can always go back and change it before launching your
        organization.
      </Info>

      <PrevNextFooter
        backEnabled
        nextEnabled
        nextLabel="Launch your organization"
        onBack={back}
        onNext={handleNext}
      />
    </React.Fragment>
  )
}

Review.propTypes = {
  back: PropTypes.func.isRequired,
  next: PropTypes.func.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      fields: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.node)).isRequired,
    })
  ).isRequired,
}

export default Review
