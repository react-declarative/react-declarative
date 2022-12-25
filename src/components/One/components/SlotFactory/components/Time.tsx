import * as React from "react";
import { useState, useEffect, useRef } from "react";

import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";

import { ITimeSlot } from "../../../slots/TimeSlot";

import useActualValue from "../../../../../hooks/useActualValue";

import formatText from "../../../../../utils/formatText";
import { parseTime, serializeTime, TIME_PLACEHOLDER } from "../../../../../utils/datetime";

import AlarmIcon from "@mui/icons-material/AlarmOutlined";

const TIME_TEMPLATE = "##:##";

export const Time = ({
  invalid,
  value: upperValue,
  disabled,
  readonly,
  description = "",
  outlined = true,
  title = "Text",
  placeholder = TIME_PLACEHOLDER,
  dirty,
  autoFocus,
  inputRef,
  onChange,
  name,
}: ITimeSlot) => {

  const pendingUpdate = useRef(false);
  const upperValue$ = useActualValue(upperValue);

  const [value, setValue] = useState(upperValue);

  useEffect(() => {
    if (pendingUpdate.current) {
      pendingUpdate.current = false;
    } else if (parseTime(upperValue || "")) {
      setValue(upperValue);
    } else {
      setValue("");
    }
  }, [upperValue]);

  useEffect(() => {
    const { current: upperValue } = upperValue$;
    if (value !== upperValue) {
      const pendingDate = parseTime(value || "");
      pendingUpdate.current = true;
      if (pendingDate) {
        onChange(serializeTime(pendingDate));
      } else {
        onChange("");
      }
    }
  }, [value]);

  const handleChange = (value: string) => {
    const pendingValue = formatText(value, TIME_TEMPLATE, {
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
              <AlarmIcon />
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

export default Time;
