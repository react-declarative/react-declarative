
import { SxProps } from "@mui/material";
import History from "../../../model/History";
import IAnything from "../../../model/IAnything";
import IOutletViewProps from "../../OutletView/model/IOutletViewProps";
import IWizardOutlet, { OtherProps } from "./IWizardOutlet";
import IWizardStep from "./IWizardStep";

/**
 * Interface representing the props for the WizardView component.
 *
 * @template Data - Type of data object.
 * @template Payload - Type of payload object.
 */
export interface IWizardViewProps<Data extends {} = IAnything, Payload = IAnything, Params = IAnything> extends Omit<IOutletViewProps<Data, Payload, Params, Partial<OtherProps>>, keyof {
    history: never;
    routes: never;
}> {
    className?: string;
    outlinePaper?: boolean;
    fullScreen?: boolean;
    transparentPaper?: boolean;
    style?: React.CSSProperties;
    sx?: SxProps<any>;
    routes: IWizardOutlet<Data, Payload>[];
    steps: IWizardStep<Payload>[];
    history?: History;
    pathname?: string;
}

export default IWizardViewProps;
