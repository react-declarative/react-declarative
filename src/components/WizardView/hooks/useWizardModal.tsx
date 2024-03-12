import * as React from "react";
import { useCallback } from "react";
import { createMemoryHistory } from "history";

import WizardOutletModal, {
  IWizardModalProps,
} from "../components/WizardOutletModal";

import useBehaviorSubject from "../../../hooks/useBehaviorSubject";
import useActualCallback from "../../../hooks/useActualCallback";
import useSingleton from "../../../hooks/useSingleton";

import IAnything from "../../../model/IAnything";
import History from "../../../model/History";

interface IParams<Data extends {} = Record<string, any>, Payload = IAnything>
  extends Omit<
    IWizardModalProps<Data, Payload>,
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
 * useWizardModal is a custom hook that provides a modal component for wizards.
 * It accepts various parameters and returns an object with functions and properties
 * related to the wizard modal.
 *
 * @param {object} params - The parameters for the useWizardModal hook.
 * @param {function} params.fallback - The fallback function to be called when an error occurs during rendering.
 * @param {string} params.pathname - The pathname for the history object. Defaults to "/".
 * @param {object} params.history - The history object. If not provided, a new memory history object will be created.
 * @param {boolean} params.fullScreen - Determines whether the modal should be displayed in full screen. Defaults to true.
 * @param {function} params.onLoadEnd - The function to be called when the wizard finishes loading.
 * @param {function} params.onLoadStart - The function to be called when the wizard starts loading.
 * @param {boolean} params.throwError - Determines whether an error should be thrown when an error occurs during submission. Defaults to false.
 * @param {function} params.onChange - The function to be called when the wizard state changes.
 * @param {function} params.onSubmit - The function to be called when the wizard is submitted. Defaults to a function that returns true.
 * @param {function} params.onMount - The function to be called when the wizard component is mounted.
 * @param {function} params.onUnmount - The function to be called when the wizard component is unmounted.
 * @param {function} params.onClose - The function to be called when the modal is closed.
 * @param {string} params.submitLabel - The label for the submit button.
 * @param {string} params.title - The title of the wizard modal.
 * @param {boolean} params.hidden - Determines whether the modal should be hidden. Defaults to false.
 * @param {object} params.outletProps - Additional props to pass to the WizardOutletModal component.
 *
 * @returns {object} - An object with functions and properties related to the wizard modal.
 * @returns {boolean} return.open - A boolean value indicating whether the modal is open.
 * @returns {function} return.render - A function that renders the wizard modal.
 * @returns {function} return.pickData - A function that triggers the modal to open.
 * @returns {function} return.close - A function that closes the modal and submits an empty payload.
 */
export const useWizardModal = <
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
      <WizardOutletModal
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
    close: () => handleSubmit(null, {} as Payload),
  } as const;
};

export default useWizardModal;
