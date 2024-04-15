import ActionResponse from "./ActionResponse";

export interface AudioActionResponse extends ActionResponse {
    type: 'audio';
    audio?: Blob;
}

export default AudioActionResponse;
