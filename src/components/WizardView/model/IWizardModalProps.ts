import IAnything from "../../../model/IAnything";
import IWizardOutletProps from "./IWizardOutletProps";

type ModalOtherProps = {
  onClose: () => void;
};

export type IWizardModalProps<
  Data = IAnything,
  Payload = IAnything
> = IWizardOutletProps<Data, Payload, ModalOtherProps>;

export default IWizardModalProps;
