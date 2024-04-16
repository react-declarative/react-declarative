import ActionRequest from "./ActionRequest";
import { AudioActionResponse } from "./AudioActionResponse";

/**
 * @interface Represents an action request specific to audio interactions.
 * @extends {ActionRequest}
 * @property type - Specifies the type of action request.
 * @property [sendButtonText] - Text to display on the button for sending audio.
 * @property [response] - Response object for the audio action.
 */
export interface AudioActionRequest extends ActionRequest {
    type: 'audio';
    sendButtonText?: string;
    response?: AudioActionResponse;
}

export default AudioActionRequest;
