import * as React from 'react';
import { useEffect } from 'react';

import { makeStyles } from "../../styles";

import Box, { BoxProps } from "@mui/material/Box";
import CircularProgress from '@mui/material/CircularProgress';

import classNames from '../../utils/classNames';

interface ILoaderViewProps extends Omit<BoxProps, keyof {
    children: never;
}> {
    onLoadStart?: () => void;
    onLoadEnd?: (isOk: boolean) => void;
    handler?: () => (Promise<void> | void);
    fallback?: (e: Error) => void;
    throwError?: boolean;
    size?: number | string;
}

const useStyles = makeStyles()({
    root: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
    },
});

export const LoaderView = ({
    className,
    onLoadStart,
    onLoadEnd,
    handler,
    fallback,
    throwError,
    size,
    ...otherProps
}: ILoaderViewProps) => {
    const { classes } = useStyles();

    useEffect(() => {
        if (!handler) {
            return;
        }
        const process = async () => {
            let isOk = true;
            try {
                onLoadStart && onLoadStart();
                await handler();
            } catch (e: any) {
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
    }, []);

    return (
        <Box
            className={classNames(className, classes.root)}
            {...otherProps}
        >
            <CircularProgress size={size} />
        </Box>
    );
};

export default LoaderView;
