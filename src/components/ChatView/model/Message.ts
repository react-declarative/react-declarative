import MessageContent from "./MessageContent";

/** 
 * @interface Message - Interface representing a message.
 * @template C - Type parameter for the content of the message.
 * @property type - The type of the message.
 * @property content - The content of the message.
 * @property self - Indicates whether the message is sent by the current user.
 * @property [username] - The username associated with the message (optional).
 * @property [avatar] - The avatar associated with the message (optional).
 * @property [createdAt] - The creation date of the message (optional).
 * @property [updatedAt] - The last update date of the message (optional).
 * @property [deletedAt] - The deletion date of the message (optional).
 */
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
