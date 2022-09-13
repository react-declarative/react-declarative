import * as React from 'react';
import { useState, useCallback } from 'react';

import Snackbar from "@mui/material/Snackbar";

import randomString from '../../utils/randomString';
import { createStatelessProvider } from '../../utils/createProvider';

interface ISnack {
    key: string;
    message: string;
}

const AUTO_HIDE_DURATION = 5000;

interface ISnackProviderProps {
    children: React.ReactChild;
    delay?: number;
}

const [Provider, useSnack] = createStatelessProvider<(msg: string) => void>();

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
