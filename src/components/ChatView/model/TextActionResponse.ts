import ActionResponse from "./ActionResponse";

/** 
 * @interface TextActionResponse - Interface representing a text action response.
 * @extends {ActionResponse} - Extends ActionResponse interface.
 * @property type - The type of the response. Value is 'text'.
 */
export interface TextActionResponse extends ActionResponse {
    type: 'text';
}

export default TextActionResponse;
