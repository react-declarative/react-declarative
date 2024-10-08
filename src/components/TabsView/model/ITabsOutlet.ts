import IAnything from "../../../model/IAnything";
import ISize from "../../../model/ISize";
import { IOutlet } from "../../OutletView";
import ITabsOutletProps from "./ITabsOutletProps";

/**
 * Represents a set of additional properties.
 *
 * @typedef OtherProps
 * @property size - The size of the object.
 * @property loading - Indicates if the object is currently loading.
 * @property progress - The progress of loading the object.
 * @property setLoading - A function to set the loading state of the object.
 * @property setProgress - A function to set the progress of loading the object.
 */
export type OtherProps = {
    size: ISize;
    loading: boolean;
    progress: number;
    setLoading: (loading: boolean) => void;
    setProgress: (progress: number) => void;
    onClose: () => void;
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
