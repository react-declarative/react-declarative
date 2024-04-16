import ActionRequest from "./ActionRequest";
import SelectActionResponse from "./SelectActionResponse";

/** 
 * @interface SelectActionRequest - Interface representing a select action request.
 * @extends {ActionRequest} - Extends ActionRequest interface.
 * @property type - The type of the request. Value is 'select'.
 * @property options - The options for selection.
 * @property [response] - The response for the select action (optional).
 */
export interface SelectActionRequest extends ActionRequest {
    type: 'select';
    options: {
        value: string;
        text: string;
    }[];
    response?: SelectActionResponse;
}

export default SelectActionRequest;
