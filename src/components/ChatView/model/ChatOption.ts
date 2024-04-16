/** 
 * @interface ChatOption - Interface representing options for a chat.
 * @property [delay] - The delay in milliseconds before displaying a message (optional).
 * @property [showDateTime] - Whether to display date and time for each message (optional).
 */
export interface ChatOption {
    delay?: number;
    showDateTime?: boolean;
}

export default ChatOption;
