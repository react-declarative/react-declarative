import { useContext } from "react";
import ModalManagerContext from "../context/ModalManagerContext";

export const useModalManager = () => {
    const {
        push,
        pop,
    } = useContext(ModalManagerContext);
    return {
        push,
        pop,
    };
};

export default useModalManager();
