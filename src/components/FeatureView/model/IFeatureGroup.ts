import IAnything from "../../../model/IAnything";
import IField from "../../../model/IField";

import IFeature from "./IFeature";

/**
 * Represents a feature group that can contain multiple features.
 * @template Data - The type of data associated with the feature group.
 * @template Payload - The type of payload associated with the feature group.
 */
export interface IFeatureGroup<Data extends IAnything = IAnything, Payload = IAnything> {
    title: string;
    expanded?: boolean;
    children: IFeature<Data, Payload>[];
    isVisible?: IField<Data, Payload>['isVisible'];
    isDisabled?: IField<Data, Payload>['isDisabled'];
}

export default IFeatureGroup;
