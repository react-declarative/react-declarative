import ActionResponse from "./ActionResponse";

export interface TextActionResponse extends ActionResponse {
    type: 'text';
}

export default TextActionResponse;
