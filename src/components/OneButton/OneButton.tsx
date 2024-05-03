import * as React from "react";
import { useEffect, useMemo, useState } from "react";

import { makeStyles } from "../../styles";

import One from "../One";

import Popover from "@mui/material/Popover";
import Button from "@mui/material/Button";
import Badge from "@mui/material/Badge";

import IOneButtonProps from "./model/IOneButtonProps";

import useRenderWaiter from "../../hooks/useRenderWaiter";
import useActualValue from "../../hooks/useActualValue";
import useAsyncValue from "../../hooks/useAsyncValue";
import useSingleton from "../../hooks/useSingleton";
import useSubject from "../../hooks/useSubject";
import useChange from "../../hooks/useChange";

import getInitialData from "../../utils/getInitialData";
import singlerun from "../../utils/hof/singlerun";
import debounce from "../../utils/hof/debounce";
import classNames from "../../utils/classNames";
import deepMerge from "../../utils/deepMerge";
import sleep from "../../utils/sleep";

import IAnything from "../../model/IAnything";

const ONEBUTTON_CONTENT = 'react-declarative__oneButtonContent';
const WAIT_FOR_CHANGES_DELAY = 600;
const MOUSE_OUT_DEBOUNCE = 15;

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

/**
 * Represents a button component with a popover that displays a form.
 *
 * @template Data - The type of data for the form.
 * @template Payload - The type of payload for the button handler.
 *
 * @param props - The properties of the button component.
 * @param [props.waitForChangesDelay=WAIT_FOR_CHANGES_DELAY] - The delay in milliseconds to wait for changes before updating data.
 * @param [props.fieldDebounce] - The debounce time in milliseconds for input fields.
 * @param [props.noBadge=false] - Whether to display a badge on the button.
 * @param props.fields - The fields for the form.
 * @param props.handler - The handler function for the button.
 * @param [props.payload={}] - The payload for the button handler.
 * @param [props.badgeColor="info"] - The color of the badge.
 * @param [props.color="primary"] - The color of the button.
 * @param [props.badgeOverlap] - The overlap mode of the badge.
 * @param [props.badgeSx] - The styles for the badge.
 * @param [props.oneSx] - The styles for the form.
 * @param [props.onChange] - The callback function to be called when the data changes.
 * @param [props.onFocus] - The callback function to be called when a field is focused.
 * @param [props.onBlur] - The callback function to be called when a field is blurred.
 * @param [props.onInvalid] - The callback function to be called when a field is invalid.
 *
 * @returns - Returns null if loading or error, otherwise returns the button component with popover.
 */
export const OneButton = <
  Data extends {} = IAnything,
  Payload extends IAnything = IAnything
>({
  waitForChangesDelay = WAIT_FOR_CHANGES_DELAY,
  fieldDebounce,
  withCloseAfterChange = false,
  noBadge = false,
  fields,
  handler,
  payload: upperPayload = {} as Payload,
  badgeColor = "info",
  color = "primary",
  badgeOverlap,
  badgeSx,
  oneSx,
  onChange,
  onFocus,
  onBlur,
  onInvalid,
  readTransform,
  writeTransform,
  ...buttonProps
}: IOneButtonProps<Data, Payload>) => {
  const { classes } = useStyles();

  const payload = useSingleton(upperPayload);

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [readonly, setReadonly] = useState(false);

  /**
   * Represents the variable `data`.
   *
   * @typedef Data
   * @property name - The name of the data.
   * @property value - The value of the data.
   * @property isActive - Indicates whether the data is active or not.
   * @property tags - An array of tags associated with the data.
   */
  const [data, { loading, error }, setData] = useAsyncValue(async () => {
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

  const [invalid, setInvalid] = useState(false);

  const waitForRender = useRenderWaiter([data], 10);

  const data$ = useActualValue(data);

  /**
   * Waits for changes to occur by executing a Promise race between waitForRender()
   * and sleep() functions.
   *
   * @async
   * @function waitForChanges
   * @returns Resolves once changes have occurred.
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
   * Returns the count of non-empty values in the provided data object,
   * unless the noBadge flag is set to true which returns 0.
   *
   * @param data - The data object to filter values from.
   * @param noBadge - Optional. If true, the output will always be 0.
   * @returns - The count of non-empty values in the data object.
   *
   */
  const filterCount = useMemo(
    () => (noBadge ? 0 : Object.values(data || {}).filter((v) => v).length),
    [data]
  );

  /**
   * Use memoized function to handle close event.
   *
   * @param onChange - Callback function called when changes occur.
   * @param data$ - Current data object.
   * @returns - Memoized function to handle close event.
   */
  const handleClose = useMemo(
    () =>
      singlerun(async () => {
        setReadonly(true);
        await waitForChanges();
        onChange && onChange(data$.current, false);
        setAnchorEl(null);
        setReadonly(false);
      }),
    []
  );

  const changeSubject = useSubject<void>();

  useEffect(() => {
      if (!anchorEl) {
          return;
      }
      if (!withCloseAfterChange) {
        return;
      }
      let unsubscribeRef = changeSubject.once(() => {
          const handler = debounce(({ clientX, clientY }: MouseEvent) => {
              const target = document.elementFromPoint(clientX, clientY);
              if (!target?.closest(`.${ONEBUTTON_CONTENT}`)) {
                handleClose();
                unsubscribeRef && unsubscribeRef();
              }
          }, MOUSE_OUT_DEBOUNCE);
          document.addEventListener('mousemove', handler);
          unsubscribeRef = () => {
              document.removeEventListener('mousemove', handler);
              handler.clear();
          };
      });
      return () => unsubscribeRef();
  }, [anchorEl]);

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
        <Button
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
          className={classNames(classes.content, ONEBUTTON_CONTENT)}
          sx={oneSx}
          transparentPaper
          fieldDebounce={fieldDebounce}
          fields={fields}
          payload={payload}
          handler={() => data}
          readonly={readonly}
          onChange={(data, initial) => {
            if (!initial) {
              setData(data);
              setInvalid(false);
              onChange && onChange(data, false);
              changeSubject.next();
            }
          }}
          onInvalid={(name, msg, payload) => {
            setInvalid(true);
            onInvalid && onInvalid(name, msg, payload);
          }}
          readTransform={readTransform}
          writeTransform={writeTransform}
          onFocus={onFocus}
          onBlur={onBlur}
        />
      </Popover>
    </>
  );
};

export default OneButton;
