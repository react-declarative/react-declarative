import IAnything from "../../../model/IAnything";

export interface IOutletProps<Data = IAnything, Payload = IAnything, Params = IAnything> {
    onChange: (data: Data, initial?: boolean) => void;
    beginSave: () => Promise<boolean>;
    afterSave: () => Promise<void>;
    formState: {
        change: (data: Record<string, Data>) => void;
        data: Record<string, Data>
        hasChanged: boolean;
        hasLoading: boolean;
        id: string;
    };
    activeOption: string;
    readonly: boolean;
    data: Data;
    hasChanged: boolean;
    hasLoading: boolean;
    params: Params;
    payload: Payload;
}

export default IOutletProps;
