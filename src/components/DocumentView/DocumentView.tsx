import * as React from 'react';

import { makeStyles } from '../../styles';

import Box, { BoxProps } from '@mui/material/Box';

import { AutoSizer } from '../AutoSizer';

import classNames from '../../utils/classNames';

interface IDocumentViewProps extends BoxProps {
    className?: string;
    style?: React.CSSProperties;
    src: string;
}

const useStyles = makeStyles()({
    root: {
        position: 'relative',
        overflow: 'hidden',
    },
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        minHeight: '100%',
        minWidth: '100%',
    },
    frame: {
        background: 'none transparent',
        border: '0px solid transparent',
    },
});

export const DocumentView = ({
    className,
    style,
    src,
    ...otherProps
}: IDocumentViewProps) => {
    const { classes } = useStyles();
    return (
        <Box className={classNames(className, classes.root)} {...otherProps}>
            <AutoSizer className={classes.container} payload={src}>
                {({
                    height,
                    width,
                    payload,
                }) => (
                    <iframe
                        className={classes.frame}
                        allowTransparency
                        src={payload}
                        height={height}
                        width={width}
                    />
                )}
            </AutoSizer>
        </Box>
    );
};

export default DocumentView;
