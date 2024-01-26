import IAnything from "../../../model/IAnything";
import { IOutletProps } from "../../OutletView";
import { OtherProps } from "./IWizardOutlet";

export type IWizardOutletProps<Data = IAnything, Payload = IAnything, Props = {}> = IOutletProps<Data, Payload, Props> & OtherProps;

export default IWizardOutletProps;
