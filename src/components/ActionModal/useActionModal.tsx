import * as React from "react";
import { useState, useCallback, useEffect } from "react";

import ActionModal, { IActionModalProps } from "./ActionModal";

import useActualCallback from "../../hooks/useActualCallback";
import useActualValue from "../../hooks/useActualValue";
import useSingleton from "../../hooks/useSingleton";
import useChange from "../../hooks/useChange";

import TypedField from "../../model/TypedField";
import IAnything from "../../model/IAnything";
import IField from "../../model/IField";

export interface IParams<
  Data extends IAnything = IAnything,
  Payload extends IAnything = IAnything,
  Field = IField<Data>,
  Param = any,
>
  extends Omit<
    IActionModalProps<Data, Payload, Field, Param>,
    keyof {
      open: never;
    }
  > {
    waitForChangesDelay?: number;
    param?: Param;
    onClose?: () => void;
  }

export const useActionModal = <
  Data extends IAnything = IAnything,
  Payload extends IAnything = IAnything,
  Field = IField<Data>,
  Param = any,
>({
  hidden,
  fields,
  waitForChangesDelay,
  param: upperParam,
  features,
  handler,
  fallback,
  apiRef,
  changeSubject,
  reloadSubject,
  withActionButton = true,
  withStaticAction,
  payload: upperPayload = {} as Payload,
  BeforeTitle,
  onChange,
  onClose,
  onSubmit = () => true,
  onLoadEnd,
  onLoadStart,
  onInvalid,
  AfterTitle,
  outlinePaper,
  submitLabel,
  throwError,
  dirty,
  readonly,
  fullScreen,
  sizeRequest,
  title,
}: IParams<Data, Payload, Field, Param>) => {

  const payload = useSingleton(upperPayload);

  const [open, setOpen] = useState(false);
  const [param, setParam] = useState<Param>(upperParam as never);

  useEffect(() => {
    setParam(upperParam as never);
  }, [upperParam]);

  useChange(() => {
    if (!open) {
      onClose && onClose();
    }
  }, [open]);

  const onSubmit$ = useActualCallback(onSubmit);
  const param$ = useActualValue(param);

  const handleSubmit = useCallback(async (data: Data | null) => {
    const result = await onSubmit$(data, payload, param$.current);
    setOpen(!result);
    return result;
  }, []);

  const render = useCallback(
    () => (
      <ActionModal
        AfterTitle={AfterTitle}
        open={open}
        hidden={hidden}
        withActionButton={withActionButton}
        withStaticAction={withStaticAction}
        waitForChangesDelay={waitForChangesDelay}
        readonly={readonly}
        fullScreen={fullScreen}
        apiRef={apiRef}
        changeSubject={changeSubject}
        reloadSubject={reloadSubject}
        outlinePaper={outlinePaper}
        sizeRequest={sizeRequest}
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
        features={features}
        title={title}
        dirty={dirty}
        param={param}
        BeforeTitle={BeforeTitle}
      />
    ),
    [
      open,
      hidden,
      readonly,
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
    open,
    render,
    pickData,
  };
};

export const useActionModalTyped = <Data extends IAnything = IAnything>(params: IParams<Data, TypedField<Data>>) =>
  useActionModal(params);

export default useActionModal;
