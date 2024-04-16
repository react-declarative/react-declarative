import * as React from 'react';

import { Box, Button } from '@mui/material';

import ChatController from '../helpers/ChatController';
import SelectActionRequest from '../model/SelectActionRequest';
import SelectActionResponse from '../model/SelectActionResponse';

/** 
 * @interface ISelectInputProps - Interface representing props for a select input component.
 * @property chatController - The chat controller associated with the select input.
 * @property actionRequest - The action request for the select input.
 */
interface ISelectInputProps {
  chatController: ChatController;
  actionRequest: SelectActionRequest;
}

/**
 * Represents a select input component.
 * @param props - The props object.
 * @param props.chatController - The chat controller object.
 * @param props.actionRequest - The action request object.
 * @returns React component.
 */
export const SelectInput = ({
  chatController,
  actionRequest,
}: ISelectInputProps) => {
  /**
   * Chat controller object.
   * @type {Object}
   */
  const chatCtl = chatController;

  /**
   * Sets the response with the selected option.
   * @param {string} value - The selected value.
   * @returns {void}
   * @throws {Error} Throws an error if the value is unknown.
   */
  const setResponse = React.useCallback(
    (value: string): void => {
      const option = actionRequest.options.find((o) => o.value === value);
      if (!option) {
        throw new Error(`Unknown value: ${value}`);
      }
      const res: SelectActionResponse = {
        type: 'select',
        value: option.text,
        option,
      };
      chatCtl.setActionResponse(actionRequest, res);
    },
    [actionRequest, chatCtl],
  );

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
          onClick={(e): void => setResponse(e.currentTarget.value)}
          variant="contained"
          color="primary"
        >
          {o.text}
        </Button>
      ))}
    </Box>
  );
}

export default SelectInput;
