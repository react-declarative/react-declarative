import ActionResponse from "./ActionResponse";

/** 
 * @interface CustomActionResponse - Interface representing a custom action response.
 * @extends {ActionResponse} - Extends ActionResponse interface.
 * @property type - The type of the response. Value is 'custom'.
 */
export interface CustomActionResponse extends ActionResponse {
    type: 'custom';
}

export default CustomActionResponse
