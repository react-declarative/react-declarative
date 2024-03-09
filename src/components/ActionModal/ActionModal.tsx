import * as React from "react";
import { useState } from "react";

import { makeStyles } from "../../styles";
import { SxProps } from "@mui/system";

import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";

import ActionButton from "../ActionButton";
import One from "../One";

import useRenderWaiter from "../../hooks/useRenderWaiter";
import useActualValue from "../../hooks/useActualValue";
import useActualState from "../../hooks/useActualState";
import useWindowSize from "../../hooks/useWindowSize";
import useSingleton from "../../hooks/useSingleton";

import classNames from "../../utils/classNames";
import sleep from "../../utils/sleep";

import ISize from "../../model/ISize";
import IField from "../../model/IField";
import IOneApi from "../../model/IOneApi";
import IAnything from "../../model/IAnything";
import IOneProps from "../../model/IOneProps";
import IOnePublicProps from "../../model/IOnePublicProps";

const MODAL_ROOT = "action-modal__root";
const RESIZE_DEBOUNCE = 10;

export interface IActionModalProps<
  Data extends IAnything = IAnything,
  Payload = IAnything,
  Field = IField<Data>,
  Param = any
> {
  sizeRequest?: (size: ISize) => {
    height: number;
    width: number;
    sx?: SxProps;
  };
  waitForChangesDelay?: number;
  withActionButton?: boolean;
  withStaticAction?: boolean;
  fullScreen?: boolean;
  hidden?: boolean;
  readonly?: boolean;
  apiRef?: React.Ref<IOneApi>;
  fields: Field[];
  title?: string;
  dirty?: boolean;
  param?: Param;
  features?: IOnePublicProps<Data, Payload>["features"];
  outlinePaper?: IOneProps<Data, Payload>["outlinePaper"];
  handler?: IOneProps<Data, Payload>["handler"];
  payload?: IOneProps<Data, Payload>["payload"];
  changeSubject?: IOneProps<Data, Payload>["changeSubject"];
  reloadSubject?: IOneProps<Data, Payload>["reloadSubject"];
  onSubmit?: (
    data: Data | null,
    payload: Payload,
    param: Param
  ) => Promise<boolean> | boolean;
  onChange?: (data: Data, initial: boolean) => void;
  onInvalid?: (name: string, msg: string) => void;
  onLoadStart?: () => void;
  onLoadEnd?: (isOk: boolean) => void;
  fallback?: (e: Error) => void;
  AfterTitle?: React.ComponentType<{
    onClose?: () => void;
    payload: Payload;
    param: Param;
  }>;
  BeforeTitle?: React.ComponentType<{
    onClose?: () => void;
    payload: Payload;
    param: Param;
  }>;
  throwError?: boolean;
  open?: boolean;
  submitLabel?: string;
}

const WAIT_FOR_CHANGES_DELAY = 1_000;

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
    overflowX: "hidden",
    paddingTop: theme.spacing(1),
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
  submit: {
    marginTop: 15,
  },
  disabled: {
    opacity: 0.5,
    pointerEvents: "none",
  },
}));

const SMALL_SIZE_REQUEST: IActionModalProps['sizeRequest'] = () => ({
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

const LARGE_SIZE_REQUEST: IActionModalProps['sizeRequest'] = ({
  height,
  width,
}) => ({
  height: height - 50,
  width: width - 50,
});

export const ActionModal = <
  Data extends IAnything = IAnything,
  Payload = IAnything,
  Field = IField<Data>
>({
  withActionButton = true,
  withStaticAction = false,
  waitForChangesDelay = withStaticAction ? 0 : WAIT_FOR_CHANGES_DELAY,
  onSubmit = () => true,
  onChange = () => undefined,
  onInvalid = () => undefined,
  onLoadStart,
  onLoadEnd,
  fallback,
  fields,
  param,
  handler,
  payload: upperPayload = {} as Payload,
  fullScreen = false,
  sizeRequest = fullScreen ? LARGE_SIZE_REQUEST : SMALL_SIZE_REQUEST,
  title,
  apiRef,
  features,
  changeSubject,
  reloadSubject,
  outlinePaper = false,
  open = true,
  dirty = false,
  hidden = false,
  readonly = false,
  throwError = false,
  submitLabel = "Submit",
  AfterTitle,
  BeforeTitle,
}: IActionModalProps<Data, Payload, Field>) => {
  const { classes } = useStyles();

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
    await Promise.race([waitForRender(), sleep(waitForChangesDelay)]);
  };

  const handleAccept = async () => {
    if (loading.current) {
      return;
    }
    let isOk = true;
    try {
      handleLoadStart();
      if (open) {
        await waitForChanges();
        await onSubmit(withStaticAction ? {} as Data : data$.current, payload, param);
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
        await onSubmit(null, payload, param);
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
      className={classes.root}
      open={open}
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
              <BeforeTitle
                payload={payload}
                param={param}
                onClose={handleClose}
              />
            )}
            <Typography className={classes.stretch} variant="h6" component="h2">
              {title}
            </Typography>
            {AfterTitle && (
              <AfterTitle
                payload={payload}
                param={param}
                onClose={handleClose}
              />
            )}
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
            features={features}
          />
        </Box>
        {!readonly && withActionButton && (
          <ActionButton
            className={classes.submit}
            disabled={!withStaticAction && (!!loading.current || !data)}
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
