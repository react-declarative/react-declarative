import { useContext } from "react";
import ModalManagerContext from "../context/ModalManagerContext";
import IModal from "../model/IModal";

interface IResult {
    total: number;
    push: (modal: IModal) => void;
    pop: () => void;
    clear: () => void;
}

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
