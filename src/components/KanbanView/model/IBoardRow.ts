import IAnything from "../../../model/IAnything";

export interface IBoardRow<Payload = IAnything> {
    label: string;
    value: (id: string, payload: Payload) => (string | Promise<string>);
    click?: (id: string, payload: Payload) => (void | Promise<void>);
}

export default IBoardRow;
