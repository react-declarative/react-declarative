import Message from "./Message";

/** 
 * @interface JSXMessage - Interface representing a message with JSX content.
 * @extends {Message<JSX.Element>} - Extends Message interface with JSX element content.
 * @property type - The type of the message. Value is 'jsx'.
 * @property content - The JSX element content of the message.
 */
export interface JSXMessage extends Message<JSX.Element> {
    type: 'jsx';
    content: JSX.Element;
}

export default JSXMessage;
