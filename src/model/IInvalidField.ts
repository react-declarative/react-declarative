import IAnything from "./IAnything";
import IField from "./IField";

export interface IInvalidField<Data = IAnything, Payload = IAnything> {
    field: IField<Data, Payload>;
    title: IField<Data, Payload>['title'];
    name: IField<Data, Payload>['name'];
    error: string;
}

export default IInvalidField;
