import { createContext } from 'react';
import IContext from '../model/IContext';

/**
 * The context for the ModalManager component.
 *
 * @typedef {Object} ModalManagerContext
 * @property modalStack - The stack of modals currently being displayed.
 * @property pop - Function to remove the top modal from the stack.
 * @property push - Function to add a new modal to the stack.
 * @property clear - Function to clear all modals from the stack.
 */
export const ModalManagerContext = createContext<IContext>({
    /**
     * Represents a stack to store modal objects.
     * @type {Array}
     */
    modalStack: [],
    /**
     * Removes and returns the top element from the stack.
     *
     * @throws {Error} Throws an error if no context is provided for ModalManager.
     */
    pop: () => {
        throw new Error('ModalManager no context provided');
    },
    /**
     * Throws an error indicating that the ModalManager has no context provided.
     *
     * @throws {Error} Indicates that ModalManager no context provided.
     */
    push: () => {
        throw new Error('ModalManager no context provided');
    },
    /**
     * Clear function of ModalManager.
     *
     * @throws {Error} Throws an error if no context is provided.
     */
    clear: () => {
        throw new Error('ModalManager no context provided');
    },
});

export default ModalManagerContext;
