import IAnything from "../../../model/IAnything";
import { IOutletProps } from "../../OutletView";
import { OtherProps } from "./ITabsOutlet";

export type ITabsOutletProps<Data = IAnything, Payload = IAnything> = IOutletProps<Data, Payload> & OtherProps;

export default ITabsOutletProps;
