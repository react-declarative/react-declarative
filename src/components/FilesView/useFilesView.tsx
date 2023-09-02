import * as React from 'react';
import { useEffect, useState } from "react";

import { makeStyles } from "../../styles";

import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import clsx from "clsx";
import useOneArray from '../../hooks/useOneArray';
import FilesView, { IFilesViewProps } from './FilesView';
import ActionButton from '../ActionButton';

const useStyles = makeStyles()((theme) => ({
  root: {
    position: "absolute",
    padding: 20,
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    justifyContent: "stretch",
    transform: "translate(-50%, -50%)",
    backgroundColor: theme.palette.background.paper,
    borderRadius: 5,
    gap: 5,
  },
  small: {
    top: "40%",
    left: "50%",
    maxHeight: "80%",
    width: 500,
  },
  large: {
    top: "50%",
    left: "50%",
    width: "calc(100vw - 50px)",
    height: "calc(100vh - 50px)",
  },
  content: {
    flex: 1,
    overflowY: "auto",
    paddingTop: theme.spacing(1),
  },
  title: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 15,
    color: theme.palette.text.primary,
  },
  submit: {
    marginTop: 15,
  },
  disabled: {
    opacity: 0.5,
    pointerEvents: "none",
  },
}));

interface IParams {
  data?: string[] | null;
  fullScreen?: boolean;
  submitLabel?: string;
  onSubmit?: (data: string[]) => void
  onChange?: (data: string[]) => void;
  tr?: IFilesViewProps['tr'];
  fallback?: IFilesViewProps['fallback'];
  onLoadStart?: IFilesViewProps['onLoadStart'];
  onLoadEnd?: IFilesViewProps['onLoadEnd'];
  onClick?: IFilesViewProps['onClick'];
  onUpload?: IFilesViewProps['onUpload'];
}

export const useFilesView = ({
  data = null,
  fullScreen,
  submitLabel = "Save",
  onChange,
  onSubmit,
  tr,
  fallback,
  onLoadStart,
  onLoadEnd,
  onClick,
  onUpload,
}: IParams) => {
  const [open, setOpen] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [loading, setLoading] = useState(0);
  const [files, setFiles] = useOneArray(data);

  useEffect(() => {
    setFiles(data);
  }, [data]);

  const { classes } = useStyles();

  const handleChange = (files: string[]) => {
    setFiles(files);
    setDirty(true);
    onChange && onChange(data ||[]);
  };

  const handleClose = () => {
    setFiles(data);
    setOpen(false);
    setDirty(false);
  };

  const handleSubmit = async () => {
    if (onSubmit) {
      await onSubmit(files);
    }
    setOpen(false);
    setDirty(false);
  };

  const handleLoadStart = () => {
    setLoading((loading) => loading + 1);
    onLoadStart && onLoadStart();
  };

  const handleLoadEnd = (isOk: boolean) => {
    setLoading((loading) => loading - 1);
    onLoadEnd && onLoadEnd(isOk);
  };

  const render = () => (
    <Modal open={open} onClose={handleClose}>
      <Box
        className={clsx(classes.root, {
          [classes.small]: !fullScreen,
          [classes.large]: fullScreen,
        })}
      >
        <Box className={classes.content}>
          <FilesView
            disabled={!!loading}
            accept="*"
            multiple
            items={files}
            tr={tr}
            fallback={fallback}
            onClick={onClick}
            onUpload={onUpload}
            onChange={handleChange}
            onLoadStart={handleLoadStart}
            onLoadEnd={handleLoadEnd}
          />
        </Box>
        <ActionButton
          className={classes.submit}
          disabled={!!loading || !dirty}
          fallback={fallback}
          onLoadStart={handleLoadStart}
          onLoadEnd={handleLoadEnd}
          size="large"
          variant="contained"
          color="info"
          fullWidth
          onClick={handleSubmit}
        >
          {submitLabel}
        </ActionButton>
      </Box>
    </Modal>
  );

  return {
    render,
    pickFiles: () => setOpen(true),
  };
};

export default useFilesView;
