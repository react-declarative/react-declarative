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

/**
 * Represents the interface for the Params class.
 * @template Data - The type of the Data parameter.
 * @template Payload - The type of the Payload parameter.
 */
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
 * @param params - The parameters for the useWizardModal hook.
 * @param params.fallback - The fallback function to be called when an error occurs during rendering.
 * @param params.pathname - The pathname for the history object. Defaults to "/".
 * @param params.history - The history object. If not provided, a new memory history object will be created.
 * @param params.fullScreen - Determines whether the modal should be displayed in full screen. Defaults to true.
 * @param params.onLoadEnd - The function to be called when the wizard finishes loading.
 * @param params.onLoadStart - The function to be called when the wizard starts loading.
 * @param params.throwError - Determines whether an error should be thrown when an error occurs during submission. Defaults to false.
 * @param params.onChange - The function to be called when the wizard state changes.
 * @param params.onSubmit - The function to be called when the wizard is submitted. Defaults to a function that returns true.
 * @param params.onMount - The function to be called when the wizard component is mounted.
 * @param params.onUnmount - The function to be called when the wizard component is unmounted.
 * @param params.onClose - The function to be called when the modal is closed.
 * @param params.submitLabel - The label for the submit button.
 * @param params.title - The title of the wizard modal.
 * @param params.hidden - Determines whether the modal should be hidden. Defaults to false.
 * @param params.outletProps - Additional props to pass to the WizardOutletModal component.
 *
 * @returns - An object with functions and properties related to the wizard modal.
 * @returns return.open - A boolean value indicating whether the modal is open.
 * @returns return.render - A function that renders the wizard modal.
 * @returns return.pickData - A function that triggers the modal to open.
 * @returns return.close - A function that closes the modal and submits an empty payload.
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

  /**
   * Handles form submission.
   *
   * @param {Data | null} data - The form data to be submitted.
   * @param {Payload} payload - Additional payload for the submission.
   * @returns {Promise<boolean>} - A promise that resolves to a boolean indicating if the submission was successful.
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
   * Handles the close event.
   *
   * @function
   * @name handleClose
   * @returns {void}
   *
   * @description
   * This function is used to handle the close event. It updates the 'openSubject' by emitting a 'false' value.
   * It also calls the 'onClose' function if it is provided.
   *
   * This function is implemented using the 'useCallback' hook with an empty dependency array ([]) to ensure that the function is
   * memoized and only changes when its dependencies change.
   */
  const handleClose = useCallback(() => {
    openSubject.next(false);
    onClose && onClose();
  }, []);

  /**
   * Renders the WizardOutletModal component with the provided props.
   *
   * @returns {React.Element} The rendered WizardOutletModal component.
   *
   * @param {Object} props - The props for the WizardOutletModal component.
   * @param {boolean} props.openSubject - Controls whether the WizardOutletModal is open or closed.
   * @param {boolean} props.fullScreen - Controls whether the WizardOutletModal is displayed in full screen mode.
   * @param {object} props.history - The history object for controlling navigation within the modal.
   * @param {boolean} props.hidden - Controls whether the WizardOutletModal is hidden or visible.
   * @param {string} props.title - The title of the WizardOutletModal.
   * @param {React.Element} props.fallback - The fallback element to be displayed if the WizardOutletModal fails to load.
   * @param {Function} props.onChange - The callback function to be executed when the input value of the WizardOutletModal changes.
   * @param {Function} props.onLoadEnd - The callback function to be executed when the WizardOutletModal finishes loading.
   * @param {Function} props.onMount - The callback function to be executed when the WizardOutletModal mounts.
   * @param {Function} props.onClose - The callback function to be executed when the WizardOutletModal is closed.
   * @param {Function} props.onUnmount - The callback function to be executed when the WizardOutletModal is unmounted.
   * @param {Function} props.onLoadStart - The callback function to be executed when the WizardOutletModal starts loading.
   * @param {string} props.submitLabel - The label for the submit button in the WizardOutletModal.
   * @param {boolean} props.throwError - Controls whether an error is thrown if the WizardOutletModal fails to load.
   * @param {Function} props.onSubmit - The callback function to be executed when the submit button in the WizardOutletModal is clicked.
   * @param {Object} outletProps - Additional props to be spread to the WizardOutletModal component.
   *
   * @param {boolean} hidden - The value used for the hidden dependency in the useCallback hook.
   * @param {React.Element} fallback - The value used for the fallback dependency in the useCallback hook.
   * @param {Function} onChange - The value used for the onChange dependency in the useCallback hook.
   * @param {Function} onLoadEnd - The value used for the onLoadEnd dependency in the useCallback hook.
   * @param {Function} onLoadStart - The value used for the onLoadStart dependency in the useCallback hook.
   * @param {Function} handleSubmit - The value used for the handleSubmit dependency in the useCallback hook.
   * @param {string} submitLabel - The value used for the submitLabel dependency in the useCallback hook.
   * @param {boolean} throwError - The value used for the throwError dependency in the useCallback hook.
   * @param {string} title - The value used for the title dependency in the useCallback hook.
   */
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

  /**
   * Executes the provided callback function when called.
   *
   * @function
   * @memberof module:Utils
   * @name pickData
   * @returns {void}
   *
   * @description
   * The `pickData` function is a utility function that can be used to execute a callback function when called.
   * It is implemented using the `useCallback` hook from React library.
   *
   */
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
