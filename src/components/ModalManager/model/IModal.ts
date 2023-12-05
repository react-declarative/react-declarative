import ModalRender from "./ModalRender";

export interface IModal {
    id: string;
    render: ModalRender;
    onInit?: () => (Promise<void> | void);
    onMount?: (count: number, stack: IModal[]) => (Promise<void> | void);
    onUnmount?: (count: number, stack: IModal[]) => (Promise<void> | void);
}

export default IModal;
