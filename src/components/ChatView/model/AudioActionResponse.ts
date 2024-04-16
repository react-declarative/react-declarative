import ActionResponse from "./ActionResponse";

/** 
 * @interface AudioActionResponse - Interface representing an audio action response.
 * @extends {ActionResponse} - Extends ActionResponse interface.
 * @property type - The type of the response. Value is 'audio'.
 * @property [audio] - The audio data (optional).
 */
export interface AudioActionResponse extends ActionResponse {
    type: 'audio';
    audio?: Blob;
}

export default AudioActionResponse;
