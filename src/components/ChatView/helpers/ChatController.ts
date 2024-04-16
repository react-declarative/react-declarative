import ActionRequest from '../model/ActionRequest';
import ActionResponse from '../model/ActionResponse';
import ChatOption from '../model/ChatOption';
import Message from '../model/Message';
import MessageContent from '../model/MessageContent';
import OnActionChanged from '../model/OnActionChanged';
import OnActionResponsed from '../model/OnActionResponsed';
import OnMessagesChanged from '../model/OnMessagesChanged';

/**
 * @interface ChatState - Interface representing the state of the chat.
 * @property {ChatOption} option - The chat options.
 * @property {Message<MessageContent>[]} messages - The array of messages.
 * @property {Action} action - The current action.
 * @property {Action[]} actionHistory - The history of actions.
 * @property {OnMessagesChanged[]} onMessagesChanged - Array of event handlers for messages changed.
 * @property {OnActionChanged[]} onActionChanged - Array of event handlers for action changed.
 */
interface ChatState {
    option: ChatOption;
    messages: Message<MessageContent>[];
    action: Action;
    actionHistory: Action[];
    onMessagesChanged: OnMessagesChanged[];
    onActionChanged: OnActionChanged[];
}

/**
 * @interface Action - Interface representing an action.
 * @property {ActionRequest} request - The action request.
 * @property {ActionResponse[]} responses - The array of action responses.
 * @property {OnActionResponsed[]} onResnponsed - Array of event handlers for action responsed.
 */
interface Action {
    request: ActionRequest;
    responses: ActionResponse[];
    onResnponsed: OnActionResponsed[];
}

/**
 * Class representing a Chat Controller.
 */
export class ChatController {
    /**
     * The state of the chat.
     */
    private state: ChatState;

    /**
     * The default chat options.
     */
    private defaultOption: ChatOption = {
        delay: 300,
    };

    /**
     * The default empty action.
     */
    private emptyAction: Action = {
        request: { type: 'empty' },
        responses: [],
        onResnponsed: [],
    };

    /**
     * The default action request.
     */
    private defaultActionRequest = {
        always: false,
        addMessage: true,
    };

    /**
     * Constructs an instance of ChatController.
     * @param {ChatOption} [option] - The chat options.
     */
    constructor(option?: ChatOption) {
        this.state = {
            option: { ...this.defaultOption, ...option },
            messages: [],
            action: this.emptyAction,
            actionHistory: [],
            onMessagesChanged: [],
            onActionChanged: [],
        };
    }

    /**
     * Adds a message to the chat.
     * @param {Message<MessageContent>} message - The message to add.
     * @returns {Promise<number>} A Promise resolving to the index of the added message.
     */
    addMessage(message: Message<MessageContent>): Promise<number> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const len = this.state.messages.push(message);
                const idx = len - 1;
                this.state.messages[idx].createdAt = new Date();
                this.callOnMessagesChanged();

                resolve(idx);
            }, this.state.option.delay);
        });
    }

    /**
     * Updates a message in the chat.
     * @param {number} index - The index of the message to update.
     * @param {Message<MessageContent>} message - The updated message.
     */
    updateMessage(index: number, message: Message<MessageContent>): void {
        if (message !== this.state.messages[index]) {
            const { createdAt } = this.state.messages[index];
            this.state.messages[index] = message;
            this.state.messages[index].createdAt = createdAt;
        }

        this.state.messages[index].updatedAt = new Date();
        this.callOnMessagesChanged();
    }

    /**
     * Removes a message from the chat.
     * @param {number} index - The index of the message to remove.
     */
    removeMessage(index: number): void {
        this.state.messages[index].deletedAt = new Date();
        this.callOnMessagesChanged();
    }

    /**
     * Gets all messages in the chat.
     * @returns {Message<MessageContent>[]} An array of messages.
     */
    getMessages(): Message<MessageContent>[] {
        return this.state.messages;
    }

    /**
     * Sets the messages in the chat.
     * @param {Message<MessageContent>[]} messages - The messages to set.
     */
    setMessages(messages: Message<MessageContent>[]): void {
        this.clearMessages();
        this.state.messages = [...messages];
        this.callOnMessagesChanged();
    }

    /**
     * Clears all messages from the chat.
     */
    clearMessages(): void {
        this.state.messages = [];
        this.callOnMessagesChanged();
    }

    /**
     * Calls all event handlers for messages changed.
     */
    private callOnMessagesChanged(): void {
        this.state.onMessagesChanged.map((h) => h(this.state.messages));
    }

    /**
     * Adds an event handler for messages changed.
     * @param {OnMessagesChanged} callback - The event handler to add.
     */
    addOnMessagesChanged(callback: OnMessagesChanged): void {
        this.state.onMessagesChanged.push(callback);
    }

    /**
     * Removes an event handler for messages changed.
     * @param {OnMessagesChanged} callback - The event handler to remove.
     */
    removeOnMessagesChanged(callback: OnMessagesChanged): void {
        const idx = this.state.onMessagesChanged.indexOf(callback);
        this.state.onActionChanged[idx] = (): void => { };
    }

    /**
     * Sets the action request and its response handlers.
     * @param {T extends ActionRequest} request - The action request.
     * @param {OnActionResponsed} [onResponse] - The response handler.
     * @returns {Promise<ActionResponse>} A Promise resolving to the action response.
     */
    setActionRequest<T extends ActionRequest>(
        request: T,
        onResponse?: OnActionResponsed,
    ): Promise<ActionResponse> {
        const action: Action = {
            request: { ...this.defaultActionRequest, ...request },
            responses: [],
            onResnponsed: [],
        };

        return new Promise((resolve, reject) => {
            if (!request.always) {
                const returnResponse = (response: ActionResponse): void => {
                    if (!response.error) {
                        resolve(response);
                    } else {
                        reject(response.error);
                    }
                };
                action.onResnponsed.push(returnResponse);
            }

            if (onResponse) {
                action.onResnponsed.push(onResponse);
            }

            this.state.action = action;
            this.state.actionHistory.push(action);
            this.callOnActionChanged(action.request);

            if (request.always) {
                resolve({ type: 'text', value: 'dummy' });
            }
        });
    }

    /**
     * Cancels the current action request.
     */
    cancelActionRequest(): void {
        this.state.action = this.emptyAction;
        this.callOnActionChanged(this.emptyAction.request);
    }

    /**
     * Gets the current action request.
     * @returns {ActionRequest | undefined} The current action request.
     */
    getActionRequest(): ActionRequest | undefined {
        const { request, responses } = this.state.action;
        if (!request.always && responses.length > 0) {
            return undefined;
        }

        return request;
    }

    /**
     * Sets the action response and triggers related actions.
     * @param {ActionRequest} request - The action request.
     * @param {ActionResponse} response - The action response.
     * @returns {Promise<void>} A Promise resolving when the action response is processed.
     */
    async setActionResponse(
        request: ActionRequest,
        response: ActionResponse,
    ): Promise<void> {
        const { request: origReq, responses, onResnponsed } = this.state.action;
        if (request !== origReq) {
            throw new Error('Invalid action.');
        }
        if (!request.always && onResnponsed.length === 0) {
            throw new Error('onResponsed is not set.');
        }

        responses.push(response);
        this.callOnActionChanged(request, response);

        if (request.addMessage) {
            await this.addMessage({
                type: 'text',
                content: response.value,
                self: true,
            });
        }

        onResnponsed.map((h) => h(response));
    }

    /**
     * Gets all action responses.
     * @returns {ActionResponse[]} An array of action responses.
     */
    getActionResponses(): ActionResponse[] {
        return this.state.action.responses;
    }

    /**
     * Calls all event handlers for action changed.
     * @param {ActionRequest} request - The action request.
     * @param {ActionResponse} [response] - The action response.
     */
    private callOnActionChanged(
        request: ActionRequest,
        response?: ActionResponse,
    ): void {
        this.state.onActionChanged.map((h) => h(request, response));
    }

    /**
     * Adds an event handler for action changed.
     * @param {OnActionChanged} callback - The event handler to add.
     */
    addOnActionChanged(callback: OnActionChanged): void {
        this.state.onActionChanged.push(callback);
    }

    /**
     * Removes an event handler for action changed.
     * @param {OnActionChanged} callback - The event handler to remove.
     */
    removeOnActionChanged(callback: OnActionChanged): void {
        const idx = this.state.onActionChanged.indexOf(callback);
        this.state.onActionChanged[idx] = (): void => { };
    }

    /**
     * Gets the chat options.
     * @returns {ChatOption} The chat options.
     */
    getOption(): ChatOption {
        return this.state.option;
    }
}

export default ChatController;