import Message from "./Message";

export interface JSXMessage extends Message<JSX.Element> {
    type: 'jsx';
    content: JSX.Element;
}

export default JSXMessage;
