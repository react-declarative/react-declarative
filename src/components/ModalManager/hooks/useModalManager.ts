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
     * @param {IModal} modal - The modal object to be pushed.
     * @returns {void}
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
    return {
        total: context.modalStack.length,
        push: context.push,
        pop: context.pop,
        clear: context.clear,
    };
};

export default useModalManager;
