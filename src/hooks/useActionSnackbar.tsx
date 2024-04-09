import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';

import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';

import randomString from '../utils/randomString';

import CloseIcon from '@mui/icons-material/Close';
import { ActionButton } from '../components';
import useSubject from './useSubject';
import useActualValue from './useActualValue';
import useRenderWaiter from './useRenderWaiter';

const HIDE_DURATION = 6000;

interface IParams {
  duration: number;
}

interface ISnack {
  message: string;
  button?: string;
}

export const useActionSnackbar = ({
  duration = HIDE_DURATION,
}: Partial<IParams>) => {

  const [element, setElement] = useState<React.ReactNode>(null);
  const element$ = useActualValue(element);

  const waitForRender = useRenderWaiter([element], 50);

  const resultSubject = useSubject<boolean>();

  useEffect(() => resultSubject.subscribe(() => {
    setElement(null);
  }), []);

  const renderSnack = useCallback((message: string, button: string) => (
    <Snackbar
      open
      key={randomString()}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      autoHideDuration={duration}
      onClose={() => {
        resultSubject.next(false);
      }}
      message={message}
      action={<React.Fragment>
        <ActionButton
          color="secondary"
          size="small"
          onClick={() => {
            resultSubject.next(true);
          }}
        >
          {button}
        </ActionButton>
        <IconButton
          size="small"
          aria-label="close"
          color="inherit"
          onClick={() => {
            resultSubject.next(false);
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </React.Fragment>}
    />
  ), []);

  return {
    render: () => <>{element}</>,
    pickData: useCallback(async ({
      message,
      button = "Open",
    }: ISnack) => {
      if (element$.current) {
        resultSubject.next(false);
        await waitForRender();
      }
      setElement(
        renderSnack(message, button)
      );
      return await resultSubject.toPromise();
    }, []),
  }
}

export default useActionSnackbar;
