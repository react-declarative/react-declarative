import ActionRequest from "./ActionRequest";
import CustomActionResponse from "./CustomActionResponse";

/** 
 * @interface CustomActionRequest - Interface representing a custom action request.
 * @extends {ActionRequest} - Extends ActionRequest interface.
 * @property type - The type of the request. Value is 'custom'.
 * @property Component - The JSX element representing the custom action.
 * @property [response] - The response for the custom action (optional).
 */
export interface CustomActionRequest extends ActionRequest {
    type: 'custom';
    Component: JSX.Element;
    response?: CustomActionResponse;
}

export default CustomActionRequest;
