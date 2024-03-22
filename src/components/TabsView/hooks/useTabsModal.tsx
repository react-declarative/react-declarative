import * as React from "react";
import { useCallback } from "react";
import { createMemoryHistory } from "history";

import TabsOutletModal, {
  ITabsModalProps,
} from "../components/TabsOutletModal";

import useBehaviorSubject from "../../../hooks/useBehaviorSubject";
import useActualCallback from "../../../hooks/useActualCallback";
import useSingleton from "../../../hooks/useSingleton";

import IAnything from "../../../model/IAnything";
import History from "../../../model/History";

/**
 * Interface representing the parameter options for a class or function.
 * @template Data The type of data to be submitted.
 * @template Payload The type of payload to be submitted.
 */
interface IParams<Data extends {} = Record<string, any>, Payload = IAnything>
  extends Omit<
    ITabsModalProps<Data, Payload>,
    keyof {
      openSubject: never;
      history: never;
      onSubmit: never;
      className: never;
    }
  > {
  onSubmit?: (
    data: Data | null,
    payload: Payload
  ) => Promise<boolean> | boolean;
  fullScreen?: boolean;
  history?: History;
  pathname?: string;
}

/**
 * Provides a modal component for displaying tabs with content and handling user interactions.
 *
 * @template Data - The type of data to be submitted to the modal.
 * @template Payload - The type of payload to be passed to the onSubmit function.
 *
 * @param params - The configuration parameters for the modal.
 * @param params.fallback - The fallback content to be displayed when the modal content is not available.
 * @param [params.pathname="/"] - The pathname to be used for history navigation.
 * @param [params.history] - The history object to be used for navigation. If not provided, a new memory history object will be created.
 * @param [params.fullScreen=true] - Whether the modal should be displayed in full screen mode.
 * @param [params.onLoadEnd] - The function to be called when the modal content finishes loading.
 * @param [params.onLoadStart] - The function to be called when the modal content starts loading.
 * @param [params.throwError] - Whether to throw an error if the onSubmit function returns false.
 * @param params.onChange - The function to be called when the value of the modal's content changes.
 * @param [params.onSubmit] - The function to be called when the modal is submitted. Returns a boolean indicating whether the submission was successful.
 * @param [params.onMount] - The function to be called when the modal is mounted.
 * @param [params.onUnmount] - The function to be called when the modal is unmounted.
 * @param [params.onClose] - The function to be called when the modal is closed.
 * @param [params.submitLabel] - The label to be used for the submit button in the modal.
 * @param [params.title] - The title of the modal.
 * @param [params.hidden] - Whether the modal should be hidden initially.
 * @param outletProps - Additional props to be passed to the TabsOutletModal component.
 *
 * @returns - An object containing the following methods:
 *    - open: A behavior subject representing the open state of the modal.
 *    - render: A function that renders the modal component.
 *    - pickData: A function that triggers the opening of the modal.
 *    - close: A function that closes the modal.
 */
export const useTabsModal = <
  Data extends {} = Record<string, any>,
  Payload = IAnything
>({
  fallback,
  pathname = "/",
  history: upperHistory,
  fullScreen = true,
  onLoadEnd,
  onLoadStart,
  throwError,
  onChange,
  onSubmit = () => true,
  onMount,
  onUnmount,
  onClose,
  submitLabel,
  title,
  hidden,
  ...outletProps
}: IParams<Data, Payload>) => {

  const openSubject = useBehaviorSubject<boolean>();

  const history = useSingleton(() => upperHistory || createMemoryHistory());

  const onSubmit$ = useActualCallback(onSubmit);

  /**
   * Handles submit action.
   *
   * @param {Data | null} data - The data to submit.
   * @param {Payload} payload - The payload to submit.
   * @returns {Promise<boolean>} - A promise that resolves to a boolean indicating success.
   */
  const handleSubmit = useCallback(
    async (data: Data | null, payload: Payload) => {
      const result = await onSubmit$(data, payload);
      if (result) {
        openSubject.next(false);
      }
      return result;
    },
    []
  );

  /**
   * A callback function used to handle closing.
   *
   * @function
   * @name handleClose
   *
   * @returns {void}
   */
  const handleClose = useCallback(() => {
    openSubject.next(false);
    onClose && onClose();
  }, []);

  /**
   * Renders a TabsOutletModal component.
   *
   * @returns {Component} The rendered TabsOutletModal component.
   */
  const render = useCallback(
    () => (
      <TabsOutletModal
        openSubject={openSubject}
        fullScreen={fullScreen}
        history={history}
        hidden={hidden}
        title={title}
        fallback={fallback}
        onChange={onChange}
        onLoadEnd={onLoadEnd}
        onMount={onMount}
        onClose={handleClose}
        onUnmount={onUnmount}
        onLoadStart={onLoadStart}
        submitLabel={submitLabel}
        throwError={throwError}
        onSubmit={handleSubmit}
        {...outletProps}
      />
    ),
    [
      hidden,
      fallback,
      onChange,
      onLoadEnd,
      onLoadStart,
      handleSubmit,
      submitLabel,
      throwError,
      title,
    ]
  );

  /**
   * The pickData function is a callback function that opens the subject when called.
   * It is used to notify the observers about a change in the subject.
   *
   * @callback pickData
   * @return {void}
   */
  const pickData = useCallback(() => {
    openSubject.next(true);
  }, []);

  return {
    open,
    render,
    pickData,
    close: handleSubmit(null, {} as Payload),
  } as const;
};

export default useTabsModal;
