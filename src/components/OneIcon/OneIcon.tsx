import * as React from "react";
import { useMemo, useState } from "react";

import { makeStyles } from "../../styles";

import One from "../One";

import IconButton from "@mui/material/IconButton";
import Popover from "@mui/material/Popover";
import Badge from "@mui/material/Badge";

import IOneIconProps from "./model/IOneIconProps";

import useRenderWaiter from "../../hooks/useRenderWaiter";
import useActualValue from "../../hooks/useActualValue";
import useAsyncValue from "../../hooks/useAsyncValue";
import useSingleton from "../../hooks/useSingleton";
import useChange from "../../hooks/useChange";

import getInitialData from "../../utils/getInitialData";
import singlerun from "../../utils/hof/singlerun";
import deepMerge from "../../utils/deepMerge";
import sleep from "../../utils/sleep";

import IAnything from "../../model/IAnything";
import useSubject from "../../hooks/useSubject";
import useOnce from "../../hooks/useOnce";

const WAIT_FOR_CHANGES_DELAY = 600;

const useStyles = makeStyles()((theme) => ({
  content: {
    minWidth: "300px",
    maxWidth: "80vw",
    maxHeight: "80vh",
    overflowY: "auto",
    overflowX: "hidden",
    paddingTop: theme.spacing(2),
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    paddingBottom: theme.spacing(2),
  },
}));

/** *
 * @template Data - generic type for data object
 * @template Payload - generic type for payload object
 * @typedef OneIcon
 * @property [waitForChangesDelay=WAIT_FOR_CHANGES_DELAY] - delay in milliseconds for waiting changes
 * @property [fieldDebounce] - debounce time in milliseconds for field changes
 * @property [noBadge=false] - flag to disable badge
 * @property fields - array of field objects
 * @property handler - function to handle data
 * @property [payload={}] - payload object
 * @property [badgeColor="info"] - color of the badge
 * @property [color="default"] - color of the icon button
 * @property badgeOverlap - overlap position for the badge
 * @property badgeSx - styles for the badge
 * @property oneSx - styles for the One component
 * @property onChange - function for handling the change event
 * @property onFocus - function for handling the focus event
 * @property onBlur - function for handling the blur event
 * @property buttonProps - additional props for the IconButton component
 */
export const OneIcon = <
  Data extends {} = IAnything,
  Payload extends IAnything = IAnything
>({
  waitForChangesDelay = WAIT_FOR_CHANGES_DELAY,
  fieldDebounce,
  noBadge = false,
  fields,
  handler,
  payload: upperPayload = {} as Payload,
  badgeColor = "info",
  color = "default",
  badgeOverlap,
  badgeSx,
  oneSx,
  isBaseline,
  isBaselineForRoot,
  onClose,
  onChange,
  onFocus,
  onBlur,
  onInvalid,
  reloadSubject: upperReloadSubject,
  closeSubject: upperCloseSubject,
  ...buttonProps
}: IOneIconProps<Data, Payload>) => {
  const { classes } = useStyles();

  const payload = useSingleton(upperPayload);

  const reloadSubject = useSubject(upperReloadSubject);

  const closeSubject = useSubject(upperCloseSubject);

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const [data, { loading, error, execute }, setData] = useAsyncValue(async () => {
    const getResult = async () => {
      if (typeof handler === "function") {
        return await (handler as Function)(payload);
      }
      return handler;
    };
    const data = deepMerge(
      {},
      getInitialData(fields, payload),
      await getResult()
    );
    onChange && onChange(data, true);
    return data;
  });

  useOnce(() => reloadSubject.subscribe(execute));
  useOnce(() => closeSubject.subscribe(() => setAnchorEl(null)));

  const [invalid, setInvalid] = useState(false);

  /**
   * Waits for the rendering of data to complete.
   *
   * @param data - The data to render.
   * @param timeout - The maximum time in milliseconds to wait for rendering to complete.
   * @returns - A promise that resolves when rendering is complete or rejects if it times out.
   */
  const waitForRender = useRenderWaiter([data], 10);

  const data$ = useActualValue(data);

  /**
   * This function waits for changes to occur by waiting for the first event to happen between the rendering of the page
   * and a delay specified by 'waitForChangesDelay'.
   *
   * @returns A promise that resolves when the first event occurs between the rendering of the page and the specified delay.
   */
  const waitForChanges = async () => {
    await Promise.race([waitForRender(), sleep(waitForChangesDelay)]);
  };

  useChange(() => {
    if (typeof handler !== "function") {
      setData(handler);
    }
  }, [handler]);

  /**
   * Calculate the count of filtered values based on the given data and noBadge flag.
   *
   * @param noBadge - A flag indicating whether to exclude badge values.
   * @param data - The data object containing values to filter.
   * @returns - The count of filtered values.
   */
  const filterCount = useMemo(
    () => (noBadge ? 0 : Object.values(data || {}).filter((v) => v).length),
    [data]
  );

  /**
   * useMemo function that creates a handle for closing an element.
   * The handle will trigger the provided onChange function with the current data and false,
   * and set the anchor element to null after waiting for changes.
   * @returns The handleClose function
   */
  const handleClose = useMemo(
    () =>
      singlerun(async () => {
        await waitForChanges();
        onChange && onChange(data$.current, false);
        onClose && onClose(data$.current);
        setAnchorEl(null);
      }),
    []
  );

  if (loading || error) {
    return null;
  }

  return (
    <>
      <Badge
        badgeContent={filterCount}
        overlap={badgeOverlap}
        color={badgeColor}
        sx={badgeSx}
      >
        <IconButton
          {...buttonProps}
          onClick={({ currentTarget }) => {
            if (!anchorEl) {
              setAnchorEl(currentTarget);
            }
          }}
          color={invalid ? "error" : color}
        />
      </Badge>
      <Popover
        keepMounted
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <One
          className={classes.content}
          sx={oneSx}
          transparentPaper
          fieldDebounce={fieldDebounce}
          fields={fields}
          payload={payload}
          handler={() => data}
          isBaseline={isBaseline}
          isBaselineForRoot={isBaselineForRoot}
          onChange={(data, initial) => {
            if (!initial) {
              setData(data);
              setInvalid(false);
              onChange && onChange(data, false);
            }
          }}
          onInvalid={(name, msg, payload) => {
            setInvalid(true);
            onInvalid && onInvalid(name, msg, payload);
          }}
          onFocus={onFocus}
          onBlur={onBlur}
        />
      </Popover>
    </>
  );
};

export default OneIcon;
