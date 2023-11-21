import IModal from "./IModal";

export interface IContext {
    modalStack: IModal[];
    push: (modal: IModal) => void;
    pop: () => void;
    clear: () => void;
}

export default IContext;
