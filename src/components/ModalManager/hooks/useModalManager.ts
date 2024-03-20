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
    push: (modal: IModal) => void;
    pop: () => void;
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
