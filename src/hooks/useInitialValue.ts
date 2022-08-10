import { useRef } from 'react'

const EMPTY_VALUE = Symbol('empty-value')

export const useInitialValue = <T = undefined>(value: T | (() => T)): T => {
  const resolveRef = useRef(() => {
    if (typeof value === 'function') {
      return (value as Function)() as T
    } else {
      return value
    }
  })
  const resultRef = useRef<any>(EMPTY_VALUE)
  if (resultRef.current === EMPTY_VALUE) {
    resultRef.current = resolveRef.current()
  }
  return resultRef.current
}

export default useInitialValue
