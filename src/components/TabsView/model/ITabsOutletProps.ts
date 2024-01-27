import IAnything from "../../../model/IAnything";
import { IOutletProps } from "../../OutletView";
import { OtherProps } from "./ITabsOutlet";

export type ITabsOutletProps<
  Data = IAnything,
  Payload = IAnything,
  Other = {}
> = IOutletProps<Data, Payload, OtherProps & Other> & OtherProps & Other;

export default ITabsOutletProps;
