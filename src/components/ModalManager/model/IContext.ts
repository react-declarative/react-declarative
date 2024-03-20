import IModal from "./IModal";

/**
 * Represents a context for managing modals.
 *
 * @interface IContext
 */
export interface IContext {
    modalStack: IModal[];
    push: (modal: IModal) => void;
    pop: () => void;
    clear: () => void;
}

export default IContext;
