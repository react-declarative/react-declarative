import { useCallback, useMemo, useRef } from "react";

import IAnything from "../../../../model/IAnything";
import IField from "../../../../model/IField";

import singleshot from "../../../../utils/hof/singleshot";

interface IParams {
  compute: IField["compute"];
  shouldRecompute: IField["shouldRecompute"];
  object: IAnything;
  payload: IAnything;
}

export const useManagedCompute = ({
  compute,
  shouldRecompute = () => true,
  object,
  payload,
}: IParams): IField["compute"] => {
  const prevObject = useRef<any>(null);

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
    if (!shouldRecompute(prevObject.current, object, payload)) {
      return;
    }
    prevObject.current = object;
    managedCompute?.clear();
  }, [object, payload]);

  tickRecompute();

  return managedCompute;
};

export default useManagedCompute;
