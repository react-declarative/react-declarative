import * as React from "react";
import { useState, useEffect, useRef } from "react";

import { makeStyles } from "../../../styles";
import { SxProps } from "@mui/material";

import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";

import useRenderWaiter from "../../../hooks/useRenderWaiter";
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
import ISize from "../../../model/ISize";
import Id from "../model/Id";

import classNames from "../../../utils/classNames";
import sleep from "../../../utils/sleep";

const Loader = () => (
  <LoaderView size={24} sx={{ height: "100%", width: "100%" }} />
);

const WAIT_FOR_CHANGES_DELAY = 1_000;
const MODAL_ROOT = "outlet-modal__root";
const RESIZE_DEBOUNCE = 10;

/**
 * Interface for the OutletModalProps class.
 * @template Data - The data type for storing the data.
 * @template Payload - The payload type.
 * @template Params - The params type.
 */
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
  sizeRequest?: (size: ISize) => {
    height: number;
    width: number;
    sx?: SxProps;
  };
  fullScreen?: boolean;
  withActionButton?: boolean;
  withStaticAction?: boolean;
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
    onClose: () => void;
    data: Data | null;
    id: string;
  }>;
  BeforeTitle?: React.ComponentType<{
    onClose: () => void;
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

/**
 * Represents the small size request for an outlet modal.
 */
const SMALL_SIZE_REQUEST: IOutletModalProps['sizeRequest'] = () => ({
  height: 0,
  width: 0,
  sx: {
    maxHeight: "80%",
    minWidth: "330px",
    maxWidth: "450px",
    margin: "10px",
  },
});

/**
 * Represents a function that modifies the height and width of an outlet modal.
 *
 * @param sizeRequest - The original size request of the outlet modal.
 * @param sizeRequest.height - The original height of the outlet modal.
 * @param sizeRequest.width - The original width of the outlet modal.
 *
 * @returns - The modified size request of the outlet modal.
 * @returns - The modified height of the outlet modal.
 * @returns - The modified width of the outlet modal.
 */
const LARGE_SIZE_REQUEST: IOutletModalProps['sizeRequest'] = ({
  height,
  width,
}) => ({
  height: height - 50,
  width: width - 50,
});


/**
 * A modal component for displaying and editing data.
 *
 * @template Data - The type of the data to be displayed in the modal.
 * @template Payload - The type of the payload to be passed when submitting the form.
 * @template Params - The type of the parameters to pass to the map functions.
 *
 * @typedef {Object} OutletModal
 * @property {boolean} withActionButton - Determines whether to display an action button in the modal. Default is `false`.
 * @property {boolean} hidden - Determines whether the modal is hidden. Default is `false`.
 * @property {function} onSubmit - Callback function that is called when the form is submitted. Default is `() => true`.
 * @property {function} onChange - Callback function that is called when the form data changes. Default is `() => undefined`.
 * @property {function} mapParams - Function to transform the outlet ID into request parameters. Default is `(id) => ({ id })`.
 * @property {function} mapInitialData - Function to map the outlet ID and additional arguments to initial data. Default is `(id) => ({ id })`.
 * @property {function} mapPayload - Function to map the outlet ID and additional arguments to payload data. Default is `(id) => ({ id })`.
 * @property {boolean} fullScreen - Determines whether the modal should be fullscreen. Default is `true`.
 * @property {Object} sizeRequest - Size request object that defines the height, width, and sx properties of the modal.
 * @property {function} onLoadStart - Callback function that is called when loading starts. Default is `undefined`.
 * @property {function} onLoadEnd - Callback function that is called when loading ends. Default is `undefined`.
 * @property {Object} fallback - Fallback component to be rendered if an error occurs.
 * @property {Object} reloadSubject - Observable subject for triggering a reload of the modal.
 * @property {Object} outletIdSubject - Observable subject for providing the outlet ID.
 * @property {function} fetchState - Function to return the current fetch state. Default is `() => ({})`.
 * @property {Object} AfterTitle - Component to be rendered after the title.
 * @property {Object} BeforeTitle - Component to be rendered before the title.
 * @property {string} title - The title of the modal.
 * @property {Data} data - The initial data to be displayed in the modal. Default is `null`.
 * @property {boolean} withStaticAction - Determines whether the action button should always be enabled. Default is `false`.
 * @property {boolean} throwError - Determines whether to throw an error if an exception occurs. Default is `false`.
 * @property {string} submitLabel - The label of the action button. Default is "Submit".
 * @property {number} waitForChangesDelay - The delay in milliseconds to wait for changes before submitting the form. Default is `0`.
 * @property {boolean} readonly - Determines whether the modal is in read-only mode. Default is `false`.
 * @property {function} onMount - Callback function that is called when the modal is mounted. Default is `undefined`.
 * @property {function} onUnmount - Callback function that is called when the modal is unmounted. Default is `undefined`.
 * @property {function} onClose - Callback function that is called when the modal is closed. Default is `() => null`.
 * @property {Object} outletProps - Additional props to pass to the `OutletView` component.
 *
 * @param props - The props for the OutletModal component.
 * @returns - The rendered outlet modal component.
 */
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
  fullScreen = true,
  sizeRequest = fullScreen ? LARGE_SIZE_REQUEST : SMALL_SIZE_REQUEST,
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
  withStaticAction = false,
  throwError = false,
  submitLabel = "Submit",
  waitForChangesDelay = withStaticAction ? 0 : WAIT_FOR_CHANGES_DELAY,
  readonly,
  onMount,
  onUnmount,
  onClose = () => null,
  ...outletProps
}: IOutletModalProps<Data, Payload, Params>) => {
  const [id, setId] = useState<string | null>(outletIdSubject.data);
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
      if (id) {
        await waitForChanges();
        await onSubmit(id, withStaticAction ? {} as Data : data, payloadRef.current);
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
      className={classes.root}
      open={!!id}
      sx={{
        ...(hidden && {
          visibility: "hidden",
          opacity: 0,
        }),
      }}
      onClose={() => {
        if (!!id) {
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
                  onSubmit={async (data, payload) => await onSubmit(id, data, payload)}
                  otherProps={{ onClose: handleClose }}
                />
              )}
            </FetchView>
          )}
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

export default OutletModal;
