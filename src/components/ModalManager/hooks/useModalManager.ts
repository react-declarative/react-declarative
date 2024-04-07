import { useContext } from "react";
import ModalManagerContext from "../context/ModalManagerContext";
import IModal from "../model/IModal";

/**
 * Represents a result object with a total property and push, pop, and clear methods.
 *
 * @interface
 */
interface IResult {
    total: number;
    /**
     * Pushes a modal onto the stack.
     *
     * @param modal - The modal object to be pushed.
     * @returns
     */
    push: (modal: IModal) => void;
    /**
     * Removes the last element from an array and returns undefined.
     */
    pop: () => void;
    /**
     * Clears the modal stack.
     */
    clear: () => void;
}

/**
 * Returns a result object for managing modals using the ModalManagerContext.
 *
 * @return The result object for managing modals.
 */
export const useModalManager = (): IResult => {
    const context = useContext(ModalManagerContext);
    /**
     * Represents the result object.
     * @typedef {Object} Result
     * @property total - The total number of items in the modal stack.
     * @property push - The function that adds an item to the modal stack.
     * @property pop - The function that removes an item from the modal stack.
     * @property clear - The function that clears all items in the modal stack.
     *
     */
    return {
        total: context.modalStack.length,
        push: context.push,
        pop: context.pop,
        clear: context.clear,
    };
};

export default useModalManager;
