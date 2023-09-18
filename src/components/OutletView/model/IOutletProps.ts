import IAnything from "../../../model/IAnything";

export interface IOutletProps<Data = IAnything, Payload = IAnything, Params = IAnything> {
    onChange: (data: Data, initial?: boolean) => void;
    onInvalid: (name: string, msg: string) => void;
    beginSave: () => Promise<boolean>;
    afterSave: () => Promise<void>;
    dirty: boolean;
    formState: {
        change: (data: Record<string, Data>) => void;
        data: Record<string, Data>
        hasChanged: boolean;
        hasLoading: boolean;
        hasInvalid: boolean;
        payload: Payload;
        id: string;
    };
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
