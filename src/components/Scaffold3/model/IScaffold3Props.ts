import * as React from "react";

import { SxProps } from "@mui/material";

import IScaffold3Group, { IScaffold3GroupInternal } from "./IScaffold3Group";
import IScaffold3Action from "./IScaffold3Action";
import Payload from "./Payload";

/**
 * Represents the properties of the IScaffold3 component.
 */
export interface IScaffold3Props<T = Payload> {
    noOptionHover?: boolean;
    noContent?: boolean;
    noAppName?: boolean;
    fixedHeader?: boolean;
    noSearch?: boolean;
    dense?: boolean;
    className?: string;
    style?: React.CSSProperties;
    sx?: SxProps<any>;
    appName?: string;
    options: IScaffold3Group<T>[];
    actions?: IScaffold3Action<T>[];
    loading?: boolean | number;
    payload?: T;
    /**
     * An array of dependencies.
     *
     * @typedef Dependencies
     */
    deps?: any[];
    /**
     * Specifies the active option path.
     *
     * @typedef activeOptionPath
     * @description This variable holds the path of the currently active option.
     *              The path is represented as a string value.
     */
    activeOptionPath: string;
    /**
     * Represents the path of the active tab.
     *
     * @typedef activeTabPath
     *
     * @description
     * The `activeTabPath` variable is an optional string that represents the path of the active tab.
     * It is used to track and store the current tab's path within the application.
     */
    activeTabPath?: string;
    /**
     * Represents the type definition for the `AfterAppName` variable.
     *
     * @typedef AfterAppName
     *
     * @description
     * A variable of type `React.ComponentType<any>` representing a React component.
     */
    AfterAppName?: React.ComponentType<any>;
    /**
     * Represents a React component BeforeActionMenu.
     *
     * @component
     * @typedef BeforeActionMenu
     */
    BeforeActionMenu?: React.ComponentType<any>;
    /**
     * BeforeSearch is a React component type used for rendering a component before the search functionality.
     *
     * @typedef BeforeSearch
     * @memberof module:components
     * @see {@link https://reactjs.org/docs/react-component.html|React.ComponentType}
     */
    BeforeSearch?: React.ComponentType<any>;
    /**
     * Represents a React component type for the AfterSearch component.
     *
     */
    AfterSearch?: React.ComponentType<any>;
    /**
     * Represents the type definition for the BeforeMenuContent variable.
     *
     * @description
     * This variable represents a React component that serves as the content to be rendered
     * before the menu component. It can accept any props as specified by the `any` type.
     */
    BeforeMenuContent?: React.ComponentType<any>;
    /**
     * Type definition for the variable AfterMenuContent.
     *
     * @typedef AfterMenuContent
     * @description A React component type that represents the content to be rendered after a menu component.
     */
    AfterMenuContent?: React.ComponentType<any>;
    /**
     * Represents the `BeforeContent` variable.
     *
     * @typedef BeforeContent
     * @description This variable is a React component type that can accept any props. It is typically used to render content that should appear before the main content within a parent component
     */
    BeforeContent?: React.ComponentType<any>;
    /**
     * Represents a React component type for rendering content after the main content.
     *
     * @typedef AfterContent
     */
    AfterContent?: React.ComponentType<any>;
    /**
     * The Copyright component is a React component that represents a copyright notice.
     * It can be used in a React application to display the copyright information.
     *
     * @component
     * @category UI Components
     *
     * @param props - The properties of the Copyright component.
     *
     * @returns The Copyright React component.
     */
    Copyright?: React.ComponentType<any>;
    /**
     * Represents a optional callback function that is triggered when an action is performed.
     * The function takes a `name` parameter of type `string` and returns `void`.
     *
     * @typedef onAction
     * @param name - The name of the action being performed.
     * @returns
     */
    onAction?: (name: string) => void;
    /**
     * Callback function that is triggered when an option is clicked.
     *
     * @param path - The path of the option.
     * @param id - The ID of the option.
     * @returns - Returns undefined or a boolean value based on the processing of the option click.
     */
    onOptionClick?: (path: string, id: string) => void | undefined | boolean;
    /**
     * Function called when an option group is clicked.
     *
     * @param path - The path of the option group.
     * @param id - The ID of the clicked option group.
     * @return {undefined | boolean} - Returns undefined or a boolean value.
     */
    onOptionGroupClick?: (path: string, id: string) => void | undefined | boolean;
    /**
     * Represents a callback for when a tab change event occurs.
     *
     * @param path - The current path of the tab.
     * @param tab - The name of the tab that was changed to.
     * @param id - The unique identifier of the tab.
     * @returns
     */
    onTabChange?: (path: string, tab: string, id: string) => void;
    children: React.ReactNode;
    /**
     * @typedef onInit
     * @description Represents a function that may or may not initialize something.
     * The function returns either void or a Promise that resolves to void.
     */
    onInit?: () => (void | Promise<void>);
    /**
     * Represents a callback function that will be invoked when a load operation starts.
     *
     * @callback onLoadStart
     * @returns
     */
    onLoadStart?: () => void;
    /**
     * Represents a callback function that is called when the loading process ends.
     *
     * @callback onLoadEnd
     * @param isOk - A boolean value indicating whether the loading process was successful.
     * @returns This callback does not return anything.
     */
    onLoadEnd?: (isOk: boolean) => void;
    /**
     * Represents a function that acts as a fallback, which is executed when an error occurs.
     * @param e - The error that occurred.
     * @returns
     */
    fallback?: (e: Error) => void;
    /**
     * Indicates whether an error should be thrown.
     *
     * @typedef throwError
     */
    throwError?: boolean;
}

/**
 * Represents the internal props for the IScaffold3 component.
 *
 * @template T - The type of payload.
 */
export interface IScaffold3InternalProps<T = Payload> extends Omit<IScaffold3Props<T>, keyof {
    options: never;
}> {
    options: IScaffold3GroupInternal<T>[];
}

export default IScaffold3Props;
