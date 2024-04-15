import ActionRequest from "./ActionRequest";
import TextActionResponse from "./TextActionResponse";

export interface TextActionRequest extends ActionRequest {
    type: 'text';
    defaultValue?: string;
    placeholder?: string;
    sendButtonText?: string;
    response?: TextActionResponse;
  }

export default TextActionRequest;
