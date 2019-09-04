import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Button,
  Field,
  GU,
  IconPlus,
  IconTrash,
  Info,
  TextInput,
  useTheme,
} from '@aragon/ui'
import { Header, PercentageField, PrevNextFooter } from '.'

function Tokens({ back, data, fields, next, screenIndex, screens }) {
  const theme = useTheme()

  const [tokenName, setTokenName] = useState(data.tokenName || '')
  const [tokenSymbol, setTokenSymbol] = useState(data.tokenSymbol || '')
  const [members, setMembers] = useState(data.members || [''])

  const handleTokenNameChange = useCallback(event => {
    setTokenName(event.target.value)
  }, [])

  const handleTokenSymbol = useCallback(event => {
    setTokenSymbol(event.target.value)
  }, [])

  const addMember = useCallback(() => {
    setMembers(members => [...members, ''])
  }, [])

  const removeMember = useCallback(index => {
    setMembers(members =>
      members.length < 2 ? members : members.filter((_, i) => i !== index)
    )
  }, [])

  const updateMember = useCallback((index, updatedAccount) => {
    setMembers(members =>
      members.map((account, i) => (i === index ? updatedAccount : account))
    )
  }, [])

  const handleNext = useCallback(() => {
    next({
      ...data,
      tokenName,
      tokenSymbol,
      members,
    })
  }, [data, next, tokenName, tokenSymbol, members])

  return (
    <div
      css={`
        display: grid;
        align-items: center;
        justify-content: center;
      `}
    >
      <div
        css={`
          max-width: ${82 * GU}px;
        `}
      >
        <Header
          title="Configure template"
          subtitle="Choose your Tokens settings below."
        />

        <div
          css={`
            display: grid;
            grid-template-columns: auto ${12 * GU}px;
            grid-column-gap: ${1.5 * GU}px;
          `}
        >
          <Field label="Token name">
            <TextInput value="Bitcoin" wide />
          </Field>

          <Field label="Token symbol">
            <TextInput value="BTC" wide />
          </Field>

          <Field label="Members">
            <div>
              {members.map((account, i) => (
                <div
                  css={`
                    margin-bottom: ${1.5 * GU}px;
                  `}
                >
                  <TextInput
                    key={i}
                    value={account}
                    adornment={
                      <Button
                        onClick={() => removeMember(i)}
                        icon={
                          <IconTrash
                            css={`
                              color: ${theme.negative};
                            `}
                          />
                        }
                        size="mini"
                      />
                    }
                    adornmentPosition="end"
                    adornmentSettings={{ width: 52, padding: 8 }}
                    onChange={event => updateMember(i, event.target.value)}
                    value={account}
                    wide
                  />
                </div>
              ))}
            </div>
            <Button
              icon={
                <IconPlus
                  css={`
                    color: ${theme.accent};
                  `}
                />
              }
              label="Add more"
              onClick={addMember}
            />
          </Field>
        </div>

        <Info
          css={`
            margin-bottom: ${3 * GU}px;
          `}
        >
          These settings will define your organization’s finances, for example,
          the duration of a budget or how often a recurrent payment should be
          executed.
        </Info>

        <PrevNextFooter
          backEnabled
          nextEnabled
          nextLabel={`Next: ${screens[screenIndex + 1][0]}`}
          onBack={back}
          onNext={handleNext}
        />
      </div>
    </div>
  )
}

export default Tokens
