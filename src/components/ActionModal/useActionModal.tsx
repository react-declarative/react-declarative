import * as React from "react";
import { useState, useCallback } from "react";

import ActionModal, { IActionModalProps } from "./ActionModal";

import useActualCallback from "../../hooks/useActualCallback";

import TypedField from "../../model/TypedField";
import IAnything from "../../model/IAnything";
import IField from "../../model/IField";

interface IParams<Data extends IAnything = IAnything, Field = IField<Data>>
  extends Omit<
    IActionModalProps<Data, Field>,
    keyof {
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
  changeSubject,
  reloadSubject,
  payload,
  onChange,
  onSubmit = () => true,
  onLoadEnd,
  onLoadStart,
  onInvalid,
  submitLabel,
  throwError,
  dirty,
  title,
}: IParams<Data, Field>) => {
  const [open, setOpen] = useState(false);

  const onSubmit$ = useActualCallback(onSubmit);

  const handleSubmit = useCallback(async (data: Data | null) => {
    const result = await onSubmit$(data);
    setOpen(!result);
    return result;
  }, []);

  const render = useCallback(
    () => (
      <ActionModal
        open={open}
        apiRef={apiRef}
        changeSubject={changeSubject}
        reloadSubject={reloadSubject}
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
      changeSubject,
      reloadSubject,
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

  const pickData = useCallback(() => {
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
