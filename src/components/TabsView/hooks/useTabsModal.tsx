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
 * @param {Object} params - The configuration parameters for the modal.
 * @param {any} params.fallback - The fallback content to be displayed when the modal content is not available.
 * @param {string} [params.pathname="/"] - The pathname to be used for history navigation.
 * @param {object} [params.history] - The history object to be used for navigation. If not provided, a new memory history object will be created.
 * @param {boolean} [params.fullScreen=true] - Whether the modal should be displayed in full screen mode.
 * @param {Function} [params.onLoadEnd] - The function to be called when the modal content finishes loading.
 * @param {Function} [params.onLoadStart] - The function to be called when the modal content starts loading.
 * @param {boolean} [params.throwError] - Whether to throw an error if the onSubmit function returns false.
 * @param {Function} params.onChange - The function to be called when the value of the modal's content changes.
 * @param {Function} [params.onSubmit] - The function to be called when the modal is submitted. Returns a boolean indicating whether the submission was successful.
 * @param {Function} [params.onMount] - The function to be called when the modal is mounted.
 * @param {Function} [params.onUnmount] - The function to be called when the modal is unmounted.
 * @param {Function} [params.onClose] - The function to be called when the modal is closed.
 * @param {string} [params.submitLabel] - The label to be used for the submit button in the modal.
 * @param {string} [params.title] - The title of the modal.
 * @param {boolean} [params.hidden] - Whether the modal should be hidden initially.
 * @param {object} outletProps - Additional props to be passed to the TabsOutletModal component.
 *
 * @returns {object} - An object containing the following methods:
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

  const handleClose = useCallback(() => {
    openSubject.next(false);
    onClose && onClose();
  }, []);

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
