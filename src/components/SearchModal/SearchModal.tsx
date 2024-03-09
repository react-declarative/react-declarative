import * as React from "react";
import { useState, useEffect } from "react";

import { makeStyles } from "../../styles";
import { SxProps } from "@mui/material";

import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";

import ActionButton from "../ActionButton";
import List from "../List";

import useActualState from "../../hooks/useActualState";
import useWindowSize from "../../hooks/useWindowSize";
import useSingleton from "../../hooks/useSingleton";

import classNames from "../../utils/classNames";

import SelectionMode from "../../model/SelectionMode";
import IListProps from "../../model/IListProps";
import IAnything from "../../model/IAnything";
import IRowData from "../../model/IRowData";
import IField from "../../model/IField";
import ISize from "../../model/ISize";

const MODAL_ROOT = "search-modal__root";
const RESIZE_DEBOUNCE = 10;

export interface ISearchModalProps<
  FilterData extends {} = IAnything,
  RowData extends IRowData = IAnything,
  Payload extends IAnything = IAnything,
  Field extends IField = IField<FilterData, Payload>
> extends Omit<
  IListProps<FilterData, RowData, Payload, Field>,
  keyof {
    selectedRows: never;
    heightRequest: never;
    widthRequest: never;
    onSelectedRows: never;
    onLoadStart: never;
    onLoadEnd: never;
    onRowClick: never;
  }
> {
  fullScreen?: boolean;
  sizeRequest?: (size: ISize) => {
    height: number;
    width: number;
    sx?: SxProps;
  };
  title?: string;
  AfterTitle?: React.ComponentType<{
    onClose?: () => void;
    payload: Payload;
  }>;
  BeforeTitle?: React.ComponentType<{
    onClose?: () => void;
    payload: Payload;
  }>;
  data?: IRowData["id"][];
  selectionMode?: SelectionMode;
  onSubmit?: (data: IRowData["id"][] | null, payload: Payload) => Promise<boolean> | boolean;
  onChange?: (data: IRowData["id"][] | null, initial: boolean) => void;
  onLoadStart?: () => void;
  onLoadEnd?: (isOk: boolean) => void;
  fallback?: (e: Error) => void;
  throwError?: boolean;
  open?: boolean;
  hidden?: boolean;
  submitLabel?: string;
}

const useStyles = makeStyles()((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: "hidden",
  },
  container: {
    position: 'static',
    display: "flex",
    alignItems: "stretch",
    justifyContent: "stretch",
    flexDirection: "column",
    backgroundColor: theme.palette.background.paper,
    padding: 20,
    borderRadius: 5,
  },
  title: {
    display: "flex",
    justifyContent: "stretch",
    alignItems: "center",
    paddingBottom: 15,
    color: theme.palette.text.primary,
  },
  stretch: {
    flex: 1,
  },
  content: {
    flex: 1,
    display: "flex",
    alignItems: "stretch",
    justifyContent: "stretch",
    maxWidth: '100%',
    overflow: 'hidden',
    "& > * > * > * > .MuiPaper-root": {
      background: "transparent",
      boxShadow: "none",
      border: "0",
      borderRadius: "0",
      "& > * > *": {
        background: "transparent",
      },
    },
  },
  submit: {
    paddingTop: 15,
  },
  disabled: {
    opacity: 0.5,
    pointerEvents: "none",
  },
}));

const SMALL_SIZE_REQUEST: ISearchModalProps['sizeRequest'] = () => ({
  height: 0,
  width: 0,
  sx: {
    maxHeight: "80%",
    minWidth: "330px",
    maxWidth: "450px",
    margin: "10px",
  },
});

const LARGE_SIZE_REQUEST: ISearchModalProps['sizeRequest'] = ({
  height,
  width,
}) => ({
  height: height - 50,
  width: width - 50,
});

export const SearchModal = <
  FilterData extends {} = IAnything,
  RowData extends IRowData = IAnything,
  Payload extends IAnything = IAnything,
  Field extends IField = IField<FilterData, Payload>
>({
  fullScreen = true,
  sizeRequest = fullScreen ? LARGE_SIZE_REQUEST : SMALL_SIZE_REQUEST,
  hidden = false,
  onSubmit = () => true,
  onChange = () => undefined,
  onLoadStart,
  onLoadEnd,
  fallback,
  AfterTitle,
  BeforeTitle,
  title,
  payload: upperPayload = {} as Payload,
  withInitialLoader = true,
  selectionMode = SelectionMode.Multiple,
  data: upperData,
  open = true,
  throwError = false,
  submitLabel = "Submit",
  ...listProps
}: ISearchModalProps<FilterData, RowData, Payload, Field>) => {
  const { classes } = useStyles();

  const requestedSize = useWindowSize({
    compute: (size) => {
      const request = sizeRequest(size);
      return {
        height: request.height,
        width: request.width,
        sx: request.sx,
      }
    },
    debounce: RESIZE_DEBOUNCE,
  });

  const payload = useSingleton(upperPayload);

  const [data, setData] = useState<IRowData["id"][] | null>(upperData || []);
  const [loading, setLoading] = useActualState(0);

  useEffect(() => {
    setData(upperData || []);
  }, [open]);

  const handleChange = (newData: IRowData["id"][], initial: boolean) => {
    setData(newData);
    onChange(newData, initial);
  };

  const handleLoadStart = () => {
    setLoading((loading) => loading + 1);
    onLoadStart && onLoadStart();
  };

  const handleLoadEnd = (isOk: boolean) => {
    setLoading((loading) => loading - 1);
    onLoadEnd && onLoadEnd(isOk);
  };

  const handleAccept = async () => {
    if (loading.current) {
      return;
    }
    let isOk = true;
    try {
      handleLoadStart();
      if (open) {
        await onSubmit(data, payload);
      }
    } catch (e: any) {
      isOk = false;
      if (!throwError) {
        fallback && fallback(e as Error);
      } else {
        throw e;
      }
    } finally {
      handleLoadEnd(isOk);
    }
  };

  const handleClose = async () => {
    if (loading.current) {
      return;
    }
    let isOk = true;
    try {
      handleLoadStart();
      if (open) {
        await onSubmit(null, payload);
      }
    } catch (e: any) {
      isOk = false;
      if (!throwError) {
        fallback && fallback(e as Error);
      } else {
        throw e;
      }
    } finally {
      handleLoadEnd(isOk);
    }
  };

  return (
    <Modal
      open={open}
      className={classes.root}
      sx={{
        ...(hidden && {
          visibility: "hidden",
          opacity: 0,
        }),
      }}
      onClose={() => {
        if (open) {
          handleClose();
        }
      }}
    >
      <Box
        className={classNames(classes.container, MODAL_ROOT)}
        sx={{
          height: requestedSize.height || undefined,
          width: requestedSize.width || undefined,
          ...requestedSize.sx,
        }}
      >
        {title && (
          <div className={classes.title}>
            {BeforeTitle && (
              <BeforeTitle payload={payload} onClose={handleClose} />
            )}
            <Typography className={classes.stretch} variant="h6" component="h2">
              {title}
            </Typography>
            {AfterTitle && (
              <AfterTitle payload={payload} onClose={handleClose} />
            )}
          </div>
        )}
        <Box className={classes.content}>
          <List
            {...listProps}
            sizeByElement
            withSelectOnRowClick
            selectionMode={selectionMode}
            onLoadStart={handleLoadStart}
            onLoadEnd={handleLoadEnd}
            payload={payload}
            selectedRows={data?.length ? data : undefined}
            onSelectedRows={handleChange}
          />
        </Box>
        {selectionMode !== SelectionMode.None && (
          <ActionButton
            className={classes.submit}
            disabled={!!loading.current || !data?.length}
            size="large"
            variant="contained"
            color="info"
            fullWidth
            onClick={handleAccept}
          >
            {submitLabel}
          </ActionButton>
        )}
      </Box>
    </Modal>
  );
};

export default SearchModal;
