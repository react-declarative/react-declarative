import IAnything from "./IAnything";

export interface IOneApi<Data = IAnything> {
    reload: () => Promise<void>;
    change: (data: Data) => void;
};

export default IOneApi;
