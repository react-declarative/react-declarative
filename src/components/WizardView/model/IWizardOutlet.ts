import IAnything from "../../../model/IAnything";
import ISize from "../../../model/ISize";
import { IOutlet } from "../../OutletView";
import IWizardOutletProps from "./IWizardOutletProps";

/**
 * Represents additional properties for a component.
 *
 * @typedef {Object} OtherProps
 * @property size - The size of the component.
 * @property loading - Specifies if the component is being loaded.
 * @property setLoading - Sets the loading state of the component.
 * @property progress - The progress of the component.
 * @property setProgress - Sets the progress of the component.
 *
 * @since 1.0.0
 */
export type OtherProps = {
    size: ISize;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    progress: number;
    setProgress: (progress: number) => void;
};

/**
 * Represents an interface for a wizard outlet.
 *
 * @template Data - The data type for the outlet.
 * @template Payload - The payload type for the outlet.
 */
export interface IWizardOutlet<Data = IAnything, Payload = IAnything> extends Omit<IOutlet<Data, Payload>, keyof {
    element: never;
}> {
    element: (props: IWizardOutletProps<Data, Payload>) => React.ReactElement;
};

export default IWizardOutlet;
