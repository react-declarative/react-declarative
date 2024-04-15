import Message from "./Message";
import MessageContent from "./MessageContent";

export interface OnMessagesChanged {
    (messages: Message<MessageContent>[]): void;
}

export default OnMessagesChanged;
