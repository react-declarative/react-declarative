import ActionRequest from "./ActionRequest";
import MultiSelectActionResponse from "./MultiSelectActionResponse";

export interface MultiSelectActionRequest extends ActionRequest {
    type: 'multi-select';
    options: {
        value: string;
        text: string;
    }[];
    sendButtonText?: string;
    response?: MultiSelectActionResponse;
}

export default MultiSelectActionRequest
