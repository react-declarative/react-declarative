import ActionRequest from "./ActionRequest";
import ActionResponse from "./ActionResponse";

/** 
 * @callback OnActionChanged - Function signature for the action changed event handler.
 * @param request - The action request.
 * @param [response] - The action response (optional).
 * @returns {void}
 */
export interface OnActionChanged {
    (request: ActionRequest, response?: ActionResponse): void;
}

export default OnActionChanged;
