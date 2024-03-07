import * as React from 'react';
import { useEffect, useState } from "react";

import { makeStyles } from "../../styles";

import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

import FilesView, { IFilesViewProps } from './FilesView';
import ActionButton from '../ActionButton';

import useOneArray from '../../hooks/useOneArray';
import useSingleton from '../../hooks/useSingleton';
import useWindowSize from '../../hooks/useWindowSize';
import useElementSize from '../../hooks/useElementSize';

import classNames from '../../utils/classNames';
import and from '../../utils/math/and';

import IAnything from '../../model/IAnything';

const MODAL_ROOT = "files-modal__root";
const DECIMAL_PLACES = 10;
const RESIZE_DEBOUNCE = 10;

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
    minWidth: "330px",
    maxWidth: "450px",
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

interface IParams<Payload extends IAnything = IAnything> {
  data?: string[] | null;
  fullScreen?: boolean;
  readonly?: boolean;
  submitLabel?: string;
  withActionButton?: boolean;
  withStaticAction?: boolean;
  payload?: Payload | (() => Payload);
  onSubmit?: (data: string[], payload: Payload) => void
  onChange?: (data: string[], payload: Payload) => void;
  tr?: IFilesViewProps['tr'];
  fallback?: IFilesViewProps['fallback'];
  onLoadStart?: IFilesViewProps['onLoadStart'];
  onLoadEnd?: IFilesViewProps['onLoadEnd'];
  onClick?: IFilesViewProps['onClick'];
  onUpload?: IFilesViewProps['onUpload'];
}

export const useFilesView = <Payload extends IAnything = IAnything>({
  data = null,
  withActionButton = true,
  withStaticAction = false,
  readonly,
  fullScreen,
  submitLabel = "Save",
  payload: upperPayload = {} as Payload,
  onChange,
  onSubmit,
  tr,
  fallback,
  onLoadStart,
  onLoadEnd,
  onClick,
  onUpload,
}: IParams<Payload>) => {

  const payload = useSingleton(upperPayload);

  const windowBasedSize = useWindowSize({
    compute: ({ height, width }) => ({
      height: Math.round(Math.floor((height - 50) / 2) / DECIMAL_PLACES) * DECIMAL_PLACES,
      width: Math.round(Math.floor((width - 50) / 2) / DECIMAL_PLACES) * DECIMAL_PLACES,
    }),
    debounce: RESIZE_DEBOUNCE,
  });

  const { elementRef, size: elementBasedSize } = useElementSize({
    compute: ({ height, width }) => ({
      height: Math.round(Math.floor((height - 20) / 2) / DECIMAL_PLACES) * DECIMAL_PLACES,
      width: Math.round(Math.floor((width - 20) / 2) / DECIMAL_PLACES) * DECIMAL_PLACES,
    }),
    debounce: RESIZE_DEBOUNCE,
  });

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
    onChange && onChange(data || [], payload);
  };

  const handleClose = () => {
    setFiles(data);
    setOpen(false);
    setDirty(false);
  };

  const handleSubmit = async () => {
    if (onSubmit) {
      await onSubmit(withStaticAction ? [] : files, payload);
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
        ref={elementRef}
        className={classNames(classes.root, MODAL_ROOT, {
          [classes.small]: !fullScreen,
          [classes.large]: fullScreen,
        })}
        sx={{
          ...(fullScreen && {
            transform: `translate(-${windowBasedSize.width}px, -${windowBasedSize.height}px) !important`,
          }),
          ...(!fullScreen && {
            transform: and(!!elementBasedSize.width, !!elementBasedSize.height)
              ? `translate(-${elementBasedSize.width}px, -${elementBasedSize.height}px) !important`
              : undefined,
          }),
        }}
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
        {!readonly && withActionButton && (
          <ActionButton
            className={classes.submit}
            disabled={!withStaticAction && (!!loading || !dirty)}
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
        )}
      </Box>
    </Modal>
  );

  return {
    render,
    pickFiles: () => setOpen(true),
  };
};

export default useFilesView;
