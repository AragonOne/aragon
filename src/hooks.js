import { useCallback, useEffect, useReducer, useState } from 'react'
import keycodes from './keycodes'
import { log, removeStartingSlash } from './utils'

// Update `now` at a given interval.
export function useNow(updateEvery = 1000) {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date())
    }, updateEvery)
    return () => {
      clearInterval(timer)
    }
  }, [updateEvery])
  return now
}

// Handle arrow keys.
export function useArrows({ onUp, onLeft, onDown, onRight } = {}) {
  useEffect(() => {
    const actions = [
      [keycodes.up, onUp],
      [keycodes.left, onLeft],
      [keycodes.down, onDown],
      [keycodes.right, onRight],
    ]
    const onKeyDown = e => {
      for (const [keyCode, cb] of actions) {
        if (cb && e.keyCode === keyCode) {
          e.preventDefault()
          cb()
          break
        }
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [onUp, onLeft, onDown, onRight])
}

function stepsReducer(state, { type, value, steps }) {
  const { step } = state

  let newStep = null

  if (type === 'set') {
    newStep = value
  }
  if (type === 'next' && step < steps - 1) {
    newStep = step + 1
  }
  if (type === 'prev' && step > 0) {
    newStep = step - 1
  }

  if (newStep !== null && step !== newStep) {
    return {
      step: newStep,
      direction: newStep > step ? 1 : -1,
    }
  }

  return state
}

// Simple hook to manage a given number of steps.
export function useSteps(steps) {
  const [{ step, direction }, updateStep] = useReducer(stepsReducer, {
    step: 0,
    direction: 0,
  })

  // If the number of steps change, we reset the current step
  useEffect(() => {
    updateStep({ type: 'set', value: 0, steps })
  }, [steps])

  const setStep = useCallback(
    value => {
      updateStep({ type: 'set', value, steps })
    },
    [steps]
  )

  const next = useCallback(() => {
    updateStep({ type: 'next', steps })
  }, [steps])

  const prev = useCallback(() => {
    updateStep({ type: 'prev', steps })
  }, [steps])

  return {
    direction,
    next,
    prev,
    setStep,
    step,
  }
}

export function usePromise(fn, memoParams, defaultValue) {
  const [result, setResult] = useState(defaultValue)
  useEffect(() => {
    let cancelled = false
    fn()
      .then(value => {
        if (!cancelled) {
          setResult(value)
        }
        return null
      })
      .catch(e => console.error('An error occured: ', e))
    return () => {
      cancelled = true
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...memoParams, fn])
  return result
}

export function useRepoDetails(baseUrl, detailsUrl) {
  const fetchDescription = async () => {
    try {
      const raw = await fetch(`${baseUrl}${removeStartingSlash(detailsUrl)}`)
      return raw.text()
    } catch (e) {
      log('Error fetching decription: ', e)
    }
    return ''
  }
  return usePromise(fetchDescription, [detailsUrl], null)
}
