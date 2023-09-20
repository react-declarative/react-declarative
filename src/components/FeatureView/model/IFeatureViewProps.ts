import IAnything from "../../../model/IAnything";
import IOneProps from "../../../model/IOneProps";

import IFeatureGroup from "./IFeatureGroup";

export interface IFeatureViewProps<Data extends IAnything = IAnything, Payload = IAnything> extends Omit<IOneProps<Data, Payload>, keyof {
    fields: never;
    features: never;
    payload: never;
}> {
    features: IFeatureGroup<Data, Payload>[];
    expandAll?: boolean;
}

export default IFeatureViewProps;
