import IModal from "./IModal";

export interface IContext {
    modalStack: IModal[];
    push: (modal: IModal) => void;
    pop: () => void;
}

export default IContext;
