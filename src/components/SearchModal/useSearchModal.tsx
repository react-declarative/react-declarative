import * as React from "react";
import { useState, useCallback, useEffect } from "react";

import SearchModal, { ISearchModalProps } from "./SearchModal";

import useActualCallback from "../../hooks/useActualCallback";
import useActualValue from "../../hooks/useActualValue";
import useSingleton from "../../hooks/useSingleton";

import TypedField from "../../model/TypedField";
import IAnything from "../../model/IAnything";
import IField from "../../model/IField";
import IRowData from "../../model/IRowData";

type Param = IRowData['id'][];

interface IParams<
  FilterData extends {} = IAnything,
  RowData extends IRowData = IAnything,
  Payload extends IAnything = IAnything,
  Field extends IField = IField<FilterData, Payload>,
>
  extends Omit<
    ISearchModalProps<FilterData, RowData, Payload, Field>,
    keyof {
      open: never;
      onSubmit: never;
      className: never;
      isChooser: never;
      style: never;
    }
  > {
    param?: Param;
    onSubmit?: (data: IRowData['id'][] | null, payload: Payload, param: Param) => Promise<boolean> | boolean;
  }

/**
 * The useSearchModal function is a custom hook that provides functionality for displaying a search modal.
 * It accepts various parameters and returns an object with properties and methods for controlling the search modal.
 *
 * @template FilterData - The type of the filter data.
 * @template RowData - The type of the row data.
 * @template Payload - The type of the payload.
 * @template Field - The type of the field.
 *
 * @param {Object} params - The parameters for configuring the search modal.
 * @param {FilterData} params.param - The initial value for the parameter.
 * @param {string} params.selectionMode - The selection mode for the search modal.
 * @param {Function} params.handler - The handler function for handling events.
 * @param {Function} params.fallback - The fallback function to be executed if an error occurs.
 * @param {*} params.apiRef - The reference to the API.
 * @param {*} params.reloadSubject - The subject for triggering reload events.
 * @param {Payload} params.payload - The initial value for the payload.
 * @param {Function} params.onChange - The callback function for handling change events.
 * @param {Function} params.onAction - The callback function for handling action events.
 * @param {Function} params.onRowAction - The callback function for handling row action events.
 * @param {Function} params.onSubmit - The callback function for handling submit events.
 * @param {Function} params.onLoadEnd - The callback function to be executed when loading ends.
 * @param {Function} params.onLoadStart - The callback function to be executed when loading starts.
 * @param {string} params.submitLabel - The label for the submit button.
 * @param {boolean} params.throwError - Indicates whether to throw an error or not.
 * @param {string} params.title - The title of the search modal.
 * @param {boolean} params.hidden - Indicates whether the search modal should be hidden or not.
 * @param {Object} listProps - Additional properties for customizing the search modal.
 *
 * @returns {Object} An object with properties and methods for controlling the search modal.
 * @property {boolean} open - Indicates whether the search modal is open or not.
 * @property {Function} render - A function for rendering the search modal.
 * @property {Function} pickData - A function for picking data.
 * @property {Function} close - A function for closing the search modal and handling submit with null data.
 */
export const useSearchModal = <
  FilterData extends {} = IAnything,
  RowData extends IRowData = IAnything,
  Payload extends IAnything = IAnything,
  Field extends IField = IField<FilterData, Payload>,
>({
  param: upperParam,
  selectionMode,
  handler,
  fallback,
  apiRef,
  reloadSubject,
  payload: upperPayload = {} as Payload,
  onChange,
  onAction,
  onRowAction,
  onSubmit = () => true,
  onLoadEnd,
  onLoadStart,
  submitLabel,
  throwError,
  title,
  hidden,
  ...listProps
}: IParams<FilterData, RowData, Payload, Field>) => {

  const payload = useSingleton(upperPayload);

  const [open, setOpen] = useState(false);
  const [param, setParam] = useState<Param>(upperParam || []);

  useEffect(() => {
    setParam(upperParam as never);
  }, [upperParam]);

  const onSubmit$ = useActualCallback(onSubmit);
  const param$ = useActualValue(param);

  const handleSubmit = useCallback(async (data: IRowData['id'][] | null) => {
    const result = await onSubmit$(data?.length ? data : null, payload, param$.current);
    setOpen(!result);
    return result;
  }, []);

  const render = useCallback(
    () => (
      <SearchModal
        open={open}
        hidden={hidden}
        data={param}
        title={title}
        apiRef={apiRef}
        reloadSubject={reloadSubject}
        selectionMode={selectionMode}
        handler={handler}
        payload={payload}
        fallback={fallback}
        onChange={onChange}
        onLoadEnd={onLoadEnd}
        onLoadStart={onLoadStart}
        onAction={onAction}
        onRowAction={onRowAction}
        submitLabel={submitLabel}
        throwError={throwError}
        onSubmit={handleSubmit}
        {...listProps}
      />
    ),
    [
      open,
      hidden,
      apiRef,
      reloadSubject,
      handler,
      payload,
      fallback,
      onChange,
      onLoadEnd,
      onLoadStart,
      handleSubmit,
      submitLabel,
      throwError,
      title,
      param,
    ]
  );

  const pickData = useCallback((param: Param = []) => {
    setParam(param);
    setOpen(true);
  }, []);

  return {
    open,
    render,
    pickData,
    close: () => handleSubmit(null),
  } as const;
};

export const useSearchModalTyped = <
  FilterData extends {} = IAnything,
  RowData extends IRowData = IAnything,
  Payload extends IAnything = IAnything,
  Field extends IField = TypedField<FilterData, Payload>
>(params: IParams<FilterData, RowData, Payload, Field>) =>
  useSearchModal(params);

export default useSearchModal;
