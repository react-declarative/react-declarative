import ActionResponse from "./ActionResponse";

/** 
 * @interface SelectActionResponse - Interface representing a select action response.
 * @extends {ActionResponse} - Extends ActionResponse interface.
 * @property type - The type of the response. Value is 'select'.
 * @property option - The selected option.
 */
export interface SelectActionResponse extends ActionResponse {
    type: 'select';
    option: {
        value: string;
        text: string;
    };
}

export default SelectActionResponse;
