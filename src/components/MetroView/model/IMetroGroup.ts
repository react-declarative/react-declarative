import IAnything from "../../../model/IAnything";
import IField from "../../../model/IField";

import IMetroRoute from "./IMetroRoute";

export interface IMetroGroup<Data = IAnything, Payload = IAnything> {
    label: string;
    isVisible?: IField<Data, Payload>['isVisible'];
    routes?: IMetroRoute<Data, Payload>[];
}

export default IMetroGroup;
