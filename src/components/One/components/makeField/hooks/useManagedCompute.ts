import { useCallback, useMemo, useRef } from "react";

import IAnything from "../../../../../model/IAnything";
import IField from "../../../../../model/IField";

import singleshot from "../../../../../utils/hof/singleshot";

/**
 * Represents the parameters required for a computation.
 * @interface
 */
interface IParams {
  compute: IField["compute"];
  shouldRecompute: IField["shouldRecompute"];
  object: IAnything;
  payload: IAnything;
}

/**
 * Manages the compute function for a field.
 *
 * @param params - The parameters.
 * @param params.compute - The compute function.
 * @param [params.shouldRecompute=() => true] - The function to determine if recomputation is needed.
 * @param params.object - The object to compute the field from.
 * @param params.payload - The payload to pass to the compute function.
 * @returns - The computed field value.
 */
export const useManagedCompute = ({
  compute,
  shouldRecompute = () => true,
  object,
  payload,
}: IParams): IField["compute"] => {
  const prevObject = useRef<any>(null);
  const initial = useRef(true);

  const managedCompute = useMemo(() => {
    if (compute) {
      return singleshot(compute);
    }
    return undefined;
  }, []);

  const tickRecompute = useCallback(() => {
    if (!compute) {
      return;
    }
    if (!initial.current) {
      if (!shouldRecompute(prevObject.current, object, payload)) {
        return;
      }
    }
    prevObject.current = object;
    initial.current = false;
    managedCompute?.clear();
  }, [object, payload]);

  tickRecompute();

  return managedCompute;
};

export default useManagedCompute;
