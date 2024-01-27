import IAnything from "../../../model/IAnything";
import ITabsOutletProps from "./ITabsOutletProps";
import { OtherProps } from "./ITabsOutlet";

type ModalOtherProps = {
  onClose: () => void;
};

export type ITabsModalProps<
  Data = IAnything,
  Payload = IAnything
> = ITabsOutletProps<Data, Payload, ModalOtherProps> &
  ModalOtherProps &
  OtherProps;

export default ITabsModalProps;
