import IAnything from "../../../model/IAnything";
import IOutlet from "./IOutlet";

export type ModalOtherProps = {
  onClose: () => void;
};

export type IOutletModal<
  Data = IAnything,
  Payload = IAnything,
  Params = IAnything
> = IOutlet<Data, Payload, Params, ModalOtherProps>;

export default IOutletModal;
