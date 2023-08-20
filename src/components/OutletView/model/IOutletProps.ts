import IAnything from "../../../model/IAnything";

export interface IOutletProps<Data = IAnything, Payload = IAnything, Params = IAnything> {
    onChange: (data: Data, initial?: boolean) => void;
    beginSave: () => Promise<boolean>;
    afterSave: () => Promise<void>;
    activeOption: string;
    data: Data;
    hasChanged: boolean;
    hasLoading: boolean;
    params: Params;
    payload: Payload;
}

export default IOutletProps;
