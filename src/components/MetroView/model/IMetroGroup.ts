import IMetroRoute from "./IMetroRoute";

export interface IMetroGroup {
    label: string;
    routes?: IMetroRoute[];
}

export default IMetroGroup;
