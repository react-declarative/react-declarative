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

  /**
   * A memoized value that holds the result of a computation.
   *
   * The `managedCompute` variable is assigned the value returned by the `useMemo` hook,
   * which caches the result of the computation function and returns it on subsequent renders.
   *
   * If the `compute` function is truthy, the computation is performed using the `singleshot` function,
   * and the result is stored in the `managedCompute` variable.
   * If the `compute` function is falsy, the `managedCompute` variable is assigned `undefined`.
   *
   */
  const managedCompute = useMemo(() => {
    if (compute) {
      return singleshot(compute);
    }
    return undefined;
  }, []);

  /**
   * Recomputes the compute function when the provided dependencies change.
   *
   * @callback tickRecompute
   * @param compute - The compute function to be recomputed.
   * @param initial - Indicates if it is the initial computation or not.
   * @param prevObject - The previous object state.
   * @param object - The current object state.
   * @param payload - The payload object to be used in the recomputation.
   * @param managedCompute - The managed compute object.
   * @returns
   */
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
