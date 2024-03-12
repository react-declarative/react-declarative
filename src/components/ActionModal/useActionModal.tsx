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

/**
 * Creates a hook for managing an action modal.
 * @template Data - The type of data being submitted.
 * @template Payload - The type of payload data.
 * @template Field - The type of field data.
 * @template Param - The type of param data.
 * @param params - The parameters for configuring the action modal.
 * @param params.hidden - Indicates whether the action modal is hidden.
 * @param params.fields - The fields for the action modal.
 * @param params.waitForChangesDelay - The delay for waiting on changes.
 * @param params.param - The initial value for the param.
 * @param params.features - The features for the action modal.
 * @param params.handler - The handler function for the action modal.
 * @param params.fallback - The fallback element for the action modal.
 * @param params.apiRef - The reference to the API for the action modal.
 * @param params.changeSubject - The subject for change events.
 * @param params.reloadSubject - The subject for reload events.
 * @param params.withActionButton - Indicates whether to include an action button.
 * @param params.withStaticAction - Indicates whether to include a static action.
 * @param params.payload - The payload data for the action modal.
 * @param params.BeforeTitle - The element to render before the title.
 * @param params.onChange - The onChange event handler for the action modal.
 * @param params.onClose - The onClose event handler for the action modal.
 * @param params.onSubmit - The onSubmit event handler for the action modal.
 * @param params.onLoadEnd - The onLoadEnd event handler for the action modal.
 * @param params.onLoadStart - The onLoadStart event handler for the action modal.
 * @param params.onInvalid - The onInvalid event handler for the action modal.
 * @param params.AfterTitle - The element to render after the title.
 * @param params.outlinePaper - Indicates whether the paper has an outline.
 * @param params.transparentPaper - Indicates whether the paper is transparent.
 * @param params.submitLabel - The label for the submit button.
 * @param params.throwError - Indicates whether to throw an error on submit.
 * @param params.dirty - Indicates whether the form is dirty.
 * @param params.readonly - Indicates whether the form is readonly.
 * @param params.fullScreen - Indicates whether the action modal is fullscreen.
 * @param params.sizeRequest - The size request for the action modal.
 * @param params.title - The title for the action modal.
 * @returns - The state and render functions.
 * @property {boolean} open - Indicates whether the action modal is open or closed.
 * @property {Function} render - The render function for the action modal.
 * @property {Function} pickData - The function for selecting data.
 */
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
  transparentPaper,
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
        transparentPaper={transparentPaper}
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
