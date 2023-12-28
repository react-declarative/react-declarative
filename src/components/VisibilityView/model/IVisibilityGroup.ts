import IField from "../../../model/IField";

export interface IVisibilityGroup {
    name: string;
    title?: string;
    description?: string;
    fields: IField[];
}

export default IVisibilityGroup;
