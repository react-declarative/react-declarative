import * as React from "react";
import { useState, useEffect, useRef, useMemo, useLayoutEffect } from "react";
import dayjs from "dayjs";

import Popover from "@mui/material/Popover";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";

import DatePicker from "../../../../common/DatePicker/DatePicker";

import { IDateSlot } from "../../../slots/DateSlot";

import useActualValue from "../../../../../hooks/useActualValue";

import { useOneMenu } from "../../../context/MenuProvider";

import formatText from "../../../../../utils/formatText";
import * as datetime from "../../../../../utils/datetime";

import CalendarIcon from "@mui/icons-material/CalendarTodayOutlined";

const DATE_TEMPLATE = "##/##/####";
const NEVER_POS = Symbol("never-pos");

const getCaretPos = (element: HTMLInputElement | HTMLTextAreaElement) => {
  return element.selectionStart || element.value.length;
};

/**
 * Represents a Date component.
 *
 * @param Date - The options for the Date component.
 * @param Date.invalid - If the date value is invalid.
 * @param Date.incorrect - If the date value is incorrect.
 * @param Date.value - The uppercased value of the date.
 * @param Date.disabled - If the Date component is disabled.
 * @param Date.readonly - If the Date component is readonly.
 * @param Date.description - The description for the Date component.
 * @param Date.outlined - If the Date component should be outlined.
 * @param Date.title - The text to be displayed as the label for the Date component.
 * @param Date.placeholder - The placeholder text for the Date component.
 * @param Date.labelShrink - If the label should shrink when the Date component is focused.
 * @param Date.dirty - If the Date component is dirty.
 * @param Date.autoFocus - If the Date component should autofocus.
 * @param Date.inputRef - A reference to the input element of the Date component.
 * @param Date.onChange - A callback function to be called when the value of the Date component changes.
 * @param Date.withContextMenu - If the Date component should display a context menu.
 */
export const Date = ({
  invalid,
  incorrect,
  value: upperValue,
  disabled,
  readonly,
  description = "",
  outlined = false,
  title = "Text",
  placeholder = datetime.DATE_PLACEHOLDER,
  labelShrink,
  dirty,
  autoFocus,
  inputRef,
  onChange,
  withContextMenu,
}: IDateSlot) => {
  const { requestSubject } = useOneMenu();

  const inputElementRef = useRef<HTMLInputElement | null>();

  const incomingUpdate = useRef(false);
  const outgoingUpdate = useRef(false);

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  /**
   * Handles the click event on a button element.
   *
   * @param event - The click event object.
   * @returns
   */
  const handleClick = ({
    clientX,
    clientY,
    target,
  }: React.MouseEvent<HTMLButtonElement>) => {
    const pointTarget = document.elementFromPoint(clientX, clientY);
    if (pointTarget) {
      setAnchorEl(pointTarget as HTMLButtonElement);
      return;
    }
    setAnchorEl(target as unknown as HTMLButtonElement);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const [value, setValue] = useState(
    datetime.parseDate(upperValue || "") ? upperValue : ""
  );

  const value$ = useActualValue(value);

  useEffect(() => {
    if (outgoingUpdate.current) {
      outgoingUpdate.current = false;
    } else if (datetime.parseDate(upperValue || "")) {
      incomingUpdate.current = true;
      setValue(upperValue);
    } else if (value$.current) {
      incomingUpdate.current = true;
      setValue("");
    }
  }, [upperValue]);

  const upperValue$ = useActualValue(upperValue);

  useEffect(() => {
    if (incomingUpdate.current) {
      incomingUpdate.current = false;
    } else {
      const pendingDate = datetime.parseDate(value || "");
      if (pendingDate) {
        outgoingUpdate.current = true;
        onChange(datetime.serializeDate(pendingDate));
      } else if (upperValue$.current) {
        outgoingUpdate.current = true;
        onChange("");
      }
    }
  }, [value]);

  /**
   * Handles the change event for the given value.
   *
   * @param value - The value to handle the change event for.
   *
   * @returns
   */
  const handleChange = (value: string) => {
    let result = "";
    for (let i = 0; i < value.length; i++) {
      result += value[i];
      result = formatText(result, DATE_TEMPLATE, {
        allowed: /\d/,
        symbol: "#",
      });
    }
    caretManager.pos();
    setValue(result);
  };

  /**
   * Represents a memoized Day.js value.
   *
   * This variable is created using the useMemo hook to memoize the Day.js value based on the provided value.
   * If the value is truthy, a Day.js instance is created by parsing the value using the datetime.parseDate function.
   * If the parsed date is valid, the current time is set to the parsed date's day, month, and year values.
   *
   * @type {DayJS | undefined}
   * @since [Initial version]
   * @see datetime.parseDate
   * @see https://day.js.org/
   */
  const dayjsValue = useMemo(() => {
    if (value) {
      const date = datetime.parseDate(value);
      if (!date) {
        return undefined;
      }
      let now = dayjs();
      now = now.set("date", date.day);
      now = now.set("month", date.month - 1);
      now = now.set("year", date.year);
      return now;
    }
    return undefined;
  }, [value]);

  /**
   * Represents a caret manager for handling caret position in an input element.
   * @typedef {Object} CaretManager
   * @property {Function} render - Renders the caret at the last known position.
   * @property {Function} pos - Returns the current caret position in the input element.
   */
  const caretManager = useMemo(() => {
    let lastPos: symbol | number = NEVER_POS;

    const getAdjust = (pos: number) => {
      let adjust = 0;
      for (let i = Math.max(pos - 1, 0); i < DATE_TEMPLATE.length; i++) {
        const char = DATE_TEMPLATE[i];
        if (char === "#") {
          break;
        }
        adjust += 1;
      }
      return adjust;
    };

    return {
      render: () => {
        const { current: input } = inputElementRef;
        if (typeof lastPos === "number") {
          input?.setSelectionRange(lastPos, lastPos);
          lastPos = NEVER_POS;
        }
      },
      pos: () => {
        const { current: input } = inputElementRef;
        if (input) {
          lastPos = getCaretPos(input);
          lastPos += getAdjust(lastPos);
        }
        return lastPos;
      },
    };
  }, []);

  useLayoutEffect(() => {
    const { current: input } = inputElementRef;
    const handler = () => caretManager.pos();
    input && input.addEventListener("keyup", handler);
    input && input.addEventListener("click", handler);
    return () => {
      input && input.removeEventListener("keyup", handler);
      input && input.removeEventListener("click", handler);
    };
  }, [inputElementRef.current]);

  useLayoutEffect(() => {
    caretManager.render();
  }, [value]);

  useEffect(() => withContextMenu && requestSubject.subscribe(handleClose), []);

  return (
    <>
      <TextField
        inputRef={(input: HTMLInputElement | null) => {
          inputElementRef.current = input;
          inputRef && inputRef(input);
        }}
        sx={{
          ...(!outlined && {
            position: "relative",
            mt: 1,
            "& .MuiFormHelperText-root": {
              position: "absolute",
              top: "100%",
            },
          }),
        }}
        type="text"
        InputProps={{
          readOnly: readonly,
          autoFocus,
          endAdornment: (
            <InputAdornment sx={{ position: "relative" }} position="end">
              <IconButton onClick={handleClick} disabled={disabled} edge="end">
                <CalendarIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
        InputLabelProps={
          labelShrink
            ? {
                shrink: labelShrink,
              }
            : undefined
        }
        disabled={disabled}
        focused={autoFocus}
        placeholder={placeholder}
        variant={outlined ? "outlined" : "standard"}
        value={value}
        label={title}
        helperText={(dirty && (invalid || incorrect)) || description}
        error={dirty && (invalid !== null || incorrect !== null)}
        onChange={({ target }) => handleChange(target.value)}
      />
      <Popover
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <DatePicker
          date={dayjsValue}
          onChange={(value: dayjs.Dayjs | null) => {
            if (value) {
              const day = value.get("date");
              const month = value.get("month") + 1;
              const year = value.get("year");
              setValue(new datetime.Date(day, month, year).toString());
              return;
            }
            setValue(null);
          }}
        />
      </Popover>
    </>
  );
};

export default Date;
