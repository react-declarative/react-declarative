import { useRef } from 'react'

/**
 * Initializes a ref with the provided value and keeps it up to date.
 *
 * @template T - The type of the value.
 * @param {T} value - The initial value.
 * @returns {RefObject<T>} - A reference object that contains the provided value.
 */
export const useActualValue = <T = undefined>(value: T) => {
  const valueRef = useRef<T>(value)
  valueRef.current = value
  return valueRef
}

export default useActualValue
