import ActionResponse from "./ActionResponse";

export interface FileActionResponse extends ActionResponse {
    type: 'file';
    files: File[];
}

export default FileActionResponse;
