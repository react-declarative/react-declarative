import { useContext } from "react";
import ModalManagerContext from "../context/ModalManagerContext";
import IModal from "../model/IModal";

interface IResult {
    push: (modal: IModal) => void;
    pop: () => void;
}

export const useModalManager = (): IResult => {
    const context = useContext(ModalManagerContext);
    return {
        push: context.push,
        pop: context.pop,
    };
};

export default useModalManager;
