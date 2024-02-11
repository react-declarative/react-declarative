import * as React from "react";

import { SxProps, alpha } from "@mui/material/styles";
import { makeStyles } from "../../../../styles";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import classNames from "../../../../utils/classNames";

const useStyles = makeStyles()((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        justifyContent: 'stretch',
        overflow: "hidden",
        background: theme.palette.background.paper,
    },
    label: {
        minHeight: '35px',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        background: theme.palette.mode === 'light'
            ? alpha('#000', 0.05)
            : theme.palette.background.paper,
        '& > *': {
            paddingLeft: '6px',
            opacity: 0.5,
        },
    },
    container: {
        position: 'relative',
        background: theme.palette.mode === 'light'
            ? theme.palette.background.paper
            : alpha('#000', 0.05),
        flex: 1,
    },
    content: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'stretch',
        '& > *': {
            flex: 1,
        },
    },
    passthrough: {
        display: 'block',
        width: '100%',
    },
}));

interface IContainerProps {
    passthrough?: boolean;
    label?: string;
    sx?: SxProps<any>;
    children?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}

export const Container = ({
    passthrough = false,
    children = null,
    className,
    style,
    sx,
    label,
}: IContainerProps) => {
    const { classes } = useStyles();

    if (passthrough) {
        return (
            <Box className={classNames(classes.passthrough, className)} sx={sx} style={style}>
                {children}
            </Box>
        );
    }

    return (
        <Paper className={classNames(classes.root, className)} sx={sx} style={style}>
            {!!label && (
                <Box className={classes.label}>
                    <Typography>
                        {label}
                    </Typography>
                </Box>
            )}
            <div className={classes.container}>
                <div className={classes.content}>
                    {children}
                </div>
            </div>
        </Paper>
    );
};

export default Container;
