import { SxProps } from "@mui/material";

import IScaffold2Tab, { IScaffold2TabInternal } from "./IScaffold2Tab";

import Payload from "./Payload";

/**
 * Interface representing an option for an IScaffold2 component.
 * @template T - The type of the payload used by the option.
 */
export interface IScaffold2Option<T = Payload> {
    id: string;
    label?: string;
    lifted?: boolean;
    pin?: boolean;
    sx?: SxProps<any>;
    icon?: React.ComponentType<any>;
    /**
     * Represents an array of `IScaffold2Tab` objects.
     * @template T - The type of the `IScaffold2Tab` object.
     */
    tabs?: IScaffold2Tab<T>[];
    /**
     * Represents an array of options for a variable.
     * @template T The type of the options.
     */
    options?: IScaffold2Option<T>[];
    /**
     * Determines the visibility of a given payload.
     *
     * @param payload - The payload to check visibility for.
     * @returns - The visibility status. Returns a boolean if synchronous, otherwise returns a Promise<boolean>.
     */
    isVisible?: (payload: T) => boolean | (Promise<boolean>);
    /**
     * Checks if a payload is disabled.
     *
     * @param payload - The payload to check.
     * @returns - True if the payload is disabled, false otherwise.
     */
    isDisabled?: (payload: T) => boolean | (Promise<boolean>);
}

/**
 * Represents an internal option for IScaffold2.
 *
 * @template T - The type of the payload.
 */
export interface IScaffold2OptionInternal<T = Payload> extends Omit<IScaffold2Option<T>, keyof {
    isVisible: never;
    isDisabled: never;
    options: never;
    tabs: never;
}> {
    path: string;
    visible: boolean;
    disabled: boolean;
    /**
     * Options for the given variable.
     *
     * @template T - The type of the options.
     */
    options?: IScaffold2OptionInternal<T>[];
    /**
     * Represents an array of internal scaffold tabs.
     * @template T - The type of data associated with the tabs.
     * @typedef Tabs
     */
    tabs?: IScaffold2TabInternal<T>[]
}

export default IScaffold2Option;
