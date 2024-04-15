import ActionRequest from "./ActionRequest";
import { AudioActionResponse } from "./AudioActionResponse";

export interface AudioActionRequest extends ActionRequest {
    type: 'audio';
    sendButtonText?: string;
    response?: AudioActionResponse;
}

export default AudioActionRequest;
