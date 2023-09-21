import IAnything from "../../../model/IAnything";
import IField from "../../../model/IField";

import IFeature from "./IFeature";

export interface IFeatureGroup<Data extends IAnything = IAnything, Payload = IAnything> {
    title: string;
    expanded?: boolean;
    children: IFeature<Data, Payload>[];
    isVisible?: IField<Data, Payload>['isVisible'];
    isDisabled?: IField<Data, Payload>['isDisabled'];
}

export default IFeatureGroup;
