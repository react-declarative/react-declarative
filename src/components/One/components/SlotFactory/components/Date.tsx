import * as React from "react";
import { useState, useEffect, useRef } from "react";

import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";

import { IDateSlot } from "../../../slots/DateSlot";

import useActualValue from "../../../../../hooks/useActualValue";

import formatText from "../../../../../utils/formatText";
import { parseDate, serializeDate, DATE_PLACEHOLDER } from "../../../../../utils/datetime";

import CalendarIcon from "@mui/icons-material/CalendarTodayOutlined";

const DATE_TEMPLATE = "##/##/####";

export const Date = ({
  invalid,
  value: upperValue,
  disabled,
  readonly,
  description = "",
  outlined = true,
  title = "Text",
  placeholder = DATE_PLACEHOLDER,
  dirty,
  autoFocus,
  inputRef,
  onChange,
  name,
}: IDateSlot) => {

  const pendingUpdate = useRef(false);
  const upperValue$ = useActualValue(upperValue);

  const [value, setValue] = useState(upperValue);

  useEffect(() => {
    if (pendingUpdate.current) {
      pendingUpdate.current = false;
    } else if (parseDate(upperValue || "")) {
      setValue(upperValue);
    } else {
      setValue("");
    }
  }, [upperValue]);

  useEffect(() => {
    const { current: upperValue } = upperValue$;
    if (value !== upperValue) {
      const pendingDate = parseDate(value || "");
      pendingUpdate.current = true;
      if (pendingDate) {
        onChange(serializeDate(pendingDate));
      } else {
        onChange("");
      }
    }
  }, [value]);

  const handleChange = (value: string) => {
    const pendingValue = formatText(value, DATE_TEMPLATE, {
      allowed: /\d/,
      symbol: "#",
    });
    setValue(pendingValue);
  };

  return (
    <TextField
      inputRef={inputRef}
      InputProps={{
        readOnly: readonly,
        autoFocus,
        endAdornment: (
          <InputAdornment position="end">
            <IconButton disabled={disabled} edge="end">
              <CalendarIcon />
            </IconButton>
          </InputAdornment>
        ),
      }}
      disabled={disabled}
      focused={autoFocus}
      placeholder={placeholder}
      variant={outlined ? "outlined" : "standard"}
      value={value}
      label={title}
      name={name}
      helperText={(dirty && invalid) || description}
      error={dirty && invalid !== null}
      onChange={({ target }) => handleChange(target.value)}
    />
  );
};

export default Date;
