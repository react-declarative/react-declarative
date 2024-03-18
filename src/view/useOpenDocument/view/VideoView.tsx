import * as React from 'react';
import { useEffect } from "react";

import Box from "@mui/material/Box";

import DownloadButton from "../components/DownloadButton";

import { IOutletModalProps } from '../../../components/OutletView';

/**
 * Renders a video player with a download button.
 *
 * @component
 * @param formState - The form state object.
 * @param formState.data.main.url - The URL of the video.
 * @param formState.data.main.fileName - The file name of the video.
 * @param [formState.data.main.placeholder] - The placeholder text for the video.
 * @param [formState.data.main.mime] - The MIME type of the video.
 * @returns The rendered VideoView component.
 */
export const VideoView = ({ formState }: IOutletModalProps) => {
  useEffect(
    () => () => {
      URL.revokeObjectURL(formState.data.main.url);
    },
    [],
  );

  return (
    <Box mt={1} mb={2}>
      <Box
        component="video"
        src={formState.data.main.url}
        controls
        muted
        autoPlay
        sx={{ height: 275, width: "100%", objectFit: "contain" }}
      />
      <DownloadButton
        primary={formState.data.main.fileName}
        secondary={formState.data.main.placeholder || formState.data.main.mime}
      />
    </Box>
  );
};

export default VideoView;
