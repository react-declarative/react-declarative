import ActionRequest from "./ActionRequest";
import TextActionResponse from "./TextActionResponse";

/** 
 * @interface TextActionRequest - Interface representing a text action request.
 * @extends {ActionRequest} - Extends ActionRequest interface.
 * @property type - The type of the request. Value is 'text'.
 * @property [defaultValue] - The default value for the text input (optional).
 * @property [placeholder] - The placeholder text for the text input (optional).
 * @property [sendButtonText] - The text for the send button (optional).
 * @property [response] - The response for the text action (optional).
 */
export interface TextActionRequest extends ActionRequest {
    type: 'text';
    defaultValue?: string;
    placeholder?: string;
    sendButtonText?: string;
    response?: TextActionResponse;
}

export default TextActionRequest;
