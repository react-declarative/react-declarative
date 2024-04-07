import IAnything from "./IAnything";
import IField, { Value } from "./IField";

import IOneProps from "./IOneProps";

/**
 * Represents the interface for the public properties of the class IOnePublicProps.
 *
 * @template Data - The type of data.
 * @template Payload - The type of payload.
 * @template Field - The type of field.
 *
 * @interface IOnePublicProps
 * @extends Omit<IOneProps<Data, Payload, Field>, keyof { features: never }>
 */
export interface IOnePublicProps<Data = IAnything, Payload = IAnything, Field = IField<Data>>
    extends Omit<IOneProps<Data, Payload, Field>, keyof {
        features: never;
    }> {
    /**
     * Represents an optional onFocus event handler.
     *
     * @template Data - The data type of the component.
     * @template Payload - The type of the event payload.
     * @template Field - The type of the focused field.
     *
     * @param data - The current data of the component.
     * @param payload - The event payload.
     * @param field - The focused field.
     *
     * @return {void} - This function does not return any value.
     */
    onFocus?: IOneProps<Data, Payload, Field>['focus'];
    /**
     * Called when the blur event is triggered on the component.
     *
     * @callback onBlurCallback
     * @param data - The data related to the component.
     * @param payload - The payload associated with the blur event.
     * @param field - The field on which the blur event occurred.
     */
    onBlur?: IOneProps<Data, Payload, Field>['blur'];
    /**
     * Represents the optional 'onMenu' property of type `IOneProps<Data, Payload, Field>['menu']`.
     * This property is used to define the event handler function when a menu action is triggered.
     * The event handler will receive three arguments: `data`, `payload`, and `field`.
     *
     * @typeParam Data - The data type for the menu.
     * @typeParam Payload - The payload type for the menu.
     * @typeParam Field - The field type for the menu.
     *
     * @param data - The data associated with the menu.
     * @param payload - The payload associated with the menu.
     * @param field - The field associated with the menu.
     *
     * @returns
     */
    onMenu?: IOneProps<Data, Payload, Field>['menu'];
    /**
     * Represents the `onReady` property of `IOneProps`.
     *
     * @template Data - The type of the data being handled.
     * @template Payload - The type of the payload being used.
     * @template Field - The type of the field being manipulated.
     *
     * @property [onReady] - Optional property that defines a callback
     * function to be executed when the component is ready.
     */
    onReady?: IOneProps<Data, Payload, Field>['ready'];
    /**
     * The `onChange` function is an optional property of the `IOneProps` interface.
     * It represents the callback function that is invoked when a change event occurs.
     *
     * @template Data - The type of data being handled.
     * @template Payload - The type of payload being passed to the callback function.
     * @template Field - The type of field being modified.
     *
     * @param payload - The payload passed to the callback function.
     * @param field - The field being modified.
     * @returns
     */
    onChange?: IOneProps<Data, Payload, Field>['change'];
    /**
     * Represents a callback function that gets triggered when an onClick event occurs.
     *
     * @template Data - The type of data associated with the component.
     * @template Payload - The type of payload that is passed to the function.
     * @template Field - The type of field used by the component.
     *
     * @param data - The data associated with the component.
     * @param payload - The payload passed to the function.
     * @param field - The field used by the component.
     *
     * @returns
     */
    onClick?: IOneProps<Data, Payload, Field>['click'];
    /**
     * Represents the onInvalid callback function, an optional property of the IOneProps interface.
     * This function is executed when the invalidity condition is met.
     *
     * @template Data - The type of data being processed.
     * @template Payload - The type of payload being passed.
     * @template Field - The type of field being validated.
     *
     * @param invalidity - The invalidity details of the field being validated.
     *
     * @returns void
     */
    onInvalid?: IOneProps<Data, Payload, Field>['invalidity'];
    /**
     * Represents the `onLoadStart` event handler of a component.
     *
     * @template Data - The type of data passed to the component.
     * @template Payload - The type of payload passed to the event handler.
     * @template Field - The type of field associated with the event.
     *
     * @param payload - The payload passed to the event handler.
     *
     * @returns
     */
    onLoadStart?: IOneProps<Data, Payload, Field>['loadStart'];
    /**
     * Represents the optional `onLoadEnd` property of the `IOneProps` interface.
     *
     * This property defines a callback function that is invoked when the loading of data ends.
     *
     * @template Data - The type of the data being loaded.
     * @template Payload - The type of the payload sent with the load operation.
     * @template Field - The type of the field affected by the load operation.
     *
     * @param data - The loaded data.
     * @param payload - The payload sent with the load operation.
     * @param field - The field affected by the load operation.
     * @returns
     */
    onLoadEnd?: IOneProps<Data, Payload, Field>['loadEnd'];
    /**
     * Represents the features of a variable.
     *
     * @typedef {Record<string, Value> | string[] | (() => (string[] | Record<string, Value>))} Features
     */
    features?: Record<string, Value> | string[] | (() => (string[] | Record<string, Value>));
};

export default IOnePublicProps;
