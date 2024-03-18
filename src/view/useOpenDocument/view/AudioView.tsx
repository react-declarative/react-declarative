import * as React from 'react';
import { useEffect } from "react";

import Box from "@mui/material/Box";

import DownloadButton from "../components/DownloadButton";

import { IOutletModalProps } from '../../../components/OutletView';

/**
 * Represents an AudioView component.
 *
 * @component
 * @param props - The component props.
 * @param props.formState - The form state object.
 * @param props.formState.data - The data object within the form state.
 * @param props.formState.data.main - The main audio data within the form state.
 * @param props.formState.data.main.url - The URL of the main audio.
 * @param props.formState.data.main.fileName - The file name of the main audio.
 * @param [props.formState.data.main.placeholder] - The placeholder of the main audio.
 * @param [props.formState.data.main.mime] - The MIME type of the main audio.
 * @returns The rendered AudioView component.
 */
export const AudioView = ({ formState }: IOutletModalProps) => {
  useEffect(
    () => () => {
      URL.revokeObjectURL(formState.data.main.url);
    },
    [],
  );

  return (
    <Box mt={1} mb={2}>
      <Box
        component="audio"
        src={formState.data.main.url}
        controls
        autoPlay
        sx={{ width: "100%" }}
      />
      <DownloadButton
        primary={formState.data.main.fileName}
        secondary={formState.data.main.placeholder || formState.data.main.mime}
      />
    </Box>
  );
};

export default AudioView;
