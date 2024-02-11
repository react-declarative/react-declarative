import * as React from 'react';

import { makeStyles } from '../../styles';
import { SxProps } from '@mui/material';

import LogoDefault from './components/Logo';

import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

import PortalView from '../PortalView';
import RevealView from '../RevealView';

import classNames from '../../utils/classNames';

const useStyles = makeStyles()((theme) => ({
    root: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        background: theme.palette.background.default,
        height: '100%',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        gap: 15,
        padding: 15,
    },
    container: {
        minWidth: 375,
        maxWidth: 375,
        padding: 15,
    },
    reveal: {
        width: 'unset !important',
    },
}));

interface IErrorViewProps {
    appName?: string;
    Logo?: React.ComponentType<any>;
    buttonLabel?: React.ReactNode;
    contentLabel?: React.ReactNode;
    onButtonClick?: () => void;
    className?: string;
    style?: React.CSSProperties;
    sx?: SxProps<any>;
}

const handleReload = () => {
    const { href, origin, protocol } = window.location;
    if (protocol !== 'file:') {
        const url = new URL(href, origin);
        url.pathname = '/';
        url.search = '';
        url.hash = '';
        window.location.href = url.toString();
    } else {
        window.location.reload();
    }
};

const contentDefault = (
    <>
        It looks like this app finished with uncaught exception<br />
        Please reload this page and try again
    </>
);

export const ErrorView = ({
    appName = 'AppName',
    Logo = LogoDefault,
    className,
    style,
    sx,
    buttonLabel = "Reload page",
    contentLabel = contentDefault,
    onButtonClick = handleReload,
}: IErrorViewProps) => {
    const { classes } = useStyles();
    return (
        <PortalView>
            <Box
                className={classNames(classes.root, className)}
                style={style}
                sx={sx}
            >
                <RevealView className={classes.reveal}>
                    <Paper className={classes.container}>
                        <Stack direction='column' gap="15px">
                            <Logo appName={appName} />
                            <span>
                                {contentLabel}
                            </span>
                            <Button
                                variant="contained"
                                onClick={onButtonClick}
                            >
                                {buttonLabel}
                            </Button>
                        </Stack>
                    </Paper>
                </RevealView>
            </Box>
        </PortalView>
    );
};

export default ErrorView;
