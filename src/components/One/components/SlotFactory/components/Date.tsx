import * as React from "react";
import { useState, useEffect, useRef, useMemo } from "react";
import dayjs from "dayjs";

import Popover from "@mui/material/Popover";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";

import DatePicker from "../../../../common/DatePicker/DatePicker";

import { IDateSlot } from "../../../slots/DateSlot";

import useActualValue from "../../../../../hooks/useActualValue";

import formatText from "../../../../../utils/formatText";
import * as datetime from "../../../../../utils/datetime";

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
  placeholder = datetime.DATE_PLACEHOLDER,
  dirty,
  autoFocus,
  inputRef,
  onChange,
  name,
}: IDateSlot) => {

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
    datetime.parseDate(upperValue || '') ? upperValue : '',
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

  const handleChange = (value: string) => {
    const pendingValue = formatText(value, DATE_TEMPLATE, {
      allowed: /\d/,
      symbol: "#",
    });
    setValue(pendingValue);
  };

  const dayjsValue = useMemo(() => {
    if (value) {
      const date = datetime.parseDate(value);
      if (!date) {
        return undefined;
      }
      let now = dayjs();
      now = now.set('date', date.day);
      now = now.set('month', date.month - 1);
      now = now.set('year', date.year);
      return now;
    }
    return undefined;
  }, [value]);

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
      <Popover
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
      >
        <DatePicker
          date={dayjsValue}
          onChange={(value: dayjs.Dayjs | null) => {
            if (value) {
              const day = value.get('date');
              const month = value.get('month') + 1;
              const year = value.get('year');
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
