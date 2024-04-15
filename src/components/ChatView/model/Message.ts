import MessageContent from "./MessageContent";

export interface Message<C extends MessageContent> {
    type: string;
    content: C;
    self: boolean;
    username?: string;
    avatar?: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}

export default Message
