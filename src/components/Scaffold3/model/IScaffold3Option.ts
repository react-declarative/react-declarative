import { SxProps } from "@mui/material";

import IScaffold3Tab, { IScaffold3TabInternal } from "./IScaffold3Tab";

import Payload from "./Payload";

/**
 * Interface representing an option for an IScaffold3 component.
 * @template T - The type of the payload used by the option.
 */
export interface IScaffold3Option<T = Payload> {
    id: string;
    label?: string;
    lifted?: boolean;
    pin?: boolean;
    sx?: SxProps<any>;
    icon?: React.ComponentType<any>;
    iconColor?: string;
    /**
     * Represents an array of `IScaffold3Tab` objects.
     * @template T - The type of the `IScaffold3Tab` object.
     */
    tabs?: IScaffold3Tab<T>[];
    /**
     * Represents an array of options for a variable.
     * @template T The type of the options.
     */
    options?: IScaffold3Option<T>[];
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
 * Represents an internal option for IScaffold3.
 *
 * @template T - The type of the payload.
 */
export interface IScaffold3OptionInternal<T = Payload> extends Omit<IScaffold3Option<T>, keyof {
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
    options?: IScaffold3OptionInternal<T>[];
    /**
     * Represents an array of internal scaffold tabs.
     * @template T - The type of data associated with the tabs.
     * @typedef Tabs
     */
    tabs?: IScaffold3TabInternal<T>[]
}

export default IScaffold3Option;
