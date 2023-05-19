import * as React from 'react';

import { useState, useEffect, useLayoutEffect, useRef } from 'react';

import Box, { BoxProps } from '@mui/material/Box';

declare class Sanitizer {
    constructor();
}

interface Element extends HTMLElement {
    setHTML: (...args: any) => any;
}

const sanitize = (html: string) => {
    const sanitizer = new Sanitizer();
    const element = document.createElement('div') as unknown as Element;
    element.setHTML(html, { sanitizer });
    return element.innerHTML;
};

interface IHtmlViewProps<T extends any = object> extends BoxProps {
    children: React.ReactNode;
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
                const text = sanitize(await handler(payload!));
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

export default HtmlView;
