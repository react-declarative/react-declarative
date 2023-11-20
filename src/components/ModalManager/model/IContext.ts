import ModalRender from "./ModalRender";

export interface IContext {
    outletStack: ModalRender[];
    push: (outlet: ModalRender) => void;
    pop: () => void;
}

export default IContext;
