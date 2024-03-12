import * as React from 'react';
import { useState, useCallback } from 'react';

import Snackbar from "@mui/material/Snackbar";

import randomString from '../../utils/randomString';
import createValueProvider from '../../utils/createValueProvider';

interface ISnack {
    key: string;
    message: string;
}

const AUTO_HIDE_DURATION = 5000;

interface ISnackProviderProps {
    children: React.ReactNode;
    delay?: number;
}

const [Provider, useSnack] = createValueProvider<(msg: string) => void>();

/**
 * SnackProvider is a component that provides snack notifications to its children.
 *
 * @param {Object} props - The props for SnackProvider component.
 * @param {ReactNode} props.children - The children components that will have access to snack notifications.
 * @param {number} [props.delay] - The delay for auto hiding the snack notifications.
 *
 * @returns {ReactNode} - The SnackProvider component.
 */
export const SnackProvider = ({
    children,
    delay = AUTO_HIDE_DURATION,
}: ISnackProviderProps) => {

    const [alerts, setAlerts] = useState<ISnack[]>([]);

    const getCurrent = useCallback(() => {
        if (alerts.length) {
            return alerts[0];
        } else {
            return null;
        }
    }, [alerts]);

    const hideCurrent = useCallback(() => {
        const { length } = alerts;
        if (length > 0) {
            setAlerts(alerts.slice(1, length));
        }
    }, [alerts]);

    const notify = (message: string) => setAlerts((alerts) => [
        ...alerts,
        {
            key: randomString(),
            message, 
        }
    ]);

    const current = getCurrent();

    return (
        <>
            {!!current && (
                <Snackbar
                    open
                    key={current.key}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    autoHideDuration={delay}
                    onClose={hideCurrent}
                    message={current.message}
                />
            )}
            <Provider payload={notify}>
                {children}
            </Provider>
        </>
    );

};

export { useSnack };

export default SnackProvider;
