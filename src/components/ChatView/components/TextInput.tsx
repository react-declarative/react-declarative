import * as React from 'react';

import { Box, Button, TextField } from '@mui/material';

import SendIcon from "@mui/icons-material/Send";

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

/**
 * Represents a text input component.
 * @param props - The props object.
 * @param props.chatController - The chat controller object.
 * @param props.actionRequest - The action request object.
 * @returns React component.
 */
export const TextInput = ({
  chatController,
  actionRequest,
}: ITextInputProps) => {
  /**
   * Chat controller object.
   * @type {Object}
   */
  const chatCtl = chatController;

  /**
   * State for input value.
   * @type {[string, function]} Array containing the input value and the setter function.
   */
  const [value, setValue] = React.useState(actionRequest.defaultValue);

  /**
   * Sets the response with the entered text.
   * @returns {void}
   */
  const setResponse = React.useCallback((): void => {
    if (value) {
      const res: TextActionResponse = { type: 'text', value };
      chatCtl.setActionResponse(actionRequest, res);
      setValue('');
    }
  }, [actionRequest, chatCtl, value]);

  /**
   * Handles key down events.
   * @param {React.KeyboardEvent<HTMLTextAreaElement>} e - The keyboard event object.
   * @returns {void}
   */
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

  /**
   * Text for the send button.
   * @type {string}
   */
  const sendButtonText = actionRequest.sendButtonText
    ? actionRequest.sendButtonText
    : 'Send';

  return (
    <Box
      sx={{
        flex: '1 1 auto',
        display: 'flex',
        gap: 1,
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
        maxRows={1}
        minRows={1}
      />
      <Button
        type="button"
        onClick={setResponse}
        disabled={!value}
        variant="contained"
        color="primary"
        startIcon={<SendIcon />}
      >
        {sendButtonText}
      </Button>
    </Box>
  );
}

export default TextInput;
