import * as React from "react";

import { SxProps, alpha } from "@mui/material/styles";
import { makeStyles } from "../../../../styles";

import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import classNames from "../../../../utils/classNames";

const useStyles = makeStyles()((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        justifyContent: 'stretch',
        height: "100%",
        width: "100%",
        overflow: "hidden",
        background: theme.palette.background.paper,
    },
    label: {
        minHeight: '35px',
        display: 'flex',
        alignItems: 'center',
        paddingLeft: '6px',
        opacity: 0.5,
        background: theme.palette.mode === 'light'
            ? alpha('#000', 0.2)
            : theme.palette.background.paper,
    },
    container: {
        position: 'relative',
        background: theme.palette.mode === 'light'
            ? theme.palette.background.paper
            : alpha('#000', 0.2),
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
    }
}));

interface IContainerProps {
    label?: string;
    sx?: SxProps;
    children?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}

export const Container = ({
    children = null,
    className,
    style,
    sx,
    label,
}: IContainerProps) => {
    const { classes } = useStyles();
    return (
        <Paper className={classNames(classes.root, className)} sx={sx} style={style}>
            {!!label && <Typography className={classes.label}>{label}</Typography>}
            <div className={classes.container}>
                <div className={classes.content}>
                    {children}
                </div>
            </div>
        </Paper>
    );
};

export default Container;
