import * as React from "react";
import { useState, useEffect, useRef } from "react";

import { makeStyles } from "../../../styles";
import { SxProps } from "@mui/material";

import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";

import useRenderWaiter from "../../../hooks/useRenderWaiter";
import useSubjectValue from "../../../hooks/useSubjectValue";
import useActualState from "../../../hooks/useActualState";
import useWindowSize from "../../../hooks/useWindowSize";

import ActionButton from "../../ActionButton";
import FetchView, { IFetchViewProps } from "../../FetchView";
import LoaderView from "../../LoaderView";
import WizardView from "../WizardView";

import IWizardModal from "../model/IWizardModal";

import TBehaviorSubject from "../../../model/TBehaviorSubject";
import IWizardViewProps from "../model/IWizardViewProps";
import IAnything from "../../../model/IAnything";
import TSubject from "../../../model/TSubject";
import ISize from "../../../model/ISize";

import classNames from "../../../utils/classNames";
import sleep from "../../../utils/sleep";

const Loader = () => (
  <LoaderView size={24} sx={{ height: "100%", width: "100%" }} />
);

const WAIT_FOR_CHANGES_DELAY = 1_000;
const MODAL_ROOT = "outlet-modal__root";
const RESIZE_DEBOUNCE = 10;

/**
 * Interface for props of the WizardModal component.
 *
 * @template Data - The type of data passed to the wizard.
 * @template Payload - The type of payload passed to the wizard.
 */
export interface IWizardModalProps<
  Data extends {} = Record<string, any>,
  Payload = IAnything
> extends Omit<
    IWizardViewProps<Data, Payload>,
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
      transparentPaper: never;
    }
  > {
  sizeRequest?: (size: ISize) => {
    height: number;
    width: number;
    sx?: SxProps;
  };
  openSubject: TBehaviorSubject<boolean>;
  fullScreen?: boolean;
  withActionButton?: boolean;
  withStaticAction?: boolean;
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
  routes: IWizardModal<Data, Payload>[];
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
    overflow: "hidden",
    "& > *": {
      flex: 1,
    },
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

const SMALL_SIZE_REQUEST: IWizardModalProps['sizeRequest'] = () => ({
  height: 0,
  width: 0,
  sx: {
    maxHeight: "80%",
    minWidth: "330px",
    maxWidth: "450px",
    margin: "10px",
  },
});

const LARGE_SIZE_REQUEST: IWizardModalProps['sizeRequest'] = ({
  height,
  width,
}) => ({
  height: height - 50,
  width: width - 50,
});

/**
 * OutletModal is a component that displays a modal with a form and allows the user to submit the form data.
 *
 * @template Data - The type of the form data
 * @template Payload - The type of the payload to be sent when submitting the form
 *
 * @param withActionButton - If true, display a submit button in the modal (default: false)
 * @param hidden - If true, the modal is hidden (default: false)
 * @param onSubmit - The function to handle form submission (default: () => true)
 * @param onChange - The function to handle form data changes (default: () => undefined)
 * @param mapInitialData - The function to map the initial form data (default: () => ({} as Data))
 * @param mapPayload - The function to map the payload to be sent (default: () => ({} as Payload))
 * @param onLoadStart - The function to be called when data loading starts
 * @param onLoadEnd - The function to be called when data loading ends
 * @param fallback - The function to be called if an error occurs (default: undefined)
 * @param fullScreen - If true, the modal will occupy the full screen (default: true)
 * @param sizeRequest - The function to compute the size of the modal (default: fullScreen ? LARGE_SIZE_REQUEST : SMALL_SIZE_REQUEST)
 * @param reloadSubject - The subject to trigger form data reload
 * @param fetchState - The function to compute the state of the data fetching (default: () => ({}))
 * @param AfterTitle - The component to be rendered after the title
 * @param BeforeTitle - The component to be rendered before the title
 * @param title - The title of the modal
 * @param upperData - The initial form data (default: null)
 * @param throwError - If true, throw an error when an error occurs (default: false)
 * @param withStaticAction - If true, the submit button is always enabled (default: false)
 * @param waitForChangesDelay - The delay in ms to wait for form data changes (default: withStaticAction ? 0 : WAIT_FOR_CHANGES_DELAY)
 * @param submitLabel - The label of the submit button (default: "Submit")
 * @param openSubject - The subject to control the visibility of the modal
 * @param readonly - If true, the form is read-only (default: undefined)
 * @param routes - The routes object for the wizard component
 * @param onMount - The function to be called when the component is mounted
 * @param onUnmount - The function to be called when the component is unmounted
 * @param onClose - The function to handle modal closure (default: () => null)
 * @param outletProps - Other props for the OutletModal component
 *
 * @returns The rendered OutletModal component
 */
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
  fullScreen = true,
  sizeRequest = fullScreen ? LARGE_SIZE_REQUEST : SMALL_SIZE_REQUEST,
  reloadSubject,
  fetchState = () => ({}),
  AfterTitle,
  BeforeTitle,
  title,
  data: upperData = null,
  throwError = false,
  withStaticAction = false,
  waitForChangesDelay = withStaticAction ? 0 : WAIT_FOR_CHANGES_DELAY,
  submitLabel = "Submit",
  openSubject,
  readonly,
  routes,
  onMount,
  onUnmount,
  onClose = () => null,
  ...outletProps
}: IWizardModalProps<Data, Payload>) => {
  const { classes } = useStyles();

  const open = useSubjectValue(openSubject, !!openSubject.data)

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
      await waitForChanges();
      await onSubmit(withStaticAction ? {} as Data : data, payloadRef.current);
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
                <WizardView
                  {...outletProps}
                  className={classes.inner}
                  routes={routes as any}
                  transparentPaper
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
