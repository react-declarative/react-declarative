import { useMemo } from "react";

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
}

const DEFAULT_SHOULD_RECOMPUTE = () => true;

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
  shouldRecompute = DEFAULT_SHOULD_RECOMPUTE,
}: IParams) => useMemo((): IField['compute'] => {
  let prevObject: IAnything = null;
  if (!compute) {
    return undefined;
  }
  const computeFn = singleshot(compute);
  return (object, payload) => {
    if (prevObject && shouldRecompute(prevObject, object, payload)) {
      computeFn.clear();
    }
    prevObject = object;
    return computeFn(object, payload);
  }
}, []);

export default useManagedCompute;
