import { IRevealProps } from "../../FetchView";

import { BoxProps } from "@mui/material";

import IAnything from "../../../model/IAnything";
import TSubject from "../../../model/TSubject";
import History from "../../../model/History";
import IOutlet from "./IOutlet";
import IOtherProps from "./IOtherProps";

/**
 * Props for OutletView component
 *
 * @template Data - The type of the data object
 * @template Payload - The type of the payload object
 * @template Params - The type of the params object
 * @template OtherProps - Additional props for the component
 */
export interface IOutletViewProps<Data extends {} = Record<string, any>, Payload = IAnything, Params = IAnything, OtherProps = IOtherProps> extends Omit<BoxProps, keyof {
    onChange: never;
    onSubmit: never;
}> {
    waitForChangesDelay?: number;
    history: History;
    readonly?: boolean;
    animation?: IRevealProps['animation'];
    payload?: Payload | (() => Payload);
    params?: Params;
    routes: IOutlet<Data, Payload, Params, OtherProps>[];
    initialData?: Data | (() => Data);
    onChange?: (data: Data, initial: boolean, payload: Payload, source: string) => void,
    onSubmit?: (data: Data, payload: Payload, config: { afterSave: () => Promise<void>; }) => (boolean | Promise<boolean>);
    onLoadStart?: () => void;
    onLoadEnd?: (isOk: boolean) => void;
    fallback?: (error: Error) => void;
    changeSubject?: TSubject<[keyof Data, Data]>;
    otherProps?: OtherProps;
}

export default IOutletViewProps;
