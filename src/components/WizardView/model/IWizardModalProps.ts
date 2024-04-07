import IAnything from "../../../model/IAnything";
import IWizardOutletProps from "./IWizardOutletProps";

/**
 * Represents the additional properties for a modal component.
 *
 * @typedef {Object} ModalOtherProps
 * @property onClose - The function to be called when the modal is closed.
 */
type ModalOtherProps = {
  onClose: () => void;
};

/**
 * Interface for the props of the WizardModal component.
 * @template Data - The type of data for the wizard.
 * @template Payload - The type of payload for the wizard.
 */
export type IWizardModalProps<
  Data = IAnything,
  Payload = IAnything
> = IWizardOutletProps<Data, Payload, ModalOtherProps> & ModalOtherProps;

export default IWizardModalProps;
