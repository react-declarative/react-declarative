import * as React from 'react';

import { makeStyles } from '../../styles';

import Box, { BoxProps } from '@mui/material/Box';
import classNames from '../../utils/classNames';
import { darken } from '@mui/system';

interface IImageViewProps extends BoxProps {
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
}));

export const ImageView = ({
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
        </Box>
    );
};

export default ImageView;
