import IAnything from "../../../model/IAnything";
import { IOutletProps } from "../../OutletView";
import { OtherProps } from "./IWizardOutlet";

/**
 * Interface for the props of the WizardOutlet component.
 * @template Data - The type of data expected by the WizardOutlet component.
 * @template Payload - The type of payload expected by the WizardOutlet component.
 * @template Props - Additional props for the WizardOutlet component.
 */
export type IWizardOutletProps<Data = IAnything, Payload = IAnything, Props = {}> = IOutletProps<Data, Payload, Props> & OtherProps;

export default IWizardOutletProps;
