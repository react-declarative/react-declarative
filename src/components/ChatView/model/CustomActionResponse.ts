import ActionResponse from "./ActionResponse";

export interface CustomActionResponse extends ActionResponse {
    type: 'custom';
}

export default CustomActionResponse
