import ActionRequest from "./ActionRequest";
import ActionResponse from "./ActionResponse";

export interface OnActionChanged {
    (request: ActionRequest, response?: ActionResponse): void;
}

export default OnActionChanged;
