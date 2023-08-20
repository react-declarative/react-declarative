import { BrowserHistory, HashHistory, MemoryHistory } from "history";

import { IRevealProps } from "../../FetchView";

import { BoxProps } from "@mui/material";

import IAnything from "../../../model/IAnything";
import IOutlet from "./IOutlet";

export interface IOutletViewProps<Data extends {} = Record<string, any>, Payload = IAnything, Params = IAnything> extends Omit<BoxProps, keyof {
    onChange: never;
    onSubmit: never;
}> {
    appearAnimationDelay?: number;
    waitForChangesDelay?: number;
    history: BrowserHistory | MemoryHistory | HashHistory;
    animation?: IRevealProps['animation'];
    payload?: Payload | (() => Payload);
    params?: Params;
    routes: IOutlet<Data[keyof Data], Payload, Params>[];
    initialData?: Data | (() => Data);
    onChange?: (data: Data) => void,
    onSubmit: (data: Data) => (boolean | Promise<boolean>);
    onLoadStart?: () => void;
    onLoadEnd?: (isOk: boolean) => void;
    fallback?: (error: Error) => void;
}

export default IOutletViewProps;
