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
import useBehaviorSubject from "../../hooks/useBehaviorSubject";

type Param = IRowData['id'][];

/**
 * Interface representing the parameters for a class.
 *
 * @template FilterData - Type for the filter data.
 * @template RowData - Type for the row data.
 * @template Payload - Type for the payload.
 * @template Field - Type for the field.
 */
interface IParams<
  FilterData extends {} = IAnything,
  RowData extends IRowData = IAnything,
  Payload extends IAnything = IAnything,
  Field extends IField = IField<FilterData, Payload>,
>
  extends Omit<
    ISearchModalProps<FilterData, RowData, Payload, Field>,
    keyof {
      openSubject: never;
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
 * @param params - The parameters for configuring the search modal.
 * @param params.param - The initial value for the parameter.
 * @param params.selectionMode - The selection mode for the search modal.
 * @param params.handler - The handler function for handling events.
 * @param params.fallback - The fallback function to be executed if an error occurs.
 * @param params.apiRef - The reference to the API.
 * @param params.reloadSubject - The subject for triggering reload events.
 * @param params.payload - The initial value for the payload.
 * @param params.onChange - The callback function for handling change events.
 * @param params.onAction - The callback function for handling action events.
 * @param params.onRowAction - The callback function for handling row action events.
 * @param params.onSubmit - The callback function for handling submit events.
 * @param params.onLoadEnd - The callback function to be executed when loading ends.
 * @param params.onLoadStart - The callback function to be executed when loading starts.
 * @param params.submitLabel - The label for the submit button.
 * @param params.throwError - Indicates whether to throw an error or not.
 * @param params.title - The title of the search modal.
 * @param params.hidden - Indicates whether the search modal should be hidden or not.
 * @param listProps - Additional properties for customizing the search modal.
 *
 * @returns An object with properties and methods for controlling the search modal.
 * @property open - Indicates whether the search modal is open or not.
 * @property render - A function for rendering the search modal.
 * @property pickData - A function for picking data.
 * @property close - A function for closing the search modal and handling submit with null data.
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
  submitIcon,
  throwError,
  title,
  hidden,
  ...listProps
}: IParams<FilterData, RowData, Payload, Field>) => {

  const payload = useSingleton(upperPayload);

  const openSubject = useBehaviorSubject<boolean>();

  const [param, setParam] = useState<Param>(upperParam || []);

  useEffect(() => {
    setParam(upperParam as never);
  }, [upperParam]);

  const onSubmit$ = useActualCallback(onSubmit);
  const param$ = useActualValue(param);

  /**
   * Handles submit event.
   *
   * @param data - The data to submit.
   * @returns A promise that resolves to a boolean indicating if the submit was successful or not.
   */
  const handleSubmit = useCallback(async (data: IRowData['id'][] | null) => {
    const result = await onSubmit$(data?.length ? data : null, payload, param$.current);
    openSubject.next(!result);
    return result;
  }, []);

  /**
   * A memoized function that returns a rendered SearchModal component with specified props.
   *
   * @callback render
   * @returns The rendered SearchModal component.
   *
   * @param open - Indicator to show/hide the SearchModal.
   * @param hidden - Indicator to hide/show the SearchModal.
   * @param data - The data to be passed to the SearchModal component.
   * @param title - The title of the SearchModal.
   * @param apiRef - The reference object for API methods.
   * @param reloadSubject - The subject for reloading data.
   * @param selectionMode - The mode for selecting data in the SearchModal.
   * @param handler - The custom handler function for data selection.
   * @param payload - Additional data payload to be passed to the handler function.
   * @param fallback - The fallback component to show if there is no data.
   * @param onChange - The function to be called when the input value changes.
   * @param onLoadEnd - The function to be called when data loading ends.
   * @param onLoadStart - The function to be called when data loading starts.
   * @param onAction - The function to be called when an action is triggered.
   * @param onRowAction - The function to be called when an action is triggered on a row.
   * @param submitLabel - The label for the submit button in the SearchModal.
   * @param throwError - Indicator to throw an error on submit.
   * @param handleSubmit - The function to be called when the search form is submitted.
   * @param listProps - Additional props to be passed to the SearchModal component.
   */
  const render = useCallback(
    () => (
      <SearchModal
        openSubject={openSubject}
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
        submitIcon={submitIcon}
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

  /**
   * A callback function to pick data.
   *
   * @param [param=[]] - The parameter to pass to the callback function.
   * @returns
   */
  const pickData = useCallback((param: Param = []) => {
    setParam(param);
    openSubject.next(true);
  }, []);

  return {
    open,
    render,
    pickData,
    close: () => handleSubmit(null),
  } as const;
};

/**
 * Hook for using a search modal with strong typed parameters.
 *
 * @template FilterData - The type of the filter data.
 * @template RowData - The type of the row data.
 * @template Payload - The type of the payload.
 * @template Field - The type of the field.
 *
 * @param params - The parameters for the search modal.
 *
 * @returns
 */
export const useSearchModalTyped = <
  FilterData extends {} = IAnything,
  RowData extends IRowData = IAnything,
  Payload extends IAnything = IAnything,
  Field extends IField = TypedField<FilterData, Payload>
>(params: IParams<FilterData, RowData, Payload, Field>) =>
  useSearchModal(params);

export default useSearchModal;
