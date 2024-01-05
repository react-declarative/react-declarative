import IAnything from "../../../model/IAnything";

export interface IBoardRow<Data = IAnything, Payload = IAnything> {
    label: React.ReactNode;
    value: React.ReactNode | ((id: string, data: Data, payload: Payload) => (React.ReactNode | Promise<React.ReactNode>));
    click?: (id: string, data: Data, payload: Payload) => (void | Promise<void>);
}

export default IBoardRow;
