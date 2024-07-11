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
import TabsView from "../TabsView";

import ITabsModal from "../model/ITabsModal";

import TBehaviorSubject from "../../../model/TBehaviorSubject";
import ITabsViewProps from "../model/ITabsViewProps";
import IAnything from "../../../model/IAnything";
import TSubject from "../../../model/TSubject";
import ISize from "../../../model/ISize";

import classNames from "../../../utils/classNames";
import sleep from "../../../utils/sleep";

const Loader = () => (
  <LoaderView size={24} sx={{ height: "100%", width: "100%" }} />
);

const MODAL_ROOT = "outlet-modal__root";
const WAIT_FOR_CHANGES_DELAY = 1_000;
const RESIZE_DEBOUNCE = 10;

/**
 * Represents the props for the ITabsModal component.
 *
 * @template Data - The type of data being passed to the ITabsModal component.
 * @template Payload - The type of payload being passed to the ITabsModal component.
 *
 * @property sizeRequest - A function that determines the size of the ITabsModal.
 * @property openSubject - The behavior subject that determines if the ITabsModal is open or closed.
 * @property fullScreen - Determines if the ITabsModal should be full screen or not.
 * @property withActionButton - Determines if the ITabsModal has an action button or not.
 * @property withStaticAction - Determines if the ITabsModal has a static action or not.
 * @property title - The title of the ITabsModal.
 * @property fetchState - The fetch state of the ITabsModal.
 * @property reloadSubject - The subject that triggers a reload of the ITabsModal.
 * @property onSubmit - A function that handles the submission of data and payload.
 * @property AfterTitle - A component that is rendered after the title of the ITabsModal.
 * @property BeforeTitle - A component that is rendered before the title of the ITabsModal.
 * @property routes - The routes of the ITabsModal.
 * @property data - The data of the ITabsModal.
 * @property onLoadStart - A function that is called when the ITabsModal starts loading.
 * @property onLoadEnd - A function that is called when the ITabsModal finishes loading.
 * @property fallback - A function that is called when an error occurs in the ITabsModal.
 * @property throwError - Determines if the ITabsModal should throw an error or not.
 * @property hidden - Determines if the ITabsModal should be hidden or not.
 * @property submitLabel - The label for the submit button of the ITabsModal.
 * @property mapPayload - A function that maps the data to the payload.
 * @property mapInitialData - A function that maps the data to the initialData.
 * @property onMount - A function that is called when the ITabsModal is mounted.
 * @property onUnmount - A function that is called when the ITabsModal is unmounted.
 * @property onClose - A function that is called when the ITabsModal is closed.
 */
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
      transparentPaper: never;
    }
  > {
  sizeRequest?: (size: ISize) => {
    height: number;
    width: number;
    sx?: SxProps<any>;
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
  routes: ITabsModal<Data, Payload>[];
  data?: Data | null;
  onLoadStart?: () => void;
  onLoadEnd?: (isOk: boolean) => void;
  fallback?: (e: Error) => void;
  throwError?: boolean;
  hidden?: boolean;
  submitLabel?: string;
  submitIcon?: React.ComponentType<any>;
  mapPayload?: (data: Record<string, any>[]) => Payload | Promise<Payload>;
  mapInitialData?: (data: Record<string, any>[]) => Data | Promise<Data>;
  onMount?: () => void;
  onUnmount?: () => void;
  onClose?: () => void;
}

/**
 * This variable is used to apply custom styles to components using the `makeStyles` function from Material-UI.
 * The `makeStyles` function takes a callback function as a parameter, which allows you to define the styles using a theme object.
 *
 * @type {Function}
 * @param theme - The theme object provided by Material-UI.
 * @returns - The custom styles object.
 */
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

/**
 * SMALL_SIZE_REQUEST variable represents a size request for a modal component.
 *
 * It is a callback function that returns an object with the following properties:
 *  - height: The height of the modal in pixels. Default value is 0.
 *  - width: The width of the modal in pixels. Default value is 0.
 *  - sx: An object containing custom styling properties for the modal. It has the following properties:
 *    - maxHeight: The maximum height of the modal in CSS units. Default value is "80%".
 *    - minWidth: The minimum width of the modal in CSS units. Default value is "330px".
 *    - maxWidth: The maximum width of the modal in CSS units. Default value is "450px".
 *    - margin: The margin around the modal in CSS units. Default value is "10px".
 *
 * @type {ITabsModalProps['sizeRequest']}
 */
const SMALL_SIZE_REQUEST: ITabsModalProps['sizeRequest'] = () => ({
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
 * Function to calculate the height and width of a large size request.
 *
 * @param sizeRequest - The size request object containing the height and width.
 * @returns - The modified size request object with reduced height and width.
 */
const LARGE_SIZE_REQUEST: ITabsModalProps['sizeRequest'] = ({
  height,
  width,
}) => ({
  height: height - 50,
  width: width - 50,
});

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
  withStaticAction = false,
  throwError = false,
  submitLabel = "Submit",
  submitIcon: SubmitIcon,
  waitForChangesDelay = withStaticAction ? 0 : WAIT_FOR_CHANGES_DELAY,
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

  /**
   * Calculates the requested size based on the window size.
   *
   * @param options - The options for calculating the requested size.
   * @param options.compute - The compute function that takes the current window size and returns the requested size.
   * @param options.debounce - The debounce time in milliseconds to delay recomputing the requested size.
   * @returns The requested size with height, width, and sx properties.
   */
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

  /**
   * Updates the data and triggers the onChange event.
   *
   * @param data - The new data.
   * @param initial - Indicates if the change is initial or not.
   * @param payload - The payload associated with the change.
   * @param source - The source of the change.
   */
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

  /**
   * Increases the loading counter by 1 and invokes the onLoadStart callback if provided.
   * @function handleLoadStart
   * @returns
   */
  const handleLoadStart = () => {
    setLoading((loading) => loading + 1);
    onLoadStart && onLoadStart();
  };

  /**
   * Handles the end of a load operation.
   *
   * @param isOk - Indicates whether the load operation was successful.
   * @returns
   */
  const handleLoadEnd = (isOk: boolean) => {
    setLoading((loading) => loading - 1);
    onLoadEnd && onLoadEnd(isOk);
  };

  const waitForRender = useRenderWaiter([data], 10);

  /**
   * Waits for changes to occur.
   *
   * @async
   * @function waitForChanges
   * @returns A promise that resolves when changes occur.
   */
  const waitForChanges = async () => {
    await Promise.race([waitForRender(), sleep(waitForChangesDelay)]);
  };

  /**
   * Asynchronous function that handles accepting user input.
   * @async
   * @function handleAccept
   * @returns
   */
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

  /**
   * Executes the handleClose function asynchronously.
   *
   * @returns - A promise that resolves when the handleClose function has completed.
   */
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
                <TabsView
                  {...outletProps}
                  fullScreen={fullScreen}
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
            startIcon={SubmitIcon && <SubmitIcon />}
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
