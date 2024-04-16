import ActionRequest from "./ActionRequest";
import MultiSelectActionResponse from "./MultiSelectActionResponse";

/** 
 * @interface MultiSelectActionRequest - Interface representing a multi-select action request.
 * @extends {ActionRequest} - Extends ActionRequest interface.
 * @property type - The type of the request. Value is 'multi-select'.
 * @property options - The options for multi-select.
 * @property [sendButtonText] - The text for the send button (optional).
 * @property [response] - The response for the multi-select action (optional).
 */
export interface MultiSelectActionRequest extends ActionRequest {
    type: 'multi-select';
    options: {
        value: string;
        text: string;
    }[];
    sendButtonText?: string;
    response?: MultiSelectActionResponse;
}

export default MultiSelectActionRequest
