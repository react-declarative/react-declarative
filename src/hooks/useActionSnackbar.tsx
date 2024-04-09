import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';

import ActionButton, { usePreventAction } from '../components/ActionButton';

import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';

import randomString from '../utils/randomString';

import useSubject from './useSubject';
import useSingleton from './useSingleton';
import useActualValue from './useActualValue';
import useRenderWaiter from './useRenderWaiter';

import TSubject from '../model/TSubject';

const HIDE_DURATION = 6000;

/**
 * Represents a set of parameters for a specific task.
 *
 * @interface IParams
 */
interface IParams {
  duration: number;
  onResult: (result: boolean) => void;
}

/**
 * Represents a snack notification.
 *
 * @interface
 */
interface ISnack {
  message: string;
  button?: string;
}

/**
 * Represents the properties required for a Snack.
 * @interface
 */
interface ISnackProps extends ISnack {
  resultSubject: TSubject<boolean>;
  duration: number;
}

/**
 * Represents a snack component.
 *
 * @typedef ISnackProps
 * @property resultSubject - The subject that emits the result of the snack action.
 * @property duration - The duration for which the snack should be displayed.
 * @property message - The message to be displayed in the snack.
 * @property [button="Open"] - The label for the action button in the snack.
 */
const Snack = ({
  resultSubject,
  duration,
  message,
  button = "Open",
}: ISnackProps) => {
  const { loading, handleLoadStart, handleLoadEnd } = usePreventAction();
  const key = useSingleton(randomString);
  return (
    <Snackbar
      open
      key={key}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      autoHideDuration={duration}
      onClose={() => false}
      message={message}
      action={(
        <Stack direction="row" gap={1} mr={1} alignItems="center">
          <ActionButton
            variant="contained"
            disabled={loading}
            onLoadStart={handleLoadStart}
            onLoadEnd={handleLoadEnd}
            color="primary"
            size="small"
            onClick={async () => {
              await resultSubject.next(true);
            }}
          >
            {button}
          </ActionButton>
          <ActionButton
            variant="outlined"
            disabled={loading}
            onLoadStart={handleLoadStart}
            onLoadEnd={handleLoadEnd}
            color="primary"
            size="small"
            onClick={async () => {
              await resultSubject.next(false);
            }}
          >
            {button}
          </ActionButton>
        </Stack>
      )}
    />
  );
}

/**
 * A hook for displaying a snackbar with an action button.
 *
 * @param [options] - Optional parameters for the snackbar.
 * @param [options.duration] - The duration in milliseconds for which the snackbar is displayed.
 * @returns An object with two methods:
 *   - render: A method that renders the snackbar.
 *   - pickData: A method that displays the snackbar and waits for the user response.
 */
export const useActionSnackbar = ({
  duration = HIDE_DURATION,
  onResult = () => {},
}: Partial<IParams> = {}) => {

  const [element, setElement] = useState<React.ReactNode>(null);
  const element$ = useActualValue(element);

  const waitForRender = useRenderWaiter([element], 50);

  const resultSubject = useSubject<boolean>();

  useEffect(() => resultSubject.subscribe(() => {
    setElement(null);
  }), []);

  useEffect(() => resultSubject.subscribe(onResult), []);

  /**
   * Render a snack bar with a message and button.
   *
   * @param message - The message to be displayed in the snack bar.
   * @param button - The label for the button in the snack bar.
   * @returns - The rendered snack bar component.
   */
  const renderSnack = useCallback((message: string, button: string) => (
    <Snack
      message={message}
      button={button}
      duration={duration}
      resultSubject={resultSubject}
    />
  ), []);

  return {
    resultSubject,
    render: () => <>{element}</>,
    pickData: useCallback(async ({
      message,
      button = "Open",
    }: ISnack) => {
      if (element$.current) {
        await resultSubject.next(false);
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
