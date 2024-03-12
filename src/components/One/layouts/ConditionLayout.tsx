import * as React from "react";
import { useMemo, useCallback } from "react";

import If from "../../If";

import { useOnePayload } from "../context/PayloadProvider";

import IField from "../../../model/IField";
import IEntity from "../../../model/IEntity";
import IAnything from "../../../model/IAnything";
import {
  IWrappedLayout,
  PickProp,
} from "../../../model/IManaged";

import makeLayout from "../components/makeLayout/makeLayout";

import cached from "../../../utils/hof/cached";

export interface IConditionLayoutProps<Data = IAnything, Payload = IAnything>
  extends IWrappedLayout<Data, Payload> {
  condition?: PickProp<IField<Data, Payload>, "condition">;
  shouldCondition?: PickProp<IField<Data, Payload>, "shouldCondition">;
  conditionLoading?: PickProp<IField<Data, Payload>, "conditionLoading">;
  conditionElse?: PickProp<IField<Data, Payload>, "conditionElse">;
}

interface IConditionLayoutPrivate<Data = IAnything> extends IEntity<Data> {
  children?: React.ReactNode;
  fallback: PickProp<IEntity<Data>, "fallback">;
  ready: PickProp<IEntity<Data>, "ready">;
  object: PickProp<IEntity<Data>, "object">;
}

/**
 * Represents a layout component that conditionally renders its children based on given conditions.
 *
 * @template Data The type of data passed to the layout.
 * @param props - The props object containing the following properties:
 * @param props.children - The children elements to be rendered inside the layout.
 * @param [props.condition=() => true] - The condition function that determines when the children should be rendered.
 * @param [props.shouldCondition=() => false] - The function to determine if the condition should be re-evaluated.
 * @param [props.conditionLoading] - The component to be rendered while condition is evaluating/loading.
 * @param [props.conditionElse] - The component to be rendered if condition evaluates to false.
 * @param [props.fallback=(e: Error) => { throw e; }] - The function to handle errors during condition evaluation.
 * @param [props.object] - The data object to be passed to the condition and children components.
 * @returns The rendered layout component.
 */
export const ConditionLayout = <Data extends IAnything = IAnything>({
  children,
  condition = () => true,
  shouldCondition = () => false,
  conditionLoading: ConditionLoading,
  conditionElse: ConditionElse,
  fallback = (e: Error) => {
    throw e;
  },
  object,
}: IConditionLayoutProps<Data> & IConditionLayoutPrivate<Data>) => {
  const payload = useOnePayload();

  const handler = useMemo(() => cached((prevArgs, currentArgs) =>
    shouldCondition(prevArgs[0], currentArgs[0], payload), condition), []);

  const handleCondition = useCallback(async (data: Data) => {
    return await handler(data, payload);
  }, []);

  return (
    <If 
      condition={handleCondition}
      Loading={ConditionLoading && <ConditionLoading data={object} payload={payload} />}
      Else={ConditionElse && <ConditionElse data={object} payload={payload} />}
      fallback={fallback}
      payload={object}
    >
      {children}
    </If>
  );
};

ConditionLayout.displayName = "ConditionLayout";

export default makeLayout(ConditionLayout) as typeof ConditionLayout;
