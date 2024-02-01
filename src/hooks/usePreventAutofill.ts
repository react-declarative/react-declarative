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
 * @see https://stackoverflow.com/questions/15738259/disabling-chrome-autofill/36283282
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
