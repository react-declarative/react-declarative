import * as React from 'react';

import {
  Box,
  Button,
  Divider,
  Icon,
  List,
  ListItem,
  ListItemIcon,
  Typography,
} from '@mui/material';

import ChatController from '../helpers/ChatController';
import FileActionRequest from '../model/FileActionRequest';
import FileActionResponse from '../model/FileActionResponse';

/** 
 * @interface IFileInputProps - Interface representing props for a file input component.
 * @property chatController - The chat controller associated with the file input.
 * @property actionRequest - The action request for the file input.
 */
interface IFileInputProps {
  chatController: ChatController;
  actionRequest: FileActionRequest;
}

/**
 * Represents a file input component.
 * @param props - The props object.
 * @param props.chatController - The chat controller object.
 * @param props.actionRequest - The action request object.
 * @returns React component.
 */
export const FileInput = ({
  chatController,
  actionRequest,
}: IFileInputProps) => {
  /**
   * Chat controller object.
   * @type {Object}
   */
  const chatCtl = chatController;

  /**
   * State for files.
   * @type {[File[], function]} Array containing the files array and the setter function.
   */
  const [files, setFiles] = React.useState<File[]>([]);

  /**
   * Handles file change.
   * @param {FileList | null} fileList - The list of files.
   * @returns {void}
   */
  const handleFileChange = React.useCallback(
    (fileList: FileList | null): void => {
      // Convert FileList to File[]
      const fileArray: File[] = [];
      if (fileList) {
        for (let i = 0; i < fileList.length; i += 1) {
          const file = fileList.item(i);
          if (file) {
            fileArray.push(file);
          }
        }
      }
      setFiles(fileArray);
    },
    [],
  );

  /**
   * Sets the response with selected files.
   * @returns {void}
   */
  const setResponse = React.useCallback((): void => {
    if (files.length > 0) {
      const value = files.map((f) => f.name).toString();
      const res: FileActionResponse = { type: 'file', value, files };
      chatCtl.setActionResponse(actionRequest, res);
    }
  }, [actionRequest, chatCtl, files]);

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
        maxWidth: '100%',
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
      <List>
        {files.map((f) => (
          <div key={`${f.name}-${f.size}`}>
            <Divider />
            <ListItem key={f.name}>
              <ListItemIcon>
                <Icon>attach_file</Icon>
              </ListItemIcon>
              <Typography style={{ overflowWrap: 'break-word', minWidth: 0 }}>
                {f.name}
              </Typography>
              {/* <ListItemText primary={f.name} /> */}
            </ListItem>
          </div>
        ))}
      </List>
      <Box
        sx={{
          display: 'flex',
          '& > *': {
            flex: '1 1 auto',
            minWidth: 0,
          },
          '& > * + *': {
            ml: 1,
          },
        }}
      >
        <Button
          disabled={false}
          component="label"
          variant="contained"
          color="primary"
          startIcon={<Icon>folder</Icon>}
        >
          Select file
          <input
            type="file"
            accept={actionRequest.accept}
            multiple={actionRequest.multiple}
            onChange={(e): void => handleFileChange(e.target.files)}
            style={{ display: 'none' }}
          />
        </Button>
        <Button
          type="button"
          onClick={setResponse}
          disabled={files.length === 0}
          variant="contained"
          color="primary"
          startIcon={<Icon>send</Icon>}
        >
          {sendButtonText}
        </Button>
      </Box>
    </Box>
  );
}

export default FileInput;
