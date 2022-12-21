import * as React from "react";
import { useState } from "react";

import { makeStyles } from "../../styles";

import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";

import ActionButton from "../ActionButton";
import One from "../One";

import useActualState from "../../hooks/useActualState";

import classNames from "../../utils/classNames";

import IField from "../../model/IField";
import IOneApi from "../../model/IOneApi";
import IAnything from "../../model/IAnything";
import IOneProps, { OneHandler } from "../../model/IOneProps";

export interface IActionModalProps<
  Data extends IAnything = IAnything,
  Payload = IAnything,
  Field = IField<Data>
> {
  apiRef?: React.Ref<IOneApi>;
  fields: Field[];
  title?: string;
  handler?: OneHandler<Data>;
  payload?: IOneProps<Data, Payload>['payload'];
  onSubmit?: (data: Data | null) => Promise<boolean> | boolean;
  onChange?: (data: Data, initial: boolean) => void;
  onInvalid?: (name: string, msg: string) => void;
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
    top: "40%",
    left: "50%",
    margin: 20,
    transform: "translate(-50%, -50%)",
    width: 500,
    backgroundColor: theme.palette.background.paper,
    padding: 20,
    maxHeight: "80%",
    overflowY: "scroll",
    borderRadius: 5,
  },
  title: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
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

export const ActionModal = <
  Data extends IAnything = IAnything,
  Payload = IAnything,
  Field = IField<Data>
>({
  onSubmit = () => true,
  onChange = () => undefined,
  onInvalid = () => undefined,
  onLoadStart,
  onLoadEnd,
  fallback,
  fields,
  handler,
  payload,
  title,
  apiRef,
  open = true,
  throwError = false,
  submitLabel = "Submit",
}: IActionModalProps<Data, Payload, Field>) => {
  const { classes } = useStyles();

  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useActualState(0);

  const handleChange = (newData: Data, initial: boolean) => {
    setData(newData);
    onChange(newData, initial);
  };

  const handleInvalid = (name: string, msg: string) => {
    setData(null);
    onInvalid(name, msg);
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
        <div className={classes.title}>
          <Typography variant="h6" component="h2">
            {title}
          </Typography>
        </div>
        <One
          apiRef={apiRef}
          className={classNames({
            [classes.disabled]: !!loading.current,
          })}
          readonly={!!loading.current}
          invalidity={handleInvalid}
          change={handleChange}
          handler={handler}
          payload={payload}
          fields={fields}
        />
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

export default ActionModal;
