import IAnything from "../../../model/IAnything";
import ISize from "../../../model/ISize";
import { IOutlet } from "../../OutletView";

export type OtherProps = {
    size: ISize;
    loading: boolean;
    setLoading: (loading: boolean) => void;
};

export type IWizardOutlet<Data = IAnything, Payload = IAnything> = IOutlet<Data, Payload, OtherProps>;

export default IWizardOutlet;
