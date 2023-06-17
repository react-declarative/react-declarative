import * as React from 'react';

import { makeStyles } from '../../styles';
import { darken } from '@mui/system';

import Box, { BoxProps } from '@mui/material/Box';

import { AutoSizer } from '../AutoSizer';

import ActionFab from '../ActionFab';

import FullscreenIcon from '@mui/icons-material/Fullscreen';
import DeleteIcon from '@mui/icons-material/Delete';

import classNames from '../../utils/classNames';
import openBlank from '../../utils/openBlank';

const FAB_SIZE = 48;

interface IDocumentViewProps extends BoxProps {
    withFullScreen?: boolean;
    withDelete?: boolean;
    className?: string;
    style?: React.CSSProperties;
    src: string;
    onFullScreenClick?: () => (Promise<void> | void);
    onDeleteClick?: () => (Promise<void> | void);
    onLoadStart?: () => void;
    onLoadEnd?: (isOk: boolean) => void;
    fallback?: (e: Error) => void;
    throwError?: boolean;
}

const useStyles = makeStyles()((theme) => ({
    root: {
        position: 'relative',
        overflow: 'hidden',
        background: theme.palette.mode === 'light'
            ? theme.palette.background.paper
            : darken(theme.palette.background.paper, 0.06),
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
    fabFullscreen: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        zIndex: 2,
    },
    fabDelete: {
        position: 'absolute',
        bottom: 10,
        right: 68,
        zIndex: 2,
    },
}));

export const DocumentView = ({
    withFullScreen = false,
    withDelete = false,
    className,
    style,
    src,
    onFullScreenClick = () => openBlank(src),
    onDeleteClick = () => undefined,
    onLoadStart,
    onLoadEnd,
    fallback,
    throwError = false,
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
            {withDelete && (
                <ActionFab
                    className={classes.fabDelete}
                    color="primary"
                    size={FAB_SIZE}
                    onClick={onDeleteClick}
                    onLoadStart={onLoadStart}
                    onLoadEnd={onLoadEnd}
                    fallback={fallback}
                    throwError={throwError}
                >
                    <DeleteIcon color="inherit" />
                </ActionFab>
            )}
            {withFullScreen && (
                <ActionFab
                    className={classes.fabFullscreen}
                    color="primary"
                    size={FAB_SIZE}
                    onClick={onFullScreenClick}
                    onLoadStart={onLoadStart}
                    onLoadEnd={onLoadEnd}
                    fallback={fallback}
                    throwError={throwError}
                >
                    <FullscreenIcon color="inherit" />
                </ActionFab>
            )}
        </Box>
    );
};

export default DocumentView;
