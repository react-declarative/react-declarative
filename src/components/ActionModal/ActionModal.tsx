import * as React from "react";
import { useState } from "react";

import { makeStyles } from "../../styles";

import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";

import ActionButton from "../ActionButton";
import One from "../One";

import useActualValue from "../../hooks/useActualValue";
import useActualState from "../../hooks/useActualState";
import useRenderWaiter from "../../hooks/useRenderWaiter";

import classNames from "../../utils/classNames";

import IField from "../../model/IField";
import IOneApi from "../../model/IOneApi";
import IAnything from "../../model/IAnything";
import IOneProps from "../../model/IOneProps";

import sleep from "../../utils/sleep";

export interface IActionModalProps<
  Data extends IAnything = IAnything,
  Payload = IAnything,
  Field = IField<Data>,
  Param = any,
> {
  waitForChangesDelay?: number;
  fullScreen?: boolean;
  hidden?: boolean;
  readonly?: boolean;
  apiRef?: React.Ref<IOneApi>;
  fields: Field[];
  title?: string;
  dirty?: boolean;
  param?: Param;
  outlinePaper?: IOneProps<Data, Payload>['outlinePaper'];
  handler?: IOneProps<Data, Payload>['handler'];
  payload?: IOneProps<Data, Payload>['payload'];
  changeSubject?: IOneProps<Data, Payload>['changeSubject'];
  reloadSubject?: IOneProps<Data, Payload>['reloadSubject'];
  onSubmit?: (data: Data | null, param: Param) => Promise<boolean> | boolean;
  onChange?: (data: Data, initial: boolean) => void;
  onInvalid?: (name: string, msg: string) => void;
  onLoadStart?: () => void;
  onLoadEnd?: (isOk: boolean) => void;
  fallback?: (e: Error) => void;
  throwError?: boolean;
  open?: boolean;
  submitLabel?: string;
}

const WAIT_FOR_CHANGES_DELAY = 1_000;

const useStyles = makeStyles()((theme) => ({
  root: {
    position: "absolute",

    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'stretch',
  
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
    width: 'calc(100vw - 50px)',
    height: 'calc(100vh - 50px)',
  },
  content: {
    flex: 1,
    overflowY: 'auto',
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

export const ActionModal = <
  Data extends IAnything = IAnything,
  Payload = IAnything,
  Field = IField<Data>
>({
  waitForChangesDelay = WAIT_FOR_CHANGES_DELAY,
  onSubmit = () => true,
  onChange = () => undefined,
  onInvalid = () => undefined,
  onLoadStart,
  onLoadEnd,
  fallback,
  fields,
  param,
  handler,
  payload,
  title,
  apiRef,
  changeSubject,
  reloadSubject,
  fullScreen = false,
  outlinePaper = false,
  open = true,
  dirty = false,
  hidden = false,
  readonly = false,
  throwError = false,
  submitLabel = "Submit",
}: IActionModalProps<Data, Payload, Field>) => {
  const { classes } = useStyles();

  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useActualState(0);

  const data$ = useActualValue(data);

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

  const waitForRender = useRenderWaiter([data], 10);

  const waitForChanges = async () => {
    await Promise.race([
      waitForRender(),
      sleep(waitForChangesDelay),
    ]);
  };

  const handleAccept = async () => {
    if (loading.current) {
      return;
    }
    let isOk = true;
    try {
      handleLoadStart()
      if (open) {
        await waitForChanges();
        await onSubmit(data$.current, param);
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
      handleLoadStart()
      if (open) {
        await onSubmit(null, param);
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
      sx={{
        ...(hidden && {
          visibility: 'hidden',
          opacity: 0,
        }),
      }}
      onClose={handleClose}
    >
      <Box
        className={classNames(classes.root, {
          [classes.small]: !fullScreen,
          [classes.large]: fullScreen,
        })}
      >
        {title && (
          <div className={classes.title}>
            <Typography variant="h6" component="h2">
              {title}
            </Typography>
          </div>
        )}
        <Box className={classes.content}>
          <One
            apiRef={apiRef}
            changeSubject={changeSubject}
            reloadSubject={reloadSubject}
            className={classNames({
              [classes.disabled]: !!loading.current,
            })}
            readonly={!!loading.current || readonly}
            outlinePaper={outlinePaper}
            invalidity={handleInvalid}
            change={handleChange}
            handler={handler}
            payload={payload}
            fields={fields}
            dirty={dirty}
          />          
        </Box>
        {!readonly && (
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
        )}
      </Box>
    </Modal>
  );
};

export default ActionModal;
