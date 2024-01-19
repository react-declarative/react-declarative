import IAnything from "../../../model/IAnything";
import ISize from "../../../model/ISize";
import { IOutlet } from "../../OutletView";
import ITabsOutletProps from "./ITabsOutletProps";

export type OtherProps = {
    size: ISize;
};

export interface ITabsOutlet<Data = IAnything, Payload = IAnything> extends Omit<IOutlet<Data, Payload>, keyof {
    element: never;
}> {
    element: (props: ITabsOutletProps<Data, Payload>) => React.ReactElement;
};

export default ITabsOutlet;