import { useRef } from 'react'

export const useActualValue = <T = undefined>(value: T) => {
  const valueRef = useRef<T>(value)
  valueRef.current = value
  return valueRef
}

export default useActualValue
