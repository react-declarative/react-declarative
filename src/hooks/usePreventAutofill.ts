import * as React from 'react';
import { useState, useCallback } from 'react';

interface IParams<T = HTMLInputElement> {
    onFocus?: React.FocusEventHandler<T>;
    onTouchStart?: React.TouchEventHandler<T>;
    onContextMenu: React.MouseEventHandler<T>;
    readOnly?: boolean;
}

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
 * @param {Partial<IParams<T>>} [params={}] - An object containing optional parameters.
 * @param {boolean} [params.readOnly] - Specifies whether the input element is read-only.
 * @param {React.FocusEventHandler<T>} [params.onFocus] - Event handler for the "focus" event.
 * @param {React.TouchEventHandler<T>} [params.onTouchStart] - Event handler for the "touchstart" event.
 * @param {React.MouseEventHandler<T>} [params.onContextMenu] - Event handler for the "contextmenu" event.
 * @returns {IResult<T>} - An object with properties and event handlers related to preventing autofill behavior on an HTMLInputElement.
 */
export const usePreventAutofill = <T = HTMLInputElement>({
    readOnly: upperReadOnly,
    onFocus,
    onTouchStart,
    onContextMenu,
}: Partial<IParams<T>> = {}): IResult<T> => {
    const [readOnly, setReadOnly] = useState(true);

    const handleFocus = useCallback<React.FocusEventHandler<T>>((e) => {
        setReadOnly(false);
        onFocus && onFocus(e);
    }, [onFocus]);

    const handleTouchStart = useCallback<React.TouchEventHandler<T>>((e) => {
        setReadOnly(false);
        onTouchStart && onTouchStart(e);
    }, [onFocus]);

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
