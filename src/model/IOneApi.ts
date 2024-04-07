import IAnything from "./IAnything";

/**
 * Represents an interface for interacting with the One component by api ref.
 * @template Data - The type of data that the OneApi operates on.
 */
export interface IOneApi<Data = IAnything> {
    /**
     * Reloads the current page.
     *
     * @function reload
     * @returns - A Promise that resolves when the page reload is completed.
     */
    reload: () => Promise<void>;
    /**
     * Changes the provided data.
     *
     * @param data - The data to be changed.
     * @param [initial=false] - Indicates if the change is an initial change.
     * @returns
     */
    change: (data: Data, initial?: boolean) => void;
    /**
     * Retrieves the data.
     *
     * @function
     * @name getData
     * @returns The retrieved data.
     */
    getData: () => Data;
};

export default IOneApi;
