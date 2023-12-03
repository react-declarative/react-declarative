import IAnything from "../../../model/IAnything";
import { ModalOtherProps } from "./IOutletModal";
import IOutletProps from "./IOutletProps";

export type IOutletModalProps<
  Data = IAnything,
  Payload = IAnything,
  Params = IAnything
> = IOutletProps<Data, Payload, Params> & ModalOtherProps;

export default IOutletModalProps;
