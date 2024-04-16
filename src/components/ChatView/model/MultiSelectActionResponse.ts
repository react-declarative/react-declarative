import ActionResponse from "./ActionResponse";

/** 
 * @interface MultiSelectActionResponse - Interface representing a multi-select action response.
 * @extends {ActionResponse} - Extends ActionResponse interface.
 * @property type - The type of the response. Value is 'multi-select'.
 * @property options - The options selected in the multi-select response.
 */
export interface MultiSelectActionResponse extends ActionResponse {
    type: 'multi-select';
    options: {
        value: string;
        text: string;
    }[];
}

export default MultiSelectActionResponse;
