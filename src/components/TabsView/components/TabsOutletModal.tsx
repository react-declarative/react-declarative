import * as React from "react";
import { useState, useEffect, useRef } from "react";

import { makeStyles } from "../../../styles";

import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";

import useSubjectValue from "../../../hooks/useSubjectValue";
import useActualState from "../../../hooks/useActualState";
import useElementSize from "../../../hooks/useElementSize";
import useWindowSize from "../../../hooks/useWindowSize";

import ActionButton from "../../ActionButton";
import FetchView, { IFetchViewProps } from "../../FetchView";
import LoaderView from "../../LoaderView";
import TabsView from "../TabsView";

import ITabsModal from "../model/ITabsModal";

import TBehaviorSubject from "../../../model/TBehaviorSubject";
import ITabsViewProps from "../model/ITabsViewProps";
import IAnything from "../../../model/IAnything";
import TSubject from "../../../model/TSubject";

import classNames from "../../../utils/classNames";
import and from "../../../utils/math/and";

const Loader = () => (
  <LoaderView size={24} sx={{ height: "100%", width: "100%" }} />
);

const MODAL_ROOT = "outlet-modal__root";
const DECIMAL_PLACES = 10;
const RESIZE_DEBOUNCE = 10;

export interface ITabsModalProps<
  Data extends {} = Record<string, any>,
  Payload = IAnything
> extends Omit<
    ITabsViewProps<Data, Payload>,
    keyof {
      otherProps: never;
      onSubmit: never;
      initialData: never;
      payload: never;
      params: never;
      routes: never;
      data: never;
      id: never;
      outlinePaper: never;
    }
  > {
  openSubject: TBehaviorSubject<boolean>;
  fullScreen?: boolean;
  withActionButton?: boolean;
  title?: string;
  fetchState?: IFetchViewProps["state"];
  reloadSubject?: TSubject<void>;
  onSubmit?: (
    data: Data | null,
    payload: Payload
  ) => Promise<boolean> | boolean;
  AfterTitle?: React.ComponentType<{
    onClose: () => void;
    data: Data | null;
  }>;
  BeforeTitle?: React.ComponentType<{
    onClose: () => void;
    data: Data | null;
  }>;
  routes: ITabsModal<Data, Payload>[];
  data?: Data | null;
  onLoadStart?: () => void;
  onLoadEnd?: (isOk: boolean) => void;
  fallback?: (e: Error) => void;
  throwError?: boolean;
  hidden?: boolean;
  submitLabel?: string;
  mapPayload?: (data: Record<string, any>[]) => Payload | Promise<Payload>;
  mapInitialData?: (data: Record<string, any>[]) => Data | Promise<Data>;
  onMount?: () => void;
  onUnmount?: () => void;
  onClose?: () => void;
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
    width: "calc(100vw - 50px)",
    height: "calc(100vh - 50px)",
    backgroundColor: theme.palette.background.paper,
    padding: 20,
    overflowY: "auto",
    borderRadius: 5,
  },
  title: {
    display: "flex",
    justifyContent: "stretch",
    alignItems: "center",
    paddingBottom: 15,
    color: theme.palette.text.primary,
  },
  content: {
    flex: 1,
    display: "flex",
    alignItems: "stretch",
    justifyContent: "stretch",
    maxWidth: "100%",
    overflowX: "hidden",
    overflowY: "auto",
    "& > *": {
      flex: 1,
    },
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
  inner: {
    minHeight: '100% !important',
    maxHeight: '100% !important',
    border: 'unset !important',
  },
  submit: {
    paddingTop: 15,
  },
  disabled: {
    opacity: 0.5,
    pointerEvents: "none",
  },
  stretch: {
    flex: 1,
  },
}));

export const OutletModal = <
  Data extends {} = Record<string, any>,
  Payload = IAnything
>({
  withActionButton = false,
  hidden = false,
  onSubmit = () => true,
  onChange = () => undefined,
  mapInitialData = () => ({} as Data),
  mapPayload = () => ({} as Payload),
  onLoadStart,
  onLoadEnd,
  fallback,
  reloadSubject,
  fetchState = () => ({}),
  AfterTitle,
  BeforeTitle,
  title,
  data: upperData = null,
  throwError = false,
  fullScreen = true,
  submitLabel = "Submit",
  openSubject,
  readonly,
  routes,
  onMount,
  onUnmount,
  onClose = () => null,
  ...outletProps
}: ITabsModalProps<Data, Payload>) => {
  const { classes } = useStyles();

  const open = useSubjectValue(openSubject, !!openSubject.data)

  const windowBasedSize = useWindowSize({
    compute: ({ height, width }) => ({
      height:
        Math.round(Math.floor((height - 50) / 2) / DECIMAL_PLACES) *
        DECIMAL_PLACES,
      width:
        Math.round(Math.floor((width - 50) / 2) / DECIMAL_PLACES) *
        DECIMAL_PLACES,
    }),
    debounce: RESIZE_DEBOUNCE,
  });

  const { elementRef, size: elementBasedSize } = useElementSize({
    compute: ({ height, width }) => ({
      height:
        Math.round(Math.floor((height - 50) / 2) / DECIMAL_PLACES) *
        DECIMAL_PLACES,
      width:
        Math.round(Math.floor((width - 50) / 2) / DECIMAL_PLACES) *
        DECIMAL_PLACES,
    }),
    debounce: RESIZE_DEBOUNCE,
  });

  const [data, setData] = useState<Data | null>(upperData);
  const [loading, setLoading] = useActualState(0);

  const payloadRef = useRef<Payload>({} as Payload);

  useEffect(() => {
    onMount && onMount();
    return () => onUnmount && onUnmount();
  }, []);

  useEffect(() => {
    setData(upperData);
  }, [open]);

  const handleChange = (
    data: Data,
    initial: boolean,
    payload: Payload,
    source: string
  ) => {
    payloadRef.current = payload;
    setData(data);
    onChange(data, initial, payload, source);
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
      if (withActionButton) {
        await onSubmit({} as Data, payloadRef.current);
      } else {
        await onSubmit(data, payloadRef.current);
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
      await onSubmit(null, payloadRef.current);
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
          visibility: "hidden",
          opacity: 0,
        }),
      }}
      onClose={handleClose}
    >
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
        {title && (
          <div className={classes.title}>
            {BeforeTitle && <BeforeTitle data={data} onClose={handleClose} />}
            <Typography className={classes.stretch} variant="h6" component="h2">
              {title}
            </Typography>
            {AfterTitle && <AfterTitle data={data} onClose={handleClose} />}
          </div>
        )}
        <Box className={classes.content}>
          {open && (
            <FetchView
              animation="none"
              state={fetchState}
              reloadSubject={reloadSubject}
              fallback={fallback}
              onLoadStart={onLoadStart}
              onLoadEnd={onLoadEnd}
              Loader={Loader}
            >
              {async (...args) => (
                <TabsView
                  {...outletProps}
                  className={classes.inner}
                  routes={routes as any}
                  outlinePaper
                  fallback={fallback}
                  onLoadStart={onLoadStart}
                  onLoadEnd={onLoadEnd}
                  initialData={await mapInitialData(args.flat(1))}
                  payload={await mapPayload(args.flat(1))}
                  readonly={readonly}
                  onChange={handleChange}
                  onSubmit={onSubmit}
                  otherProps={{ onClose: handleClose }}
                />
              )}
            </FetchView>
          )}
        </Box>
        {!readonly && withActionButton && (
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

export default OutletModal;
