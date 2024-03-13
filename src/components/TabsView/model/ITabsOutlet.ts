import IAnything from "../../../model/IAnything";
import ISize from "../../../model/ISize";
import { IOutlet } from "../../OutletView";
import ITabsOutletProps from "./ITabsOutletProps";

export type OtherProps = {
    size: ISize;
    loading: boolean;
    progress: number;
    setLoading: (loading: boolean) => void;
    setProgress: (progress: number) => void;
};

/**
 * Represents a tab outlet component.
 * @template Data - The type of data passed to the tab outlet.
 * @template Payload - The type of payload received by the tab outlet.
 */
export interface ITabsOutlet<Data = IAnything, Payload = IAnything> extends Omit<IOutlet<Data, Payload>, keyof {
    element: never;
}> {
    element: (props: ITabsOutletProps<Data, Payload>) => React.ReactElement;
};

export default ITabsOutlet;
