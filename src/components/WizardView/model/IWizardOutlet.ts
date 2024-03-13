import IAnything from "../../../model/IAnything";
import ISize from "../../../model/ISize";
import { IOutlet } from "../../OutletView";
import IWizardOutletProps from "./IWizardOutletProps";

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
