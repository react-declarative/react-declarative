import Message from "./Message";

/** 
 * @interface TextMessage - Interface representing a text message.
 * @extends {Message<string>} - Extends Message interface with string content.
 * @property type - The type of the message. Value is 'text'.
 * @property content - The content of the text message.
 */
export interface TextMessage extends Message<string> {
    type: 'text';
    content: string;
}

export default TextMessage;
