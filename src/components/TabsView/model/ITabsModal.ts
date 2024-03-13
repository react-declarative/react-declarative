import IAnything from "../../../model/IAnything";
import ITabsOutlet from "./ITabsOutlet";
import ITabsModalProps from "./ITabsModalProps";

/**
 * Represents a class ITabsModal.
 * @template Data - The type of data.
 * @template Payload - The type of payload.
 */
export type ITabsModal<
  Data = IAnything,
  Payload = IAnything
> = Omit<ITabsOutlet<Data, Payload>, keyof {
  element: never;
}> & {
  element: (props: ITabsModalProps<Data, Payload>) => React.ReactElement;
};

export default ITabsModal;
