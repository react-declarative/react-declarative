/**
 * Represents the response structure for actions.
 * @interface ActionResponse
 * @property type - The type of the response.
 * @property value - The value of the response.
 * @property [error] - Optional error object if an error occurred during the action.
 */
export interface ActionResponse {
    type: string;
    value: string;
    error?: Error;
}

export default ActionResponse;
