
import { SxProps } from "@mui/material";
import History from "../../../model/History";
import IAnything from "../../../model/IAnything";
import IOutletViewProps from "../../OutletView/model/IOutletViewProps";
import IWizardOutlet, { OtherProps } from "./IWizardOutlet";
import IWizardStep from "./IWizardStep";

export interface IWizardViewProps<Data extends {} = IAnything, Payload = IAnything> extends Omit<IOutletViewProps<Data, Payload, OtherProps>, keyof {
    history: never;
    routes: never;
}> {
    className?: string;
    outlinePaper?: boolean;
    style?: React.CSSProperties;
    sx?: SxProps;
    routes: IWizardOutlet<Data, Payload>[];
    steps: IWizardStep<Payload>[];
    history?: History;
    pathname?: string;
}

export default IWizardViewProps;
