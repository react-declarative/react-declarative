import React, { useLayoutEffect } from 'react';

const process = (target: HTMLDivElement, change: (target: HTMLInputElement) => void, selector = 'input:autofill') => {
    const interval = setInterval(() => {
        try {
            const input = target.querySelector<HTMLInputElement>(selector);
            if (input && input.value) {
                input.value = input.value;
                change(input);
            }
        } catch (e) {
            if (e instanceof DOMException) {
                clearInterval(interval);
            } else {
                throw e;
            }
        }
    }, 50);
    return () => {
        clearInterval(interval);
    };
};

export const useAutocomplete = (ref: React.MutableRefObject<HTMLDivElement>, change: (target: HTMLInputElement) => void) => {
    useLayoutEffect(() => {
        let disposeCss: any, disposeWebkit: any;
        const interval = setInterval(() => {
            const {current: target} = ref;
            if (target) {
                clearInterval(interval);
                disposeCss = process(target, change, 'input:autofill');
                disposeWebkit = process(target, change, 'input:-webkit-autofill');
            }
        }, 50);
        return () => {
            disposeCss && disposeCss();
            disposeWebkit && disposeWebkit();
        };
    }, []);
};

export default useAutocomplete;
