import * as React from "react";
import { useState, useRef, useCallback } from "react";

import ActionModal, { IActionModalProps } from "./ActionModal";

import IAnything from "../../model/IAnything";
import IField from "../../model/IField";
import TypedField from "../../model/TypedField";

type Fn<Data = IAnything> = IActionModalProps<Data>["onSubmit"];

interface IParams<Data extends IAnything = IAnything, Field = IField<Data>>
  extends Omit<
    IActionModalProps<Data, Field>,
    keyof {
      onSubmit: never;
      open: never;
    }
  > {}

export const useActionModal = <
  Data extends IAnything = IAnything,
  Field = IField<Data>
>({
  fields,
  handler,
  fallback,
  apiRef,
  payload,
  onChange,
  onLoadEnd,
  onLoadStart,
  onInvalid,
  submitLabel,
  throwError,
  dirty,
  title,
}: IParams<Data, Field>) => {
  const [open, setOpen] = useState(false);
  const changeRef = useRef<Fn<Data>>(null as never);

  const handleSubmit = useCallback(async (data: Data | null) => {
    const { current } = changeRef;
    if (current) {
      const result = await current(data);
      setOpen(!result);
      return result;
    } else {
      return false;
    }
  }, []);

  const render = useCallback(
    () => (
      <ActionModal
        open={open}
        apiRef={apiRef}
        fields={fields}
        handler={handler}
        payload={payload}
        fallback={fallback}
        onChange={onChange}
        onInvalid={onInvalid}
        onLoadEnd={onLoadEnd}
        onLoadStart={onLoadStart}
        submitLabel={submitLabel}
        throwError={throwError}
        onSubmit={handleSubmit}
        title={title}
        dirty={dirty}
      />
    ),
    [
      open,
      dirty,
      fields,
      apiRef,
      handler,
      payload,
      fallback,
      onChange,
      onInvalid,
      onLoadEnd,
      onLoadStart,
      handleSubmit,
      submitLabel,
      throwError,
      title,
    ]
  );

  const pickData = useCallback((onSubmit: Fn<Data>) => {
    changeRef.current = onSubmit;
    setOpen(true);
  }, []);

  return {
    render,
    pickData,
  };
};

export const useActionModalTyped = <Data extends IAnything = IAnything>(params: IParams<Data, TypedField<Data>>) =>
  useActionModal(params);

export default useActionModal;
