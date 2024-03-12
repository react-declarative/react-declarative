import * as React from "react";
import { useEffect, useCallback } from "react";
import { createMemoryHistory } from "history";

import OutletModal, { IOutletModalProps } from "../components/OutletModal";

import useBehaviorSubject from "../../../hooks/useBehaviorSubject";
import useActualCallback from "../../../hooks/useActualCallback";
import useSingleton from "../../../hooks/useSingleton";
import useSubject from "../../../hooks/useSubject";

import IAnything from "../../../model/IAnything";
import History from "../../../model/History";
import Id from "../model/Id";
import TSubject from "../../../model/TSubject";

interface IParams<
  Data extends {} = Record<string, any>,
  Payload = IAnything,
  Params = IAnything
> extends Omit<
    IOutletModalProps<Data, Payload, Params>,
    keyof {
      outletIdSubject: never;
      history: never;
      onSubmit: never;
      className: never;
    }
  > {
  onSubmit?: (id: Id, data: Data | null, payload: Payload) => Promise<boolean> | boolean;
  pickDataSubject?: TSubject<Id>;
  fullScreen?: boolean;
  history?: History;
  pathname?: string;
}

/**
 * A custom hook that provides functionality for managing and rendering an outlet modal.
 *
 * @template Data - The type of data associated with the outlet modal.
 * @template Payload - The type of payload passed during submission.
 * @template Params - The type of additional parameters.
 *
 * @param {object} params - The parameters object.
 * @param {React.ReactNode} params.fallback - The fallback content to be rendered if the modal cannot be displayed.
 * @param {string} [params.pathname="/"] - The pathname for the outlet modal history.
 * @param {object} [params.history] - The history object used to manage navigation.
 * @param {boolean} [params.fullScreen=true] - A boolean value indicating whether the modal should be displayed in full screen.
 * @param {function} params.onLoadEnd - The callback function to be called when the outlet content finishes loading.
 * @param {function} params.onLoadStart - The callback function to be called when the outlet content starts loading.
 * @param {boolean} [params.throwError] - A boolean value indicating whether errors should be thrown during submission.
 * @param {function} params.onChange - The callback function to be called when the outlet content changes.
 * @param {function} [params.onSubmit=() => true] - The callback function to be called when the outlet content is submitted.
 * @param {function} params.onMount - The callback function to be called when the outlet modal is mounted.
 * @param {function} params.onUnmount - The callback function to be called when the outlet modal is unmounted.
 * @param {function} [params.onClose] - The callback function to be called when the outlet modal is closed.
 * @param {string} [params.submitLabel] - The label for the submit button in the outlet modal.
 * @param {string} [params.title] - The title for the outlet modal.
 * @param {boolean} [params.hidden] - A boolean value indicating whether the outlet modal should be hidden.
 * @param {object} [params.pickDataSubject] - The subject used for picking data.
 * @param {object} outletProps - Additional props for the underlying `OutletModal` component.
 *
 * @returns {object} - An object containing the following methods and properties:
 *   - `open` - A boolean value indicating whether the modal is open.
 *   - `render` - A function that renders the outlet modal.
 *   - `pickData` - A function used to pick data for the modal.
 *   - `close` - A function used to close the modal.
 */
export const useOutletModal = <
  Data extends {} = Record<string, any>,
  Payload = IAnything,
  Params = IAnything
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
  pickDataSubject: upperPickDataSubject,
  ...outletProps
}: IParams<Data, Payload, Params>) => {
  const pickDataSubject = useSubject(upperPickDataSubject);
  const outletIdSubject = useBehaviorSubject<Id | null>();

  const history = useSingleton(() => upperHistory || createMemoryHistory());

  const onSubmit$ = useActualCallback(onSubmit);

  const handleSubmit = useCallback(async (id: Id, data: Data | null, payload: Payload) => {
    const result = await onSubmit$(id, data, payload);
    if (result) {
      outletIdSubject.next(null);
    }
    return result;
  }, []);

  const handleClose = useCallback(() => {
    outletIdSubject.next(null);
    onClose && onClose();
  }, []);

  const render = useCallback(
    () => (
      <OutletModal
        outletIdSubject={outletIdSubject}
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

  const pickData = useCallback((id: Id) => {
    outletIdSubject.next(id);
  }, []);

  useEffect(() => pickDataSubject.subscribe(pickData), []);

  return {
    open,
    render,
    pickData,
    close: () => handleSubmit(outletIdSubject.data!, null, {} as Payload),
  } as const;
};

export default useOutletModal;
