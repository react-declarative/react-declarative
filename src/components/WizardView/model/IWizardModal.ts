import IAnything from "../../../model/IAnything";
import IWizardOutlet from "./IWizardOutlet";
import IWizardModalProps from "./IWizardModalProps";

export type IWizardModal<
  Data = IAnything,
  Payload = IAnything
> = Omit<IWizardOutlet<Data, Payload>, keyof {
  element: never;
}> & {
  element: (props: IWizardModalProps<Data, Payload>) => React.ReactElement;
};

export default IWizardModal;
