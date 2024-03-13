import IAnything from "../../../model/IAnything";
import IWizardOutletProps from "./IWizardOutletProps";

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
