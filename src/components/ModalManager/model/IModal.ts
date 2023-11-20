import ModalRender from "./ModalRender";

export interface IModal {
    id: string;
    render: ModalRender;
    onMount?: (stack: IModal[]) => void;
    onUnmount?: (stack: IModal[]) => void;
}

export default IModal;
