import * as React from "react";
import { useState, useEffect } from "react";

import { makeStyles } from "../../styles";

import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";

import ActionButton from "../ActionButton";
import List from "../List";

import useActualState from "../../hooks/useActualState";

import IAnything from "../../model/IAnything";
import IRowData from "../../model/IRowData";
import IField from "../../model/IField";
import { AutoSizer } from "../AutoSizer";
import IListProps from "../../model/IListProps";
import SelectionMode from "../../model/SelectionMode";

export interface ISearchModalProps<
  FilterData extends {} = IAnything,
  RowData extends IRowData = IAnything,
  Payload extends IAnything = IAnything,
  Field extends IField = IField<FilterData, Payload>,
> extends Omit<IListProps<FilterData, RowData, Payload, Field>, keyof {
  selectedRows: never;
  heightRequest: never;
  widthRequest: never;
  onSelectedRows: never;
  onLoadStart: never;
  onLoadEnd: never;
}> {
  title?: string;
  data?: IRowData['id'][];
  onSubmit?: (data: IRowData['id'][] | null) => Promise<boolean> | boolean;
  onChange?: (data: IRowData['id'][] | null, initial: boolean) => void;
  onLoadStart?: () => void;
  onLoadEnd?: (isOk: boolean) => void;
  fallback?: (e: Error) => void;
  throwError?: boolean;
  open?: boolean;
  submitLabel?: string;
}

const useStyles = makeStyles()((theme) => ({
  root: {
    position: "absolute",
    display: "flex",
    alignItems: "stretch",
    justifyContent: "stretch",
    flexDirection: "column",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 'calc(100vw - 50px)',
    height: 'calc(100vh - 50px)',
    backgroundColor: theme.palette.background.paper,
    padding: 20,
    overflowY: "auto",
    borderRadius: 5,
  },
  title: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 15,
    color: theme.palette.text.primary,
  },
  content: {
    flex: 1,
    '& > * > * > * > * > .MuiPaper-root': {
      background: 'transparent',
      boxShadow: 'none',
      border: '0',
      borderRadius: '0',
      '& > *': {
        background: 'transparent',
      },
    },
  },
  submit: {
    paddingTop: 30,
  },
  disabled: {
    opacity: 0.5,
    pointerEvents: "none",
  },
}));

export const SearchModal = <
  FilterData extends {} = IAnything,
  RowData extends IRowData = IAnything,
  Payload extends IAnything = IAnything,
  Field extends IField = IField<FilterData, Payload>,
>({
  onSubmit = () => true,
  onChange = () => undefined,
  onLoadStart,
  onLoadEnd,
  fallback,
  title,
  withInitialLoader = true,
  selectionMode = SelectionMode.Multiple,
  data: upperData,
  open = true,
  throwError = false,
  submitLabel = "Submit",
  ...listProps
}: ISearchModalProps<FilterData, RowData, Payload, Field>) => {
  const { classes } = useStyles();

  const [data, setData] = useState<IRowData['id'][] | null>(upperData || []);
  const [loading, setLoading] = useActualState(0);

  useEffect(() => {
    setData(upperData || []);
  }, [open]);

  const handleChange = (newData: IRowData['id'][], initial: boolean) => {
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
    const isEnabled = open && !loading.current;
    let isOk = true;
    try {
      handleLoadStart()
      if (isEnabled) {
        await onSubmit(data);
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
    const isEnabled = open && !loading.current;
    let isOk = true;
    try {
      handleLoadStart()
      if (isEnabled) {
        await onSubmit(null);
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
    <Modal open={open} onClose={handleClose}>
      <Box className={classes.root}>
        {title && (
          <div className={classes.title}>
            <Typography variant="h6" component="h2">
              {title}
            </Typography>
          </div>
        )}
        <Box className={classes.content}>
            <AutoSizer>
              {({ height, width }) => (
                <List
                  {...listProps}
                  selectionMode={selectionMode}
                  onLoadStart={handleLoadStart}
                  onLoadEnd={handleLoadEnd}
                  selectedRows={data?.length ? data : undefined}
                  heightRequest={() => height}
                  widthRequest={() => width}
                  onSelectedRows={handleChange}
                />
              )}
            </AutoSizer>
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
