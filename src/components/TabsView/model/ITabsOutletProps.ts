import IAnything from "../../../model/IAnything";
import { IOutletProps } from "../../OutletView";
import { OtherProps } from "./ITabsOutlet";

/**
 * Represents the props for a TabsOutlet component.
 * @template Data - The type of data to be passed to the TabsOutlet component.
 * @template Payload - The type of payload to be passed to the TabsOutlet component.
 * @template Other - Additional properties to be included in the TabsOutlet props.
 */
export type ITabsOutletProps<
  Data = IAnything,
  Payload = IAnything,
  Other = {}
> = IOutletProps<Data, Payload, OtherProps & Other> & OtherProps & Other;

export default ITabsOutletProps;
