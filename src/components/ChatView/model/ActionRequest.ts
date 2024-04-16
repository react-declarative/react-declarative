import { ActionResponse } from "./ActionResponse";

/**
 * Represents a request for an action.
 * @typedef ActionRequest
 * @property type - The type of the action.
 * @property [always] - Indicates if the action should always be performed.
 * @property [addMessage] - Indicates if a message should be added.
 * @property [response] - The response object associated with the action.
 */
export interface ActionRequest {
    type: string;
    always?: boolean;
    addMessage?: boolean;
    response?: ActionResponse;
}

export default ActionRequest;
