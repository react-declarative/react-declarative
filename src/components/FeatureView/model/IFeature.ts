import IAnything from "../../../model/IAnything";
import IField from "../../../model/IField";

export interface IFeature<Data extends IAnything = IAnything, Payload = IAnything> {
    name: string;
    label?: string;
    description?: string;
    defaultValue?: boolean;
    isDisabled?: IField<Data, Payload>['isDisabled'];
    isVisible?: IField<Data, Payload>['isVisible'];
    map?: IField<Data, Payload>['map'];
}

export default IFeature;
