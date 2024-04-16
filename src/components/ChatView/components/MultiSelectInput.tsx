import * as React from 'react';

import { Box, Button, Icon } from '@mui/material';

import ChatController from '../helpers/ChatController';
import MultiSelectActionRequest from '../model/MultiSelectActionRequest';
import MultiSelectActionResponse from '../model/MultiSelectActionResponse';

/** 
 * @interface IMultiSelectInputProps - Interface representing props for a multi-select input component.
 * @property chatController - The chat controller associated with the multi-select input.
 * @property actionRequest - The action request for the multi-select input.
 */
interface IMultiSelectInputProps {
  chatController: ChatController;
  actionRequest: MultiSelectActionRequest;
}

export const MultiSelectInput = ({
  chatController,
  actionRequest,
}: IMultiSelectInputProps) => {
  const chatCtl = chatController;
  const [values, setValues] = React.useState<string[]>([]);

  const handleSelect = React.useCallback(
    (value: string): void => {
      if (!values.includes(value)) {
        setValues([...values, value]);
      } else {
        setValues(values.filter((v) => v !== value));
      }
    },
    [values],
  );

  const setResponse = React.useCallback((): void => {
    const options = actionRequest.options.filter((o) =>
      values.includes(o.value),
    );

    const res: MultiSelectActionResponse = {
      type: 'multi-select',
      value: options.map((o) => o.text).toString(),
      options,
    };
    chatCtl.setActionResponse(actionRequest, res);
    setValues([]);
  }, [actionRequest, chatCtl, values]);

  const sendButtonText = actionRequest.sendButtonText
    ? actionRequest.sendButtonText
    : 'Send';

  return (
    <Box
      sx={{
        flex: '1 1 auto',
        display: 'flex',
        flexDirection: 'column',
        '& > *': {
          flex: '0 0 auto',
          maxWidth: '100%',
        },
        '& > * + *': {
          mt: 1,
        },
      }}
    >
      {actionRequest.options.map((o) => (
        <Button
          key={actionRequest.options.indexOf(o)}
          type="button"
          value={o.value}
          onClick={(e): void => handleSelect(e.currentTarget.value)}
          variant={!values.includes(o.value) ? 'outlined' : 'contained'}
          color="primary"
        >
          {o.text}
        </Button>
      ))}
      <Button
        type="button"
        onClick={setResponse}
        disabled={values.length === 0}
        variant="contained"
        color="primary"
        startIcon={<Icon>send</Icon>}
      >
        {sendButtonText}
      </Button>
    </Box>
  );
}

export default MultiSelectInput;
