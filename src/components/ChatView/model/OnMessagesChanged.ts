import Message from "./Message";
import MessageContent from "./MessageContent";

/** 
 * @callback OnMessagesChanged - Function signature for the messages changed event handler.
 * @param messages - The array of messages.
 * @returns {void}
 */
export interface OnMessagesChanged {
    (messages: Message<MessageContent>[]): void;
}

export default OnMessagesChanged;
