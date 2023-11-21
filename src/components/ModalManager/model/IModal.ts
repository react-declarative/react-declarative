import ModalRender from "./ModalRender";

export interface IModal {
    id: string;
    render: ModalRender;
    onInit?: () => void;
    onMount?: (count: number, stack: IModal[]) => void;
    onUnmount?: (count: number, stack: IModal[]) => void;
}

export default IModal;
