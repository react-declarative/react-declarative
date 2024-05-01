import IField from "./IField";

/**
 * Represents a phony field interface with additional properties.
 *  - Phony fields are not serializable, so they will not affect form data
 *  - Phony fields are reflectable, `getAvailableFields()` and `<VisibilityView />` will detect them.
 * @interface
 */
export interface IPhonyField {
    title?: IField['title'];
    description?: IField['description'];
    placeholder?: IField['placeholder'];
}

export default IPhonyField;
