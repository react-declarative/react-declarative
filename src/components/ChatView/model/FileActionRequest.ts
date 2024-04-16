import ActionRequest from "./ActionRequest";
import FileActionResponse from "./FileActionResponse";

/** 
 * @interface FileActionRequest - Interface representing a file action request.
 * @extends {ActionRequest} - Extends ActionRequest interface.
 * @property type - The type of the request. Value is 'file'.
 * @property [accept] - The file types accepted (optional).
 * @property [multiple] - Whether multiple files can be selected (optional).
 * @property [response] - The response for the file action (optional).
 * @property [sendButtonText] - The text for the send button (optional).
 */
export interface FileActionRequest extends ActionRequest {
    type: 'file';
    accept?: string;
    multiple?: boolean;
    response?: FileActionResponse;
    sendButtonText?: string;
}

export default FileActionRequest
