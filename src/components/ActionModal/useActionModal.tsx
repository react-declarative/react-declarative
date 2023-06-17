import * as React from "react";
import { useState, useCallback } from "react";

import ActionModal, { IActionModalProps } from "./ActionModal";

import useActualCallback from "../../hooks/useActualCallback";
import useActualValue from "../../hooks/useActualValue";

import TypedField from "../../model/TypedField";
import IAnything from "../../model/IAnything";
import IField from "../../model/IField";

interface IParams<
  Data extends IAnything = IAnything,
  Payload extends IAnything = IAnything,
  Field = IField<Data>,
  Param = void,
>
  extends Omit<
    IActionModalProps<Data, Payload, Field, Param>,
    keyof {
      open: never;
    }
  > {}

export const useActionModal = <
  Data extends IAnything = IAnything,
  Payload extends IAnything = IAnything,
  Field = IField<Data>,
  Param = void,
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
}: IParams<Data, Payload, Field, Param>) => {
  const [open, setOpen] = useState(false);
  const [param, setParam] = useState<Param>(null as never);

  const onSubmit$ = useActualCallback(onSubmit);
  const param$ = useActualValue(param);

  const handleSubmit = useCallback(async (data: Data | null) => {
    const result = await onSubmit$(data, param$.current);
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

  const pickData = useCallback((param?: Param) => {
    setParam(param as Param);
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
