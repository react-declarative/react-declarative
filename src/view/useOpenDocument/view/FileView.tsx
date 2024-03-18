import * as React from 'react';
import { useEffect } from "react";

import Box from "@mui/material/Box";

import DownloadButton from "../components/DownloadButton";

import { IOutletModalProps } from '../../../components/OutletView';

/**
 * React component that displays a file view.
 *
 * @param formState - The form state.
 * @return The file view component.
 */
export const FileView = ({ formState }: IOutletModalProps) => {
  useEffect(
    () => () => {
      URL.revokeObjectURL(formState.data.main.url);
    },
    [],
  );
  return (
    <Box mt={1} mb={2}>
      <DownloadButton
        primary={formState.data.main.fileName}
        secondary={formState.data.main.placeholder || formState.data.main.mime}
      />
    </Box>
  );
};

export default FileView;
