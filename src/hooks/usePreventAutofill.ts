import * as React from 'react';
import { useState, useCallback } from 'react';

interface IParams<T = HTMLInputElement> {
    onFocus?: React.FocusEventHandler<T>;
    onTouchStart?: React.TouchEventHandler<T>;
    readOnly?: boolean;
}

interface IResult<T = HTMLInputElement>  {
    readOnly: boolean;
    onFocus: React.FocusEventHandler<T>;
    onTouchStart: React.TouchEventHandler<T>;
}

/**
 * @see https://stackoverflow.com/questions/15738259/disabling-chrome-autofill/36283282
 */
export const usePreventAutofill = <T = HTMLInputElement>({
    readOnly: upperReadOnly,
    onFocus,
    onTouchStart,
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

    return {
        readOnly: upperReadOnly || readOnly,
        onFocus: handleFocus,
        onTouchStart: handleTouchStart,
    };
};

export default usePreventAutofill;
