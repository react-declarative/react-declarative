import * as React from 'react';
import { useState, useCallback } from 'react';

import Snackbar from '@mui/material/Snackbar';

import randomString from '../utils/randomString';

import useChange from "./useChange";
import useSubject from './useSubject';
import useActualCallback from './useActualCallback';

const AUTO_HIDE_DURATION = 5000;

export interface IParams {
  noSnackOnOk?: boolean;
  message?: string;
  loading: boolean | null;
  error: string | null;
  delay?: number;
  onClose?: (isOk: boolean) => void;
}

/**
 * Represents a custom hook to display a snackbar with request feedback.
 *
 * @param options - The options for the snackbar.
 * @param options.message - The message to display in the snackbar. Default: "Client update successful".
 * @param options.noSnackOnOk - Whether to not display a snackbar when the request is successful. Default: false.
 * @param options.loading - Whether the request is still loading.
 * @param options.error - The error message, if any, to display in the snackbar.
 * @param options.delay - The duration for which the snackbar should be displayed. Default: AUTO_HIDE_DURATION.
 * @param options.onClose - The callback function to execute when the snackbar is closed. Default: () => undefined.
 *
 * @returns - The snackbar hook object.
 * @returns beginWatch - The function to start watching for changes in the loading and error states.
 * @returns resetWatcher - The function to reset the watch state.
 * @returns stopWatch - The function to stop watching for changes.
 * @returns render - The function to render the snackbar element.
 */
export const useRequestSnackbar = ({
  message = "Client update successful",
  noSnackOnOk = false,
  loading,
  error,
  delay = AUTO_HIDE_DURATION,
  onClose = () => undefined,
}: IParams) => {

  const [element, setElement] = useState<React.ReactNode>(null);

  const closeSubject = useSubject<void>();

  const handleClose = () => {
    closeSubject.next();
    setElement(null);
  };

  const onClose$ = useActualCallback(onClose);
  
  const setSnackbar = (message: string) => setElement(() => (
    <Snackbar
      open
      key={randomString()}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      autoHideDuration={delay}
      onClose={handleClose}
      message={message}
    />
  ));

  const {
    beginWatch,
    resetWatcher,
    stopWatch,
  } = useChange(() => {
    if (error) {
      setSnackbar(error);
      closeSubject.once(() => onClose$(false));
    }
    if (!error && !loading) {
      if (!noSnackOnOk) {
        setSnackbar(message);
        closeSubject.once(() => onClose$(true));
      } else {
        onClose$(true);
      }
    }
  }, [loading, error]);

  const render = useCallback(() => (
    <>
      {element}
    </>
  ), [element]);

  return {
    beginWatch,
    resetWatcher,
    stopWatch,
    render,
  };
};

export default useRequestSnackbar;
