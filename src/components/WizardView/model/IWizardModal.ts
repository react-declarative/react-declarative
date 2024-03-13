import IAnything from "../../../model/IAnything";
import IWizardOutlet from "./IWizardOutlet";
import IWizardModalProps from "./IWizardModalProps";

/**
 * Represents a modal wizard with specific data and payload types.
 *
 * @template Data - The type of data passed to the wizard.
 * @template Payload - The type of payload returned by the wizard.
 */
export type IWizardModal<
  Data = IAnything,
  Payload = IAnything
> = Omit<IWizardOutlet<Data, Payload>, keyof {
  element: never;
}> & {
  element: (props: IWizardModalProps<Data, Payload>) => React.ReactElement;
};

export default IWizardModal;
