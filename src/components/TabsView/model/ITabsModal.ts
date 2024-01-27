import IAnything from "../../../model/IAnything";
import ITabsOutlet from "./ITabsOutlet";
import ITabsModalProps from "./ITabsModalProps";

export type ITabsModal<
  Data = IAnything,
  Payload = IAnything
> = Omit<ITabsOutlet<Data, Payload>, keyof {
  element: never;
}> & {
  element: (props: ITabsModalProps<Data, Payload>) => React.ReactElement;
};

export default ITabsModal;
