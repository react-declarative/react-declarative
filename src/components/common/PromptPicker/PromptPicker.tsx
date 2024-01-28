import * as React from "react";
import { useState, useEffect, useLayoutEffect, useRef } from "react";

import ModalDialog from "../ModalDialog";

import Box from "@mui/material/Box";
import InputBase from "@mui/material/InputBase";
import DialogTitle from "@mui/material/DialogTitle";

interface IPromptPickerProps {
  onChange: (result: string | null) => void;
  title: string;
  value: string;
  large?: boolean;
  placeholder: string;
  open?: boolean;
  canCancel?: boolean;
}

export const PromptPicker = ({
  onChange = (result) => console.log({ result }),
  canCancel = true,
  title,
  value: defaultValue,
  placeholder,
  open = true,
  large,
}: IPromptPickerProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState(defaultValue);
  useEffect(() => setValue(defaultValue), [defaultValue]);
  useLayoutEffect(() => {
    const { current: input } = inputRef;
    if (input) {
      const { length } = input.value;
      input.focus();
      input.setSelectionRange(length, length);
    }
  }, []);
  const handleAccept = () => onChange(value);
  const handleDismiss = () => onChange(null);
  return (
    <ModalDialog
      open={open}
      canCancel={canCancel}
      onAccept={handleAccept}
      onDismiss={handleDismiss}
    >
      <DialogTitle>
        <Box
          sx={{
            width: large ? "100vw" : "unset",
            maxWidth: large ? "100%" : "unset",
          }}
          mr={3}
        >
          {title}
        </Box>
      </DialogTitle>
      <Box p={3}>
        <InputBase
          inputRef={inputRef}
          minRows={3}
          maxRows={large ? 20 : 3}
          multiline
          value={value}
          sx={{ width: "100%" }}
          placeholder={placeholder}
          onChange={({ target }) => setValue(target.value)}
          onKeyDown={({ key }) => {
            if (key === "Enter") {
              handleAccept();
            } else if (key === "Escape") {
              handleDismiss();
            }
          }}
        />
      </Box>
    </ModalDialog>
  );
};

export default PromptPicker;
