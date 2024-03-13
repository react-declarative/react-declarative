import IAnything from "../../../model/IAnything";
import IOutlet from "./IOutlet";

export type ModalOtherProps = {
  onClose: () => void;
};

/**
 * Represents an outlet modal.
 * @template Data - The type of data received from the outlet.
 * @template Payload - The type of payload used in the outlet.
 * @template Params - The type of parameters used in the outlet.
 */
export type IOutletModal<
  Data = IAnything,
  Payload = IAnything,
  Params = IAnything
> = IOutlet<Data, Payload, Params, ModalOtherProps>;

export default IOutletModal;
