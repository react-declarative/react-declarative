import IAnything from "../../../model/IAnything";
import { IOutletProps } from "../../OutletView";
import { OtherProps } from "./IWizardOutlet";

export type IWizardOutletProps<Data = IAnything, Payload = IAnything> = IOutletProps<Data, Payload> & OtherProps;

export default IWizardOutletProps;
