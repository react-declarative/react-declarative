import * as React from 'react';

import { makeStyles } from '../../styles';
import { darken } from '@mui/system';

import Box, { BoxProps } from '@mui/material/Box';
import Fab from '@mui/material/Fab';

import FullscreenIcon from '@mui/icons-material/Fullscreen';

import classNames from '../../utils/classNames';
import openBlank from '../../utils/openBlank';

interface IImageViewProps extends BoxProps {
    withFullScreen?: boolean;
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
        height: '100%',
        width: '100%',
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'stretch',
    },
    content: {
        objectFit: 'contain',
        margin: '6px',
        flex: 1,
    },
    fab: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        zIndex: 2,
    },
}));

export const ImageView = ({
    withFullScreen = false,
    className,
    src,
    ...otherProps
}: IImageViewProps) => {
    const { classes } = useStyles();
    return (
        <Box className={classNames(className, classes.root)} {...otherProps}>
            <div className={classes.container}>
                <img
                    className={classes.content}
                    crossOrigin="anonymous"
                    loading="lazy"
                    src={src}
                />
            </div>
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

export default ImageView;
