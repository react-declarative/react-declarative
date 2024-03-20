import { createContext } from 'react';
import IContext from '../model/IContext';

/**
 * The context for the ModalManager component.
 *
 * @typedef {Object} ModalManagerContext
 * @property {Array} modalStack - The stack of modals currently being displayed.
 * @property {Function} pop - Function to remove the top modal from the stack.
 * @property {Function} push - Function to add a new modal to the stack.
 * @property {Function} clear - Function to clear all modals from the stack.
 */
export const ModalManagerContext = createContext<IContext>({
    modalStack: [],
    pop: () => {
        throw new Error('ModalManager no context provided');
    },
    push: () => {
        throw new Error('ModalManager no context provided');
    },
    clear: () => {
        throw new Error('ModalManager no context provided');
    },
});

export default ModalManagerContext;
