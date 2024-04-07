import * as React from 'react';
import { useState, useCallback } from 'react';

/**
 * Interface representing parameters for a component.
 *
 * @template T - The type of the input element.
 */
interface IParams<T = HTMLInputElement> {
    onFocus?: React.FocusEventHandler<T>;
    onTouchStart?: React.TouchEventHandler<T>;
    onContextMenu: React.MouseEventHandler<T>;
    readOnly?: boolean;
}

/**
 * Interface for representing the result of an operation or request.
 * @template T - The type of the element being handled.
 */
interface IResult<T = HTMLInputElement>  {
    readOnly: boolean;
    onFocus: React.FocusEventHandler<T>;
    onTouchStart: React.TouchEventHandler<T>;
    onContextMenu: React.MouseEventHandler<T>;
}

/**
 * This function takes an object with optional parameters and returns an object with properties and event handlers related to preventing autofill behavior on an HTMLInputElement.
 *
 * @see https://stackoverflow.com/questions/15738259/disabling-chrome-autofill/36283282
 *
 * @template T - The type of the HTMLInputElement.
 * @param [params={}] - An object containing optional parameters.
 * @param [params.readOnly] - Specifies whether the input element is read-only.
 * @param [params.onFocus] - Event handler for the "focus" event.
 * @param [params.onTouchStart] - Event handler for the "touchstart" event.
 * @param [params.onContextMenu] - Event handler for the "contextmenu" event.
 * @returns - An object with properties and event handlers related to preventing autofill behavior on an HTMLInputElement.
 */
export const usePreventAutofill = <T = HTMLInputElement>({
    readOnly: upperReadOnly,
    onFocus,
    onTouchStart,
    onContextMenu,
}: Partial<IParams<T>> = {}): IResult<T> => {
    const [readOnly, setReadOnly] = useState(true);

    /**
     * Handles the focus event for a component.
     *
     * @param e - The focus event object.
     * @returns
     */
    const handleFocus = useCallback<React.FocusEventHandler<T>>((e) => {
        setReadOnly(false);
        onFocus && onFocus(e);
    }, [onFocus]);

    /**
     * Handles touch start event.
     *
     * @callback TouchEventHandler
     * @param e - The touch event object.
     * @returns
     */
    const handleTouchStart = useCallback<React.TouchEventHandler<T>>((e) => {
        setReadOnly(false);
        onTouchStart && onTouchStart(e);
    }, [onFocus]);

    /**
     * Callback function to handle the context menu event.
     *
     * @function
     * @param e - The mouse event object.
     * @returns
     */
    const handleContextMenu = useCallback<React.MouseEventHandler<T>>((e) => {
        e.preventDefault();
        e.stopPropagation();
        onContextMenu && onContextMenu(e);
    }, [onFocus]);

    return {
        readOnly: upperReadOnly || readOnly,
        onFocus: handleFocus,
        onTouchStart: handleTouchStart,
        onContextMenu: handleContextMenu,
    };
};

export default usePreventAutofill;
