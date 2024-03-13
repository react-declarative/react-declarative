import IAnything from "./IAnything";

/**
 * Represents an interface for interacting with the One component by api ref.
 * @template Data - The type of data that the OneApi operates on.
 */
export interface IOneApi<Data = IAnything> {
    reload: () => Promise<void>;
    change: (data: Data, initial?: boolean) => void;
    getData: () => Data;
};

export default IOneApi;
