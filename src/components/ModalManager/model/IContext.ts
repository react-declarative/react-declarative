import IModal from "./IModal";

/**
 * Represents a context for managing modals.
 *
 * @interface IContext
 */
export interface IContext {
    /**
     * Represents a stack of modal objects.
     *
     * @typedef {Array<IModal>} modalStack
     */
    modalStack: IModal[];
    /**
     * Pushes a modal onto the stack.
     *
     * @param {IModal} modal - The modal to push onto the stack.
     * @returns {void}
     */
    push: (modal: IModal) => void;
    /**
     * Removes the last element from modal stack
     *
     * @function
     * @name pop
     * @returns {undefined}
     */
    pop: () => void;
    /**
     * Clears the modal stack.
     *
     * @function
     * @returns {void}
     */
    clear: () => void;
}

export default IContext;
