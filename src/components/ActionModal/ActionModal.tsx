import * as React from "react";
import { useCallback, useState } from "react";

import { makeStyles } from "../../styles";
import { SxProps } from "@mui/material";

import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import LinearProgress from "@mui/material/LinearProgress";

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

/**
 * Interface representing the props for the ActionModal component.
 * @template Data - The type of the data.
 * @template Payload - The type of the payload.
 * @template Field - The type of the field.
 * @template Param - The type of the parameter.
 */
export interface IActionModalProps<
  Data extends IAnything = IAnything,
  Payload = IAnything,
  Field = IField<Data>,
  Param = any
> {
  sizeRequest?: (size: ISize) => {
    height: number;
    width: number;
    sx?: SxProps<any>;
  };
  withLoader?: boolean;
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
  isBaselineForRoot?: IOneProps<Data, Payload>["isBaselineForRoot"];
  isBaseline?: IOneProps<Data, Payload>["isBaseline"];
  features?: IOnePublicProps<Data, Payload>["features"];
  outlinePaper?: IOneProps<Data, Payload>["outlinePaper"];
  transparentPaper?: IOneProps<Data, Payload>["transparentPaper"];
  handler?: IOneProps<Data, Payload>["handler"];
  payload?: IOneProps<Data, Payload>["payload"];
  changeSubject?: IOneProps<Data, Payload>["changeSubject"];
  reloadSubject?: IOneProps<Data, Payload>["reloadSubject"];
  readTransform?: IOnePublicProps<Data, Payload>["readTransform"];
  writeTransform?: IOnePublicProps<Data, Payload>["writeTransform"];
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
  submitIcon?: React.ComponentType<any>;
}

const WAIT_FOR_CHANGES_DELAY = 1_000;
const LOADER_HEIGHT = 4;

const useStyles = makeStyles()((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: "hidden",
  },
  container: {
    position: 'static',

    padding: 20,
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    justifyContent: "stretch",

    backgroundColor: theme.palette.background.paper,

    borderRadius: 5,
    gap: 5,
  },
  loader: {
    minHeight: `${LOADER_HEIGHT}px`,
    maxHeight: `${LOADER_HEIGHT}px`,
    marginTop: `-${LOADER_HEIGHT}px`,
    zIndex: 2,
    width: "100%",
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

/**
 * The `SMALL_SIZE_REQUEST` variable is a function that returns an object containing the properties for
 * configuring the size of a modal component. It is of type `IActionModalProps['sizeRequest']`.
 *
 * @returns The size configuration object.
 * @property height - The height of the modal component. This value is set to 0.
 * @property width - The width of the modal component. This value is set to 0.
 * @property sx - An object with additional style properties for the modal component.
 * @property sx.maxHeight - The maximum height of the modal component. This value is set to "80%".
 * @property sx.minWidth - The minimum width of the modal component. This value is set to "330px".
 * @property sx.maxWidth - The maximum width of the modal component. This value is set to "450px".
 * @property sx.margin - The margin around the modal component. This value is set to "10px".
 */
export const SMALL_SIZE_REQUEST: IActionModalProps['sizeRequest'] = () => ({
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
 * Description: A function that modifies the size request for a modal action.
 *
 * @param sizeRequest - The original size request object containing height and width.
 * @param sizeRequest.height - The current height of the modal.
 * @param sizeRequest.width - The current width of the modal.
 *
 * @returns - The modified size request object with reduced height and width.
 * @returns - The modified size request object with reduced height.
 * @returns - The modified size request object with reduced width.
 */
export const LARGE_SIZE_REQUEST: IActionModalProps['sizeRequest'] = ({
  height,
  width,
}) => ({
  height: height - 50,
  width: width - 50,
});

/**
 * ActionModal is a component that renders a modal dialog with customizable fields and actions.
 *
 * @template Data - The type of data for the fields in the modal.
 * @template Payload - The type of payload that will be passed to the onSubmit callback.
 * @template Field - The type of field that will be rendered in the modal.
 *
 * @typedef IActionModalProps - The props for the ActionModal component.
 * @property [withActionButton=true] - Determines whether an action button should be displayed.
 * @property [withStaticAction=false] - Determines whether a static action should be displayed.
 * @property [waitForChangesDelay=0] - The amount of time to wait for any changes before submitting the form.
 * @property [onSubmit=()=>true] - The callback function to be called when the form is submitted.
 * @property [onChange=()=>undefined] - The callback function to be called when any field changes.
 * @property [onInvalid=()=>undefined] - The callback function to be called when a field becomes invalid.
 * @property [onLoadStart] - The callback function to be called when the form starts loading.
 * @property [onLoadEnd] - The callback function to be called when the form finishes loading.
 * @property [fallback] - The fallback component to be displayed when an error occurs.
 * @property [fields] - The fields to be rendered in the form.
 * @property [param] - Additional parameter to be passed to the onSubmit callback.
 * @property [handler] - The function to be called when any field changes its value.
 * @property [payload={}] - The payload to be passed to the onSubmit callback.
 * @property [fullScreen=false] - Determines whether the modal should be displayed in full screen.
 * @property [sizeRequest] - The function to compute the size of the modal.
 * @property [title] - The title to be displayed in the modal.
 * @property [apiRef] - Reference to the api.
 * @property [features] - Additional features for the ActionModal.
 * @property [changeSubject] - Subject for changes.
 * @property [reloadSubject] - Subject for reloads.
 * @property [outlinePaper=false] - Determines whether the paper component should have an outline.
 * @property [transparentPaper=false] - Determines whether the paper component should be transparent.
 * @property [open=true] - Determines whether the modal is open.
 * @property [dirty=false] - Determines whether any field in the form is dirty.
 * @property [hidden=false] - Determines whether the modal is hidden.
 * @property [readonly=false] - Determines whether the modal is read-only.
 * @property [throwError=false] - Determines whether an error should be thrown on submission error.
 * @property [submitLabel='Submit'] - The label to be displayed on the action button.
 * @property [AfterTitle] - The component to be displayed after the title.
 * @property [BeforeTitle] - The component to be displayed before the title.
 *
 * @param props - The props for the ActionModal component.
 * @returns - The rendered modal component.
 */
export const ActionModal = <
  Data extends IAnything = IAnything,
  Payload = IAnything,
  Field = IField<Data>
>({
  withActionButton = true,
  withStaticAction = false,
  withLoader = false,
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
  isBaselineForRoot,
  isBaseline,
  outlinePaper = false,
  transparentPaper = false,
  open = true,
  dirty = false,
  hidden = false,
  readonly = false,
  throwError = false,
  submitLabel = "Submit",
  submitIcon: SubmitIcon,
  AfterTitle,
  BeforeTitle,
  readTransform,
  writeTransform,
}: IActionModalProps<Data, Payload, Field>) => {
  const { classes } = useStyles();

  const payload = useSingleton(upperPayload);

  /**
   * Calculate the requested size based on the window size.
   *
   * @param options - The options to customize the calculation.
   * @param options.compute - The function to compute the requested size based on the window size.
   * @param options.debounce - The debounce delay in milliseconds to prevent frequent recalculations.
   *
   * @returns - The requested size object with height, width, and sx properties.
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

  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useActualState(0);

  const data$ = useActualValue(data);

  /**
   * Updates the data and triggers the onChange event.
   *
   * @param newData - The new data to be set.
   * @param initial - Flag indicating if it's the initial data.
   * @returns
   */
  const handleChange = (newData: Data, initial: boolean) => {
    setData(newData);
    onChange(newData, initial);
  };

  /**
   * Renders a loader component based on the state of loading and progress.
   *
   * @returns - The loader component to be rendered.
   */
  const renderLoader = useCallback(() => {
    if (!withLoader) {
      return null;
    }
    if (loading.current) {
      return (
        <LinearProgress className={classes.loader} variant="indeterminate" />
      );
    }
    return null;
  }, [loading.current]);

  /**
   * Handles invalid name and message.
   *
   * @param name - The name that is considered invalid.
   * @param msg - The error message associated with the invalid name.
   * @returns
   */
  const handleInvalid = (name: string, msg: string) => {
    setData(null);
    onInvalid(name, msg);
  };

  /**
   * Increments the loading count and triggers the onLoadStart callback function if provided.
   */
  const handleLoadStart = () => {
    setLoading((loading) => loading + 1);
    onLoadStart && onLoadStart();
  };

  /**
   * Decreases the loading count and triggers the onLoadEnd callback if it exists.
   *
   * @param isOk - Indicates if the load operation is successful.
   * @returns
   */
  const handleLoadEnd = (isOk: boolean) => {
    setLoading((loading) => loading - 1);
    onLoadEnd && onLoadEnd(isOk);
  };

  /**
   * Creates a render waiter function to wait for a specified time limit before rendering the data.
   *
   * @param data - The data to be rendered.
   * @param timeout - The time limit in milliseconds to wait for rendering.
   * @returns - The render waiter function.
   */
  const waitForRender = useRenderWaiter([data], 10);

  /**
   * Waits for changes to occur by executing a Promise race
   * between the "waitForRender" function and a sleep function
   * with a delay specified by "waitForChangesDelay".
   *
   * @returns - A promise that resolves when changes occur.
   */
  const waitForChanges = async () => {
    await Promise.race([waitForRender(), sleep(waitForChangesDelay)]);
  };

  /**
   * A function that handles the acceptance of data.
   *
   * @async
   * @function handleAccept
   *
   * @returns A promise that resolves when acceptance is complete.
   */
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

  /**
   * Handles closing of a component.
   *
   * @async
   * @function handleClose
   * @returns - A promise that resolves once the closing process is completed.
   *
   * @throws - Throws any error that occurred during the closing process.
   */
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
        {renderLoader()}
        <Box className={classes.content}>
          <One
            apiRef={apiRef}
            changeSubject={changeSubject}
            reloadSubject={reloadSubject}
            className={classNames({
              [classes.disabled]: !!loading.current,
            })}
            isBaselineForRoot={isBaselineForRoot}
            isBaseline={isBaseline}
            readonly={!!loading.current || readonly}
            outlinePaper={outlinePaper}
            transparentPaper={transparentPaper}
            invalidity={handleInvalid}
            change={handleChange}
            handler={handler}
            payload={payload}
            fields={fields}
            dirty={dirty}
            features={features}
            readTransform={readTransform}
            writeTransform={writeTransform}
            loadStart={(source) => {
              if (source === "one-resolve") {
                handleLoadStart();
              }
            }}
            loadEnd={(isOk, source) => {
              if (source === "one-resolve") {
                handleLoadEnd(isOk);
              }
            }}
          />
        </Box>
        {!readonly && withActionButton && (
          <ActionButton
            className={classes.submit}
            startIcon={SubmitIcon && <SubmitIcon />}
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
