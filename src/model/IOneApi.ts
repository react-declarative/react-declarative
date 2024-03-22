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
     * @returns {Promise<void>} - A Promise that resolves when the page reload is completed.
     */
    reload: () => Promise<void>;
    /**
     * Changes the provided data.
     *
     * @param {Data} data - The data to be changed.
     * @param {boolean} [initial=false] - Indicates if the change is an initial change.
     * @returns {void}
     */
    change: (data: Data, initial?: boolean) => void;
    /**
     * Retrieves the data.
     *
     * @function
     * @name getData
     * @returns {Data} The retrieved data.
     */
    getData: () => Data;
};

export default IOneApi;
