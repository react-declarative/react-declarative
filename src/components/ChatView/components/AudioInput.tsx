import * as React from 'react';

import { Box, Button } from '@mui/material';

import SendIcon from "@mui/icons-material/Send";
import StopIcon from "@mui/icons-material/Stop";
import KeyboardVoiceIcon from "@mui/icons-material/KeyboardVoice";

import ChatController from '../helpers/ChatController';
import AudioActionRequest from '../model/AudioActionRequest';
import AudioActionResponse from '../model/AudioActionResponse';
import AudioMediaRecorder from '../helpers/AudioMediaRecorder';

/** 
 * @interface IAudioInputProps - Interface representing props for an audio input component.
 * @property chatController - The chat controller associated with the audio input.
 * @property actionRequest - The action request for the audio input.
 */
interface IAudioInputProps {
  chatController: ChatController;
  actionRequest: AudioActionRequest;
}

/**
 * Represents an audio input component.
 * @param props - The props object.
 * @param props.chatController - The chat controller object.
 * @param props.actionRequest - The action request object.
 * @returns React component.
 */
export const AudioInput = ({
  chatController,
  actionRequest,
}: IAudioInputProps) => {
  /**
   * Chat controller object.
   * @type {Object}
   */
  const chatCtl = chatController;

  /**
   * State for audio recording.
   * @type {[AudioMediaRecorder, function]} Array containing the audio recorder instance and the setter function.
   */
  const [audioRec] = React.useState(AudioMediaRecorder.getInstance());

  /**
   * State for recording status.
   * @type {[boolean, function]} Array containing the boolean value of whether recording is stopped and the setter function.
   */
  const [stopped, setStopped] = React.useState(true);

  /**
   * State for audio blob.
   * @type {[Blob | undefined, function]} Array containing the audio blob and the setter function.
   */
  const [audio, setAudio] = React.useState<Blob | undefined>();

  /**
   * Handles errors during audio recording.
   * @param {Error} error - The error object.
   * @returns {void}
   */
  const handleError = React.useCallback(
    (error: Error): void => {
      const value: AudioActionResponse = {
        type: 'audio',
        value: error.message,
        error,
      };
      chatCtl.setActionResponse(actionRequest, value);
    },
    [actionRequest, chatCtl],
  );

  /**
   * Handles the start of audio recording.
   * @returns {Promise<void>}
   */
  const handleStart = React.useCallback(async (): Promise<void> => {
    try {
      await audioRec.initialize();
      await audioRec.startRecord();
      setStopped(false);
    } catch (error) {
      handleError(error as Error);
    }
  }, [audioRec, handleError]);

  /**
   * Handles the stop of audio recording.
   * @returns {Promise<void>}
   */
  const handleStop = React.useCallback(async (): Promise<void> => {
    try {
      const a = await audioRec.stopRecord();
      setAudio(a);
      setStopped(true);
    } catch (error) {
      handleError(error as Error);
    }
  }, [audioRec, handleError]);

  /**
   * Sends the audio response.
   * @returns {void}
   */
  const sendResponse = React.useCallback((): void => {
    if (audio) {
      const value: AudioActionResponse = {
        type: 'audio',
        value: 'Audio',
        audio,
      };
      chatCtl.setActionResponse(actionRequest, value);
      setAudio(undefined);
    }
  }, [actionRequest, audio, chatCtl]);

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
      }}
    >
      {stopped && (
        <Button
          type="button"
          onClick={handleStart}
          disabled={!stopped}
          variant="contained"
          color="primary"
          startIcon={<KeyboardVoiceIcon />}
        >
          Rec start
        </Button>
      )}
      {!stopped && (
        <Button
          type="button"
          onClick={handleStop}
          disabled={stopped}
          variant="contained"
          color="primary"
          startIcon={<StopIcon />}
        >
          Rec stop
        </Button>
      )}
      <Button
        type="button"
        onClick={sendResponse}
        disabled={!audio}
        variant="contained"
        color="primary"
        startIcon={<SendIcon />}
      >
        {sendButtonText}
      </Button>
    </Box>
  );
}

export default AudioInput;
