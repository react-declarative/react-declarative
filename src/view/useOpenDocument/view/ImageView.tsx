import * as React from 'react';
import { useEffect } from "react";

import Box from "@mui/material/Box";

import DownloadButton from "../components/DownloadButton";

import { IOutletModalProps } from '../../../components/OutletView';

/**
 * Represents an image view component.
 *
 * @component
 * @param formState - The state of the form.
 * @param formState.data.main.url - The URL of the main image.
 * @param formState.data.main.fileName - The filename of the main image.
 * @param formState.data.main.placeholder - The placeholder of the main image.
 * @param formState.data.main.mime - The MIME type of the main image.
 * @returns - The image view component.
 */
export const ImageView = ({ formState }: IOutletModalProps) => {
  useEffect(
    () => () => {
      URL.revokeObjectURL(formState.data.main.url);
    },
    [],
  );

  return (
    <Box mt={1} mb={2}>
      <Box
        component="img"
        src={formState.data.main.url}
        sx={{ height: 275, width: "100%", objectFit: "contain" }}
      />
      <DownloadButton
        primary={formState.data.main.fileName}
        secondary={formState.data.main.placeholder || formState.data.main.mime}
      />
    </Box>
  );
};

export default ImageView;
