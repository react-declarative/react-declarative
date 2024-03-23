import ModalRender from "./ModalRender";

/**
 * Represents a modal component.
 *
 * @interface IModal
 */
export interface IModal {
    id: string;
    render: ModalRender;
    /**
     * Function called when the component initializes.
     *
     * @typedef {function} onInit
     * @return {Promise<void> | void} Returns a Promise that resolves when the initialization is complete, or undefined if there is no need for an asynchronous operation.
     */
    onInit?: () => (Promise<void> | void);
    /**
     * Function called when the component mounts.
     *
     * @param {number} count - The count parameter for the onMount function.
     * @param {IModal[]} stack - The stack parameter for the onMount function.
     * @returns {Promise<void> | void} - A Promise that resolves to void or a void value.
     */
    onMount?: (count: number, stack: IModal[]) => (Promise<void> | void);
    /**
     * Callback function called when unmounting occurs.
     *
     * @param {number} count - The count value.
     * @param {IModal[]} stack - The stack of modals.
     * @returns {Promise<void> | void} - A Promise that resolves when the function completes or void if no Promise is returned.
     */
    onUnmount?: (count: number, stack: IModal[]) => (Promise<void> | void);
}

export default IModal;
