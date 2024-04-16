import ActionResponse from "./ActionResponse";

/** 
 * @interface FileActionResponse - Interface representing a file action response.
 * @extends {ActionResponse} - Extends ActionResponse interface.
 * @property type - The type of the response. Value is 'file'.
 * @property files - The array of files.
 */
export interface FileActionResponse extends ActionResponse {
    type: 'file';
    files: File[];
}

export default FileActionResponse;
