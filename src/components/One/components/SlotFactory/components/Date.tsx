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

import formatText from "../../../../../utils/formatText";
import * as datetime from "../../../../../utils/datetime";

import CalendarIcon from "@mui/icons-material/CalendarTodayOutlined";

const DATE_TEMPLATE = "##/##/####";
const NEVER_POS = Symbol('never-pos');

const getCaretPos = (element: HTMLInputElement | HTMLTextAreaElement) => {
  return element.selectionStart || element.value.length;
};

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
  const inputElementRef = useRef<HTMLInputElement | null>();

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
    let result = "";
    for (let i = 0; i !== value.length; i++) {
      result += value[i];
      result = formatText(result, DATE_TEMPLATE, {
        allowed: /\d/,
        symbol: "#",
      });
    }
    caretManager.pos();
    setValue(result);
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

  const caretManager = useMemo(() => {
    let lastPos: symbol | number = NEVER_POS;

    const getAdjust = (pos: number) => {
      let adjust = 0;
      for (let i = Math.max(pos - 1, 0); i !== DATE_TEMPLATE.length; i++) {
        const char = DATE_TEMPLATE[i];
        if (char === '#') {
          break;
        }
        adjust += 1;
      }
      return adjust;
    };

    return {
      render: () => {
        const { current: input } = inputElementRef;
        if (typeof lastPos === 'number') {
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
    }
  }, []);

  useLayoutEffect(() => {
    const { current: input } = inputElementRef;
    const handler = () => caretManager.pos();
    input && input.addEventListener('keyup', handler);
    input && input.addEventListener('click', handler);
    return () => {
      input && input.removeEventListener('keyup', handler);
      input && input.removeEventListener('click', handler);
    };
  }, [inputElementRef.current]);

  useLayoutEffect(() => {
    caretManager.render();
  }, [value]);

  return (
    <>
      <TextField
        inputRef={(input: HTMLInputElement | null) => {
          inputElementRef.current = input;
          inputRef && inputRef(input);
        }}
        sx={{
          ...(!outlined && {
            position: 'relative',
            '& .MuiFormHelperText-root': {
                position: 'absolute',
                top: '100%',
            },
          })
        }}
        type="text"
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
