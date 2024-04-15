import Message from "./Message";

export interface TextMessage extends Message<string> {
    type: 'text';
    content: string;
}

export default TextMessage;
