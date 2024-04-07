import * as React from 'react';

import { useState, useEffect, useLayoutEffect, useRef } from 'react';

import Box, { BoxProps } from '@mui/material/Box';

/**
 * Represents the configuration settings for the application.
 */
interface IConfig {
    allowElements: string[];
    blockElements: string[];
    dropElements: string[];
    allowAttributes: Record<string, string[]>;
    dropAttributes: Record<string, string[]>;
    allowCustomElements: boolean;
    allowComments: boolean;
}

/**
 * Class representing a Sanitizer.
 * @class
 */
declare class Sanitizer {
    constructor(config?: Partial<IConfig>);
}

declare global {
    interface Window {
        /**
         * Represents a Sanitizer class.
         *
         * @typedef {function} Sanitizer
         * @param params - The parameters required to construct a Sanitizer object.
         * @constructor
         */
        Sanitizer: new (...params: ConstructorParameters<typeof Sanitizer>) => Sanitizer;
    }    
}

/**
 * Represents an element that extends HTMLElement and provides a setHTML method.
 * @interface
 * @extends HTMLElement
 */
interface Element extends HTMLElement {
    setHTML: (...args: any) => any;
}

/**
 * Sanitizes an HTML string using a sanitizer object. If a sanitizer object is not available, it returns the input HTML string as is.
 *
 * @param html - The HTML string to sanitize.
 * @param [config] - Optional configuration object for the sanitizer.
 * @returns - The sanitized HTML string or the input HTML string if no sanitizer is available.
 */
const sanitize = (html: string, config?: Partial<IConfig>) => {
    if ('Sanitizer' in window) {
        const sanitizer = new window.Sanitizer(config);
        const element = document.createElement('div') as unknown as Element;
        element.setHTML(html, { sanitizer });
        return element.innerHTML;
    }
    return html;
};

/**
 * Props for the HtmlView component.
 *
 * @template T - The type of the payload data.
 */
interface IHtmlViewProps<T extends any = object> extends BoxProps {
    children?: React.ReactNode;
    config?: Partial<IConfig>;
    handler: (p: T) => (string | Promise<string>);
    fallback?: (e: Error) => void;
    onLoadStart?: () => void;
    onLoadEnd?: (isOk: boolean) => void;
    payload?: T;
    deps?: any[];
    throwError?: boolean;
}

/**
 * Represents an HTML view component.
 * @typedef HtmlView
 * @param children - The children elements.
 * @param config - The configuration object.
 * @param handler - The handler function.
 * @param fallback - The fallback function.
 * @param onLoadStart - The onLoadStart callback function.
 * @param onLoadEnd - The onLoadEnd callback function.
 * @param payload - The payload.
 * @param deps - The dependencies.
 * @param throwError - Indicates whether to throw an error if encountered.
 * @param otherProps - Other additional props.
 * @returns The HTML view component.
 */
export const HtmlView = ({
    children = null,
    config,
    handler,
    fallback,
    onLoadStart,
    onLoadEnd,
    payload,
    deps = [],
    throwError,
    ...otherProps
}: IHtmlViewProps) => {
    const [html, setHtml] = useState<string>(undefined as never);
    const isMounted = useRef(true);
    useLayoutEffect(() => () => {
      isMounted.current = false;
    }, []);
    useEffect(() => {
        /**
         * Executes the process asynchronously.
         *
         * @async
         * @function process
         * @returns A promise that resolves once the process is complete.
         */
        const process = async () => {
            let isOk = true;
            onLoadStart && onLoadStart();
            try {
                const text = sanitize(await handler(payload!), config);
                isMounted.current && setHtml(text);
            } catch (e) {
                isOk = false;
                if (!throwError) {
                    fallback && fallback(e as Error);
                } else {
                    throw e;
                }
            } finally {
                onLoadEnd && onLoadEnd(isOk);
            }
        };
        process();
    }, [payload, ...deps]);
    return (
        <>
            {html ? (
                <Box
                    {...otherProps}
                    dangerouslySetInnerHTML={{__html: html}}
                />
            ) : children}
        </>
    );
};

const sanitizeStr: typeof sanitize = (...args) => {
    return sanitize(...args).trim();
};

HtmlView.sanitize = sanitizeStr;

export default HtmlView;
