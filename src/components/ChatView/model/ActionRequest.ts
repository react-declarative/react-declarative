import { ActionResponse } from "./ActionResponse";

export interface ActionRequest {
    type: string;
    always?: boolean;
    addMessage?: boolean;
    response?: ActionResponse;
}

export default ActionRequest;
