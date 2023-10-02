import * as React from 'react';

import { useState, useEffect, useLayoutEffect, useRef } from 'react';

import Box, { BoxProps } from '@mui/material/Box';

interface IConfig {
    allowElements: string[];
    blockElements: string[];
    dropElements: string[];
    allowAttributes: Record<string, string[]>;
    dropAttributes: Record<string, string[]>;
    allowCustomElements: boolean;
    allowComments: boolean;
}

declare class Sanitizer {
    constructor(config?: Partial<IConfig>);
}

interface Element extends HTMLElement {
    setHTML: (...args: any) => any;
}

const sanitize = (html: string, config?: Partial<IConfig>) => {
    const sanitizer = new Sanitizer(config);
    const element = document.createElement('div') as unknown as Element;
    element.setHTML(html, { sanitizer });
    return element.innerHTML;
};

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

HtmlView.sanitize = sanitize;

export default HtmlView;
