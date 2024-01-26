import IAnything from "../../../model/IAnything";
import IWizardOutlet from "./IWizardOutlet";
import IWizardOutletProps from "./IWizardOutletProps";

export type IWizardModal<
  Data = IAnything,
  Payload = IAnything
> = Omit<IWizardOutlet<Data, Payload>, keyof {
  element: never;
}> & {
  element: (props: IWizardOutletProps<Data, Payload>) => React.ReactElement;
};

export default IWizardModal;
