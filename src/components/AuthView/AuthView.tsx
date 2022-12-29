import * as React from 'react';
import { useState } from 'react';

import { makeStyles } from '../../styles';
import { SxProps } from '@mui/material';

import LogoDefault from './components/Logo';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';

import PortalView from '../PortalView';
import RevealView from '../RevealView';
import ActionButton from '../ActionButton';
import One from '../One';

import { OneHandler } from '../../model/IOneProps';
import FieldType from '../../model/FieldType';
import IAnything from '../../model/IAnything';
import IField from '../../model/IField';

import useActualCallback from '../../hooks/useActualCallback';

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

interface IAuthViewProps<Data extends IAnything = IAnything, Payload = IAnything, Field = IField<Data, Payload>> {
    className?: string;
    style?: React.CSSProperties;
    sx?: SxProps;
    appName?: string;
    fields?: Field[];
    handler?: OneHandler<Data>;
    Logo?: React.ComponentType<any>;
    onAuth?: (data: Data) => (void | Promise<void>);
    onLoadStart?: () => void;
    onLoadEnd?: (isOk: boolean) => void;
    fallback?: (e: Error) => void;
    throwError?: boolean;
}

const defaultFields: IField[] = [
    {
        type: FieldType.Text,
        fieldRightMargin: '0',
        fieldBottomMargin: '1',
        title: 'Login',
        name: 'login',
        description: 'Your login',
        placeholder: 'tripolskypetr',
        isInvalid: ({ login }) => {
            if (!login) {
                return "Login should not be empty";
            }
            return null;
        },
    },
    {
        type: FieldType.Text,
        fieldRightMargin: '0',
        fieldBottomMargin: '0',
        title: 'Password',
        name: 'password',
        description: 'Your password',
        placeholder: 'password',
        inputType: 'password',
        isInvalid: ({ password }) => {
            if (!password) {
                return "Password should not be empty";
            }
            return null;
        },
    },
];

export const AuthView = <Data extends IAnything = IAnything, Payload = IAnything, Field = IField<Data, Payload>>({
    className,
    style,
    sx,
    appName = 'AppName',
    Logo = LogoDefault,
    fields = defaultFields as unknown as Field[],
    onLoadStart,
    onLoadEnd,
    throwError,
    handler,
    fallback,
    onAuth = () => undefined,
}: IAuthViewProps<Data, Payload, Field>) => {

    const { classes } = useStyles();

    const handleAuth = useActualCallback(async (data: Data | null) => {
        if (!data) {
            return;
        }
        let isOk = true;
        try {
            onLoadStart && onLoadStart();
            await onAuth(data);
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
    });

    const Content = () => {

        const [data, setData] = useState<Data | null>(null);

        const handleChange = (data: Data) => {
            setData(data);
        };
    
        const handleInvalid = () => {
            setData(null);
        };

        return (
            <>
                <One
                    sx={{ pt: 1, pb: 1 }}
                    handler={handler}
                    fields={fields}
                    onChange={handleChange}
                    onInvalid={handleInvalid}
                    onLoadStart={onLoadStart}
                    onLoadEnd={onLoadEnd}
                    fallback={fallback}
                />
                <ActionButton
                    disabled={!data}
                    variant="contained"
                    onClick={async () => await handleAuth(data)}
                    onLoadStart={onLoadStart}
                    onLoadEnd={onLoadEnd}
                    fallback={fallback}
                >
                    Sign in
                </ActionButton>
            </>
        );

    };

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
                            <Content />
                        </Stack>
                    </Paper>
                </RevealView>
            </Box>
        </PortalView>
    );
};

export default AuthView;
