import ActionRequest from "./ActionRequest";
import CustomActionResponse from "./CustomActionResponse";

export interface CustomActionRequest extends ActionRequest {
    type: 'custom';
    Component: JSX.Element;
    response?: CustomActionResponse;
}

export default CustomActionRequest;
