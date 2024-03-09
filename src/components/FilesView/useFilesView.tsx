import * as React from 'react';
import { useEffect, useState } from "react";

import { makeStyles } from "../../styles";
import { SxProps } from '@mui/material';

import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

import FilesView, { IFilesViewProps } from './FilesView';
import ActionButton from '../ActionButton';

import useOneArray from '../../hooks/useOneArray';
import useSingleton from '../../hooks/useSingleton';
import useWindowSize from '../../hooks/useWindowSize';

import classNames from '../../utils/classNames';

import IAnything from '../../model/IAnything';
import ISize from '../../model/ISize';

const MODAL_ROOT = "files-modal__root";
const RESIZE_DEBOUNCE = 10;

const useStyles = makeStyles()((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    position: "absolute",
    padding: 20,
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    justifyContent: "stretch",
    backgroundColor: theme.palette.background.paper,
    borderRadius: 5,
    gap: 5,
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

const SMALL_SIZE_REQUEST: IParams['sizeRequest'] = () => ({
  height: 0,
  width: 0,
  sx: {
    position: 'static',
    maxHeight: "80%",
    minWidth: "330px",
    maxWidth: "450px",
    margin: "10px",
  },
});

const LARGE_SIZE_REQUEST: IParams['sizeRequest'] = ({
  height,
  width,
}) => ({
  height: height - 50,
  width: width - 50,
});

interface IParams<Payload extends IAnything = IAnything> {
  sizeRequest?: (size: ISize) => {
    height: number;
    width: number;
    sx?: SxProps;
  };
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
  submitLabel = "Save",
  payload: upperPayload = {} as Payload,
  fullScreen = false,
  sizeRequest = fullScreen ? LARGE_SIZE_REQUEST : SMALL_SIZE_REQUEST,
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

  const requestedSize = useWindowSize({
    compute: (size) => {
      const request = sizeRequest(size);
      return {
        height: request.height,
        width: request.width,
        sx: {
          top: request.height ? size.height - request.height : undefined,
          left: request.height ? size.width - request.width: undefined,
          ...request.sx,
        },
      }
    },
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
    <Modal className={classes.root} open={open} onClose={handleClose}>
      <Box
        className={classNames(classes.container, MODAL_ROOT)}
        sx={{
          height: requestedSize.height || undefined,
          width: requestedSize.width || undefined,
          ...requestedSize.sx,
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
