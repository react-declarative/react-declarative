import IAnything from "../../../model/IAnything";
import History from "../../../model/History";

/**
 * Represents the properties of an outlet inner component.
 *
 * @template Data - The type of the component's data.
 * @template Payload - The type of the component's payload.
 * @template Params - The type of the component's params.
 */
export interface IOutletProps<Data = IAnything, Payload = IAnything, Params = IAnything> {
    /**
     * A callback function that is invoked when a change event occurs.
     *
     * @callback onChangeCallback
     * @param {Data[keyof Data]} data - The updated data value.
     * @param {boolean} [initial=false] - Indicates whether the change is triggered initially.
     * @returns {void}
     */
    onChange: (data: Data[keyof Data], initial?: boolean) => void;
    /**
     * Callback function for handling an invalid event.
     *
     * @callback onInvalid
     * @param {string} name - The name of the event that triggered the invalid event.
     * @param {string} msg - The error message associated with the invalid event.
     * @returns {void} - This function does not return any value.
     */
    onInvalid: (name: string, msg: string) => void;
    /**
     * Begins the save process.
     *
     * @function
     * @returns {Promise<boolean>} A promise that resolves to a boolean value indicating if the save process has started successfully.
     */
    beginSave: () => Promise<boolean>;
    /**
     * Executes the afterSave logic.
     *
     * @returns {Promise<void>} A Promise that resolves once the afterSave logic is completed.
     */
    afterSave: () => Promise<void>;
    /**
     * Indicates whether a certain state is dirty.
     *
     * @type {boolean}
     */
    dirty: boolean;
    /**
     * Represents the state of a form.
     *
     * @typedef {Object} FormState
     *
     * @property {function} change - A callback function that is triggered when the form data changes. It receives a `data` parameter of type `Data`.
     * @property {Data} data - The current data of the form.
     * @property {boolean} hasChanged - Indicates whether the form data has changed.
     * @property {boolean} hasLoading - Indicates whether the form is currently loading.
     * @property {boolean} hasInvalid - Indicates whether the form data is invalid.
     * @property {Payload} payload - The payload associated with the form.
     * @property {string} id - The unique identifier of the form.
     */
    formState: {
        change: (data: Data) => void;
        data: Data;
        hasChanged: boolean;
        hasLoading: boolean;
        hasInvalid: boolean;
        payload: Payload;
        id: string;
    };
    /**
     * Represents the history of an outlet.
     *
     * @class
     */
    history: History;
    /**
     * Represents the currently active option.
     *
     * @typedef {string} activeOption
     * @description A string variable indicating the currently active option.
     */
    activeOption: string;
    /**
     * Specifies whether a variable is read-only or not.
     *
     * @typedef {boolean} Readonly
     */
    readonly: boolean;
    /**
     * Represents the data of the outlet.
     */
    data: Data;
    /**
     * Indicates whether a change has occurred.
     *
     * @type {boolean}
     */
    hasChanged: boolean;
    /**
     * Represents the loading state of a system.
     *
     * @typedef {boolean} hasLoading
     */
    hasLoading: boolean;
    /**
     * Indicates whether the value is invalid.
     *
     * @type {boolean}
     */
    hasInvalid: boolean;
    /**
     * Represents the parameters for a function.
     *
     * @typedef {Object} Params
     * @property {number} param1 - The first parameter of type number.
     * @property {string} param2 - The second parameter of type string.
     * @property {boolean} param3 - The third parameter of type boolean.
     */
    params: Params;
    /**
     * Represents a payload object.
     */
    payload: Payload;
}

export default IOutletProps;
