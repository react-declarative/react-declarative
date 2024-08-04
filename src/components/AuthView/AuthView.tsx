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

import IOneProps, { OneHandler } from '../../model/IOneProps';
import FieldType from '../../model/FieldType';
import IAnything from '../../model/IAnything';
import IField from '../../model/IField';

import useActualCallback from '../../hooks/useActualCallback';

import classNames from '../../utils/classNames';

/**
 * Returns the classes object for styling components.
 *
 * @returns The classes object.
 */
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
    beforeSubmit: {
        width: "100%",
        display: "flex",
        alignItems: "stretch",
        justifyContent: "stretch",
        "& > *": {
            flex: 1,
        },
        marginBottom: "-10px",
    },
    afterSubmit: {
        width: "100%",
        display: "flex",
        alignItems: "stretch",
        justifyContent: "stretch",
        "& > *": {
            flex: 1,
        },
        marginTop: "-10px",
    },
}));

/**
 * @interface IAuthViewProps
 * @template Data - The data type for the fields in the authentication view
 * @template Payload - The payload type for the authentication handler
 * @template Field - The field type for the authentication fields
 *
 * Represents the props for an authentication view component.
 */
interface IAuthViewProps<Data extends IAnything = IAnything, Payload = IAnything, Field = IField<Data, Payload>> {
    className?: string;
    style?: React.CSSProperties;
    sx?: SxProps<any>;
    appName?: string;
    fields?: Field[];
    handler?: OneHandler<Data, Payload>;
    isBaseline?: IOneProps["isBaseline"];
    isBaselineForRoot?: IOneProps["isBaselineForRoot"];
    Logo?: React.ComponentType<any>;
    onAuth?: (data: Data) => (void | Promise<void>);
    onLoadStart?: () => void;
    onLoadEnd?: (isOk: boolean) => void;
    fallback?: (e: Error) => void;
    throwError?: boolean;
    BeforeSubmit?: React.ComponentType<any>;
    AfterSubmit?: React.ComponentType<any>;
}

/**
 * Variable defaultFields contains an array of IField objects.
 *
 * @type {IField[]}
 */
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

/**
 * Represents the authentication view component.
 *
 * @template Data - The type of data.
 * @template Payload - The type of payload.
 * @template Field - The type of field.
 *
 * @param props - The props object.
 * @param props.className - The class name for the component.
 * @param props.style - The inline styles for the component.
 * @param props.sx - The sx prop for the component.
 * @param props.appName - The name of the app.
 * @param props.Logo - The component for the logo.
 * @param props.fields - The array of input fields.
 * @param [props.onLoadStart] - The callback function when the loading starts.
 * @param [props.onLoadEnd] - The callback function when the loading ends.
 * @param [props.throwError] - A boolean indicating whether to throw an error.
 * @param [props.handler] - The handler function.
 * @param [props.fallback] - The fallback function.
 * @param [props.onAuth] - The callback function for authentication.
 * @param [props.BeforeSubmit] - The component to render before submitting the form.
 * @param [props.AfterSubmit] - The component to render after submitting the form.
 *
 * @returns The AuthView component.
 */
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
    isBaseline,
    isBaselineForRoot,
    onAuth = () => undefined,
    BeforeSubmit,
    AfterSubmit,
}: IAuthViewProps<Data, Payload, Field>) => {

    const { classes } = useStyles();

    /**
     * Handles the authentication process.
     *
     * @param data - The data to be used for authentication.
     * @returns
     */
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

    /**
     * Represents a component that handles content and authentication.
     * @constructor
     * @returns The rendered content component.
     */
    const Content = () => {

        const [data, setData] = useState<Data | null>(null);

        /**
         * Function to handle change of data.
         *
         * @param data - The data to be handled.
         * @returns
         */
        const handleChange = (data: Data) => {
            setData(data);
        };

        /**
         * Sets the data to null in case of invalid input.
         *
         * @function handleInvalid
         * @returns
         */
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
                    isBaseline={isBaseline}
                    isBaselineForRoot={isBaselineForRoot}
                />
                {BeforeSubmit && (
                    <div className={classes.beforeSubmit}>
                        <BeforeSubmit
                            data={data}
                            onAuth={handleAuth}
                        />
                    </div>
                )}
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
                {AfterSubmit && (
                    <div className={classes.afterSubmit}>
                        <AfterSubmit
                            data={data}
                            onAuth={handleAuth} 
                        />
                    </div>
                )}
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
