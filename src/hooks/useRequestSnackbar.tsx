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
