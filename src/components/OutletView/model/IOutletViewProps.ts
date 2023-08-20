import { BrowserHistory, HashHistory, MemoryHistory } from "history";
import IAnything from "../../../model/IAnything";
import IOutlet from "./IOutlet";

export interface IOutletViewProps<Data extends {} = Record<string, any>, Payload = IAnything, Params = IAnything> {
    waitForChangesDelay?: number;
    history: BrowserHistory | MemoryHistory | HashHistory;
    payload?: Payload | (() => Payload);
    params?: Params;
    deps?: any[];
    routes: IOutlet<Data[keyof Data], Payload, Params>[];
    initialData?: Data;
    onChange?: (data: Data) => void,
    onSubmit: (data: Data) => (boolean | Promise<boolean>);
    onLoadStart?: () => void;
    onLoadEnd?: (isOk: boolean) => void;
    fallback?: (error: Error) => void;
}

export default IOutletViewProps;
