import IAnything from "../../../model/IAnything";
import IField from "../../../model/IField";

export interface IMetroRoute<Data = IAnything, Payload = IAnything> {
  label: string;
  icon?: React.ComponentType<any>;
  isVisible?: IField<Data, Payload>['isVisible'];
  to: string;
}

export default IMetroRoute;
