import * as React from "react";
import { useState, useEffect, useRef } from "react";

import { makeStyles } from "../../../styles";

import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";

import useActualState from "../../../hooks/useActualState";
import useWindowSize from "../../../hooks/useWindowSize";
import useChange from "../../../hooks/useChange";

import ActionButton from "../../ActionButton";
import FetchView, { IFetchViewProps } from "../../FetchView";
import LoaderView from "../../LoaderView";
import OutletView from "../OutletView";

import IOutletModal, { ModalOtherProps } from "../model/IOutletModal";

import IOutletViewProps from "../model/IOutletViewProps";
import TBehaviorSubject from "../../../model/TBehaviorSubject";
import IAnything from "../../../model/IAnything";
import TSubject from "../../../model/TSubject";
import Id from "../model/Id";

import classNames from "../../../utils/classNames";

const Loader = () => (
  <LoaderView size={24} sx={{ height: "100%", width: "100%" }} />
);

const MODAL_ROOT = "outlet-modal__root";
const RESIZE_DEBOUNCE = 10;

export interface IOutletModalProps<
  Data extends {} = Record<string, any>,
  Payload = IAnything,
  Params = IAnything
> extends Omit<
    IOutletViewProps<Data, Payload, Params, ModalOtherProps>,
    keyof {
      otherProps: never;
      onSubmit: never;
      initialData: never;
      payload: never;
      params: never;
      routes: never;
      data: never;
      id: never;
    }
  > {
  withActionButton?: boolean;
  outletIdSubject: TBehaviorSubject<Id | null>;
  title?: string;
  fetchState?: IFetchViewProps<Id>["state"];
  reloadSubject?: TSubject<void>;
  onSubmit?: (
    id: Id,
    data: Data | null,
    payload: Payload
  ) => Promise<boolean> | boolean;
  AfterTitle?: React.ComponentType<{
    onClose?: () => void;
    data: Data | null;
    id: string;
  }>;
  BeforeTitle?: React.ComponentType<{
    onClose?: () => void;
    data: Data | null;
    id: string;
  }>;
  routes: IOutletModal<Data, Payload, Params>[];
  data?: Data | null;
  onLoadStart?: () => void;
  onLoadEnd?: (isOk: boolean) => void;
  fallback?: (e: Error) => void;
  throwError?: boolean;
  hidden?: boolean;
  submitLabel?: string;
  mapPayload?: (
    id: Id,
    data: Record<string, any>[]
  ) => Payload | Promise<Payload>;
  mapParams?: (id: Id, data: Record<string, any>[]) => Params | Promise<Params>;
  mapInitialData?: (
    id: Id,
    data: Record<string, any>[]
  ) => Data | Promise<Data>;
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
  Payload = IAnything,
  Params = IAnything
>({
  withActionButton = false,
  hidden = false,
  onSubmit = () => true,
  onChange = () => undefined,
  mapParams = (id) => ({ id } as unknown as Params),
  mapInitialData = (id) => ({ id } as unknown as Data),
  mapPayload = (id) => ({ id } as unknown as Payload),
  onLoadStart,
  onLoadEnd,
  fallback,
  reloadSubject,
  outletIdSubject,
  fetchState = () => ({}),
  AfterTitle,
  BeforeTitle,
  title,
  data: upperData = null,
  throwError = false,
  submitLabel = "Submit",
  readonly,
  onMount,
  onUnmount,
  onClose = () => null,
  ...outletProps
}: IOutletModalProps<Data, Payload, Params>) => {
  const [id, setId] = useState<string | null>(outletIdSubject.data);
  const { classes } = useStyles();

  const { height, width } = useWindowSize({
    compute: ({ height, width }) => ({
      height: Math.floor((height - 50) / 2),
      width: Math.floor((width - 50) / 2),
    }),
    debounce: RESIZE_DEBOUNCE,
  });

  useEffect(
    () =>
      outletIdSubject.subscribe((id) => {
        setId(id);
      }),
    []
  );

  useChange(() => {
    if (!id) {
      onClose && onClose();
    }
  }, [id]);

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
      if (id) {
        if (withActionButton) {
          await onSubmit(id, {} as Data, payloadRef.current);
        } else {
          await onSubmit(id, data, payloadRef.current);
        }
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
      if (id) {
        await onSubmit(id, null, payloadRef.current);
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
      open={!!id}
      sx={{
        ...(hidden && {
          visibility: "hidden",
          opacity: 0,
        }),
      }}
      onClose={handleClose}
    >
      <Box
        className={classNames(classes.root, MODAL_ROOT)}
        sx={{
          transform: `translate(-${width}px, -${height}px) !important`,
        }}
      >
        {title && (
          <div className={classes.title}>
            {BeforeTitle && (
              <BeforeTitle
                id={id || "unknown"}
                data={data}
                onClose={handleClose}
              />
            )}
            <Typography className={classes.stretch} variant="h6" component="h2">
              {title}
            </Typography>
            {AfterTitle && (
              <AfterTitle
                id={id || "unknown"}
                data={data}
                onClose={handleClose}
              />
            )}
          </div>
        )}
        <Box className={classes.content}>
          {!!id && (
            <FetchView
              animation="none"
              payload={id}
              state={fetchState}
              reloadSubject={reloadSubject}
              fallback={fallback}
              onLoadStart={onLoadStart}
              onLoadEnd={onLoadEnd}
              Loader={Loader}
            >
              {async (...args) => (
                  <OutletView
                    {...outletProps}
                    fallback={fallback}
                    onLoadStart={onLoadStart}
                    onLoadEnd={onLoadEnd}
                    initialData={await mapInitialData(id, args.flat(1))}
                    payload={await mapPayload(id, args.flat(1))}
                    params={await mapParams(id, args.flat(1))}
                    readonly={readonly}
                    onChange={handleChange}
                    otherProps={{ onClose }}
                  />
                )}
            </FetchView>
          )}
        </Box>
        {!readonly && (
          <ActionButton
            className={classes.submit}
            disabled={!withActionButton && (!!loading.current || !data)}
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
