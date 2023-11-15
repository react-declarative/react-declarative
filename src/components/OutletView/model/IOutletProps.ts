import IAnything from "../../../model/IAnything";
import History from "../../../model/History";

export interface IOutletProps<Data = IAnything, Payload = IAnything, Params = IAnything> {
    onChange: (data: Data[keyof Data], initial?: boolean) => void;
    onInvalid: (name: string, msg: string) => void;
    beginSave: () => Promise<boolean>;
    afterSave: () => Promise<void>;
    dirty: boolean;
    formState: {
        change: (data: Data) => void;
        data: Data;
        hasChanged: boolean;
        hasLoading: boolean;
        hasInvalid: boolean;
        payload: Payload;
        id: string;
    };
    history: History;
    activeOption: string;
    readonly: boolean;
    data: Data;
    hasChanged: boolean;
    hasLoading: boolean;
    hasInvalid: boolean;
    params: Params;
    payload: Payload;
}

export default IOutletProps;
