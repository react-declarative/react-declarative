import IAnything from "../../../model/IAnything";
import ITabsOutletProps from "./ITabsOutletProps";
import { OtherProps } from "./ITabsOutlet";

type ModalOtherProps = {
  onClose: () => void;
};

/**
 * Represents the props for the ITabsModal component.
 * @template Data The type of data.
 * @template Payload The type of payload.
 */
export type ITabsModalProps<
  Data = IAnything,
  Payload = IAnything
> = Omit<ITabsOutletProps<Data, Payload, ModalOtherProps>, keyof {
  withScroll: never;
}> &
  ModalOtherProps &
  OtherProps;

export default ITabsModalProps;
