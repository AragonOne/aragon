import { useState, useMemo, useCallback, useEffect } from 'react'
import { useSelected } from '../../../hooks'

function useSelectIdentities(identities, filteredIdentities) {
  const [firstRender, setFirstRender] = useState(true)
  const initialSelected = useMemo(
    () => new Map(identities.map(({ address }) => [address, true])),
    [identities]
  )
  const { selected, setSelected } = useSelected(initialSelected)
  const [allSelected, someSelected] = useMemo(
    () => [
      filteredIdentities.every(({ address }) => selected.get(address)),
      filteredIdentities.some(({ address }) => selected.get(address)),
    ],
    [filteredIdentities, selected]
  )

  const handleToggleAll = useCallback(() => {
    const newSelected = new Map(
      identities.map(({ address }) => [
        address,
        filteredIdentities.find(item => item.address === address)
          ? !(allSelected || someSelected)
          : selected.get(address),
      ])
    )
    setSelected(newSelected)
  }, [
    identities,
    setSelected,
    someSelected,
    allSelected,
    filteredIdentities,
    selected,
  ])
  const handleToggleIdentity = useCallback(
    address => () =>
      setSelected(new Map([...selected, [address, !selected.get(address)]])),
    [selected, setSelected]
  )

  useEffect(() => {
    if (initialSelected.size && firstRender) {
      setFirstRender(false)
      setSelected(initialSelected)
    }
  }, [initialSelected, setSelected, firstRender])

  return {
    allSelected,
    handleToggleIdentity,
    handleToggleAll,
    identitiesSelected: selected,
    someSelected,
  }
}

export default useSelectIdentities
