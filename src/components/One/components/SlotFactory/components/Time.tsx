import * as React from "react";
import { useState, useEffect, useRef } from "react";
import dayjs from "dayjs";

import Popover from "@mui/material/Popover";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";

import TimePicker from "../../../../common/TimePicker/TimePicker";

import { ITimeSlot } from "../../../slots/TimeSlot";

import formatText from "../../../../../utils/formatText";
import * as datetime from "../../../../../utils/datetime";

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
  placeholder = datetime.TIME_PLACEHOLDER,
  dirty,
  autoFocus,
  inputRef,
  onChange,
  name,
}: ITimeSlot) => {

  const incomingUpdate = useRef(false);
  const outgoingUpdate = useRef(false);

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };


  const [value, setValue] = useState(
    datetime.parseTime(upperValue || '') ? upperValue : '',
  );

  useEffect(() => {
    if (outgoingUpdate.current) {
      outgoingUpdate.current = false;
    } else if (datetime.parseTime(upperValue || "")) {
      incomingUpdate.current = true;
      setValue(upperValue);
    } else {
      incomingUpdate.current = true;
      setValue("");
    }
  }, [upperValue]);

  useEffect(() => {
    if (incomingUpdate.current) {
      incomingUpdate.current = false;
    } else {
      const pendingDate = datetime.parseTime(value || "");
      outgoingUpdate.current = true;
      if (pendingDate) {
        onChange(datetime.serializeTime(pendingDate));
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
    <>
      <TextField
        inputRef={inputRef}
        InputProps={{
          readOnly: readonly,
          autoFocus,
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleClick} disabled={disabled} edge="end">
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
      <Popover
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
      >
        <TimePicker
          onChange={(value: dayjs.Dayjs | null) => {
            if (value) {
              const hour = value.get('hour');
              const minute = value.get('minute');
              setValue(new datetime.Time(hour, minute).toString());
              return;
            }
            setValue(null);
          }}
        />
      </Popover>
    </>
  );
};

export default Time;
