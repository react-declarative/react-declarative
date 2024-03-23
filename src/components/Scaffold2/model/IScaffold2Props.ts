import * as React from "react";

import { SxProps } from "@mui/material";

import IScaffold2Group, { IScaffold2GroupInternal } from "./IScaffold2Group";
import IScaffold2Action from "./IScaffold2Action";
import Payload from "./Payload";

/**
 * Represents the properties of the IScaffold2 component.
 */
export interface IScaffold2Props<T = Payload> {
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
    options: IScaffold2Group<T>[];
    actions?: IScaffold2Action<T>[];
    loading?: boolean | number;
    payload?: T;
    /**
     * An array of dependencies.
     *
     * @typedef {any[]} Dependencies
     */
    deps?: any[];
    /**
     * Specifies the active option path.
     *
     * @typedef {string} activeOptionPath
     * @description This variable holds the path of the currently active option.
     *              The path is represented as a string value.
     */
    activeOptionPath: string;
    /**
     * Represents the path of the active tab.
     *
     * @typedef {string} activeTabPath
     *
     * @description
     * The `activeTabPath` variable is an optional string that represents the path of the active tab.
     * It is used to track and store the current tab's path within the application.
     */
    activeTabPath?: string;
    /**
     * Represents the type definition for the `AfterAppName` variable.
     *
     * @typedef {import('react').ComponentType<any>} AfterAppName
     *
     * @description
     * A variable of type `React.ComponentType<any>` representing a React component.
     */
    AfterAppName?: React.ComponentType<any>;
    /**
     * Represents a React component BeforeActionMenu.
     *
     * @component
     * @typedef {React.ComponentType<any>} BeforeActionMenu
     */
    BeforeActionMenu?: React.ComponentType<any>;
    /**
     * BeforeSearch is a React component type used for rendering a component before the search functionality.
     *
     * @typedef {React.ComponentType<any>} BeforeSearch
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
     * @typedef {React.ComponentType<any>} AfterMenuContent
     * @description A React component type that represents the content to be rendered after a menu component.
     */
    AfterMenuContent?: React.ComponentType<any>;
    /**
     * Represents the `BeforeContent` variable.
     *
     * @typedef {React.ComponentType<any>} BeforeContent
     * @description This variable is a React component type that can accept any props. It is typically used to render content that should appear before the main content within a parent component
     */
    BeforeContent?: React.ComponentType<any>;
    /**
     * Represents a React component type for rendering content after the main content.
     *
     * @typedef {React.ComponentType<any>} AfterContent
     */
    AfterContent?: React.ComponentType<any>;
    /**
     * The Copyright component is a React component that represents a copyright notice.
     * It can be used in a React application to display the copyright information.
     *
     * @component
     * @category UI Components
     *
     * @param {any} props - The properties of the Copyright component.
     *
     * @returns {React.ComponentType<any>} The Copyright React component.
     */
    Copyright?: React.ComponentType<any>;
    /**
     * Represents a optional callback function that is triggered when an action is performed.
     * The function takes a `name` parameter of type `string` and returns `void`.
     *
     * @typedef {function} onAction
     * @param {string} name - The name of the action being performed.
     * @returns {void}
     */
    onAction?: (name: string) => void;
    /**
     * Callback function that is triggered when an option is clicked.
     *
     * @param {string} path - The path of the option.
     * @param {string} id - The ID of the option.
     * @returns {undefined | boolean} - Returns undefined or a boolean value based on the processing of the option click.
     */
    onOptionClick?: (path: string, id: string) => undefined | boolean;
    /**
     * Function called when an option group is clicked.
     *
     * @param {string} path - The path of the option group.
     * @param {string} id - The ID of the clicked option group.
     * @return {undefined | boolean} - Returns undefined or a boolean value.
     */
    onOptionGroupClick?: (path: string, id: string) => undefined | boolean;
    /**
     * Represents a callback for when a tab change event occurs.
     *
     * @param {string} path - The current path of the tab.
     * @param {string} tab - The name of the tab that was changed to.
     * @param {string} id - The unique identifier of the tab.
     * @returns {void}
     */
    onTabChange?: (path: string, tab: string, id: string) => void;
    children: React.ReactNode;
    /**
     * @typedef {() => (void | Promise<void>)} onInit
     * @description Represents a function that may or may not initialize something.
     * The function returns either void or a Promise that resolves to void.
     */
    onInit?: () => (void | Promise<void>);
    /**
     * Represents a callback function that will be invoked when a load operation starts.
     *
     * @callback onLoadStart
     * @returns {void}
     */
    onLoadStart?: () => void;
    /**
     * Represents a callback function that is called when the loading process ends.
     *
     * @callback onLoadEnd
     * @param {boolean} isOk - A boolean value indicating whether the loading process was successful.
     * @returns {void} This callback does not return anything.
     */
    onLoadEnd?: (isOk: boolean) => void;
    /**
     * Represents a function that acts as a fallback, which is executed when an error occurs.
     * @param {Error} e - The error that occurred.
     * @returns {void}
     */
    fallback?: (e: Error) => void;
    /**
     * Indicates whether an error should be thrown.
     *
     * @typedef {boolean} throwError
     */
    throwError?: boolean;
    /**
     * Flag to indicate whether backdrop transition should be disabled.
     *
     * @type {boolean}
     * @optional
     */
    disableBackdropTransition?: boolean;
    /**
     * The variable `disableDiscovery` determines if the discovery feature is enabled or disabled.
     *
     * @type {boolean|undefined}
     * @default undefined
     */
    disableDiscovery?: boolean;
    /**
     * Represents whether swipe to open functionality is disabled or not.
     *
     * @type {boolean}
     * @default false
     */
    disableSwipeToOpen?: boolean;
    /**
     * The width of the swipe area.
     * @type {number} - Optional parameter, represents the width of the swipe area in pixels.
     */
    swipeAreaWidth?: number;
}

/**
 * Represents the internal props for the IScaffold2 component.
 *
 * @template T - The type of payload.
 */
export interface IScaffold2InternalProps<T = Payload> extends Omit<IScaffold2Props<T>, keyof {
    options: never;
}> {
    options: IScaffold2GroupInternal<T>[];
}

export default IScaffold2Props;
