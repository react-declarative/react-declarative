import * as React from "react";
import { useState } from "react";

import { makeStyles } from "../../styles";

import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";

import ActionButton from "../ActionButton";

import useActualState from "../../hooks/useActualState";

import IAnything from "../../model/IAnything";

export interface IListSearchProps<
    FilterData extends {} = IAnything,
    RowData extends IRowData = IAnything,
    Payload extends IAnything = IAnything,
    Field extends IField = IField<FilterData, Payload>,
    Param = IAnything
> {
  title?: string;
  onSubmit?: (data: string[] | null) => Promise<boolean> | boolean;
  onChange?: (data: string[] | null) => void;
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
    width: '80vmin',
    height: '60vmin',
    backgroundColor: theme.palette.background.paper,
    padding: 20,
    maxHeight: "80%",
    overflowY: "auto",
    borderRadius: 5,
  },
  title: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 15,
  },
  content: {
    flex: 1,
    paddingBottom: 15,
  },
  submit: {
    paddingTop: 15,
  },
  disabled: {
    opacity: 0.5,
    pointerEvents: "none",
  },
}));

export const ListSearch = <Data extends IAnything = IAnything>({
  onSubmit = () => true,
  // onChange = () => undefined,
  onLoadStart,
  onLoadEnd,
  fallback,
  title,
  open = true,
  throwError = false,
  submitLabel = "Submit",
}: IListSearchProps<Data>) => {
  const { classes } = useStyles();

  const [data] = useState<Data | null>(null);
  const [loading, setLoading] = useActualState(0);

  /*const handleChange = (newData: Data, initial: boolean) => {
    setData(newData);
    onChange(newData, initial);
  };

  const handleInvalid = (name: string, msg: string) => {
    setData(null);
    onInvalid(name, msg);
  };*/

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
        <div className={classes.title}>
          <Typography variant="h6" component="h2">
            {title}
          </Typography>
        </div>
        <Box className={classes.content}>
            123
        </Box>
        <ActionButton
          className={classes.submit}
          disabled={!!loading.current || !data}
          size="large"
          variant="contained"
          color="info"
          fullWidth
          onClick={handleAccept}
        >
          {submitLabel}
        </ActionButton>
      </Box>
    </Modal>
  );
};

export default ListSearch;
