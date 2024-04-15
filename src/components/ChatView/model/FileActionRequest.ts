import ActionRequest from "./ActionRequest";
import FileActionResponse from "./FileActionResponse";

export interface FileActionRequest extends ActionRequest {
    type: 'file';
    accept?: string;
    multiple?: boolean;
    response?: FileActionResponse;
    sendButtonText?: string;
}

export default FileActionRequest
