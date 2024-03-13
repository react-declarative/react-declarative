import IAnything from "../../../model/IAnything";
import IField from "../../../model/IField";
import FeatureType from './FeatureType';

/**
 * Represents a feature.
 * @template Data - The data type of the feature.
 * @template Payload - The payload type of the feature.
 */
export interface IFeature<Data extends IAnything = IAnything, Payload = IAnything> {
    type?: FeatureType;
    name: string;
    label?: string;
    description?: string;
    defaultValue?: string | boolean;
    isDisabled?: IField<Data, Payload>['isDisabled'];
    isVisible?: IField<Data, Payload>['isVisible'];
    map?: IField<Data, Payload>['map'];
}

export default IFeature;
