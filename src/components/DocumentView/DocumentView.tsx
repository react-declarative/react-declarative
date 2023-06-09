import * as React from 'react';

import { makeStyles } from '../../styles';
import { darken } from '@mui/system';

import Box, { BoxProps } from '@mui/material/Box';
import Fab from '@mui/material/Fab';

import { AutoSizer } from '../AutoSizer';

import FullscreenIcon from '@mui/icons-material/Fullscreen';

import classNames from '../../utils/classNames';
import openBlank from '../../utils/openBlank';

interface IDocumentViewProps extends BoxProps {
    withFullScreen?: boolean;
    className?: string;
    style?: React.CSSProperties;
    src: string;
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
    fab: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        zIndex: 2,
    },
}));

export const DocumentView = ({
    withFullScreen = false,
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
            {withFullScreen && (
                <Fab
                    className={classes.fab}
                    color="primary"
                    size="small"
                    onClick={() => openBlank(src)}
                >
                    <FullscreenIcon />
                </Fab>
            )}
        </Box>
    );
};

export default DocumentView;
