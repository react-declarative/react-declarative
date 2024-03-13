import IField from "../../../model/IField";

/**
 * Represents a visibility group.
 *
 * @interface
 */
export interface IVisibilityGroup {
    name: string;
    title?: string;
    description?: string;
    fields: IField[];
}

export default IVisibilityGroup;
