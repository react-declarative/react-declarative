import * as React from 'react';

import { Box, Button, Icon, TextField } from '@mui/material';

import ChatController from '../helpers/ChatController';
import TextActionRequest from '../model/TextActionRequest';
import TextActionResponse from '../model/TextActionResponse';

/** 
 * @interface ITextInputProps - Interface representing props for a text input component.
 * @property chatController - The chat controller associated with the text input.
 * @property actionRequest - The action request for the text input.
 */
interface ITextInputProps {
  chatController: ChatController;
  actionRequest: TextActionRequest;
}

export const TextInput = ({
  chatController,
  actionRequest,
}: ITextInputProps) => {
  const chatCtl = chatController;
  const [value, setValue] = React.useState(actionRequest.defaultValue);

  const setResponse = React.useCallback((): void => {
    if (value) {
      const res: TextActionResponse = { type: 'text', value };
      chatCtl.setActionResponse(actionRequest, res);
      setValue('');
    }
  }, [actionRequest, chatCtl, value]);

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
      if (e.nativeEvent.isComposing) {
        return;
      }

      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        setResponse();
      }
    },
    [setResponse],
  );

  const sendButtonText = actionRequest.sendButtonText
    ? actionRequest.sendButtonText
    : 'Send';

  return (
    <Box
      sx={{
        flex: '1 1 auto',
        display: 'flex',
        '& > *': {
          flex: '1 1 auto',
          minWidth: 0,
        },
        '& > * + *': {
          ml: 1,
        },
        '& :last-child': {
          flex: '0 1 auto',
        },
      }}
    >
      <TextField
        placeholder={actionRequest.placeholder}
        value={value}
        onChange={(e): void => setValue(e.target.value)}
        autoFocus
        multiline
        inputProps={{ onKeyDown: handleKeyDown }}
        variant="outlined"
        maxRows={10}
      />
      <Button
        type="button"
        onClick={setResponse}
        disabled={!value}
        variant="contained"
        color="primary"
        startIcon={<Icon>send</Icon>}
      >
        {sendButtonText}
      </Button>
    </Box>
  );
}

export default TextInput;
