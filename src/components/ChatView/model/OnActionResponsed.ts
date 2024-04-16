import ActionResponse from "./ActionResponse";

/** 
 * @callback OnActionResponsed - Function signature for the action responsed event handler.
 * @param response - The action response.
 * @returns {void}
 */
export interface OnActionResponsed {
    (response: ActionResponse): void;
}

export default OnActionResponsed;
