import * as React from "react";
import { useState, useEffect, useRef } from "react";

import ModalDialog from "../ModalDialog";

import Box from "@mui/material/Box";
import InputBase from "@mui/material/InputBase";
import DialogTitle from "@mui/material/DialogTitle";
import { makeStyles } from "../../../styles";
import classNames from "../../../utils/classNames";

const useStyles = makeStyles()({
  password: {
    fontFamily: "text-security-disc",
    "-webkit-text-security": "disc",
    textSecurity: "disc",
  },
});

/**
 * Represents the properties of the PromptPicker component.
 */
interface IPromptPickerProps {
  onChange: (result: string | null) => void;
  title: string;
  value: string;
  large?: boolean;
  placeholder: string;
  open?: boolean;
  canCancel?: boolean;
  inputType?: string;
}

/**
 * Represents a prompt picker component.
 * @param props - The props object.
 * @param props.onChange - The function called when the value is changed. Default: console.log({ result }).
 * @param props.canCancel - Determines if the picker can be canceled. Default: true.
 * @param props.title - The title of the picker.
 * @param props.value - The default value of the picker.
 * @param props.placeholder - The placeholder text for the input field.
 * @param props.open - Determines if the picker is open. Default: true.
 * @param props.large - Determines if the picker should be displayed in a large size. Default: false.
 */
export const PromptPicker = ({
  onChange = (result) => console.log({ result }),
  canCancel = true,
  title,
  value: defaultValue,
  inputType,
  placeholder,
  open = true,
  large,
}: IPromptPickerProps) => {

  const { classes } = useStyles();

  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState(defaultValue);
  useEffect(() => setValue(defaultValue), [defaultValue]);
  useEffect(() => {
    const { current: input } = inputRef;
    setTimeout(() => {
      if (input?.value) {
        const { length } = input.value;
        input.setSelectionRange(length, length);
      }
    }, 500);
  }, []);
  /**
   * Executes the handleAccept function.
   * Calls the onChange function with the provided value as an argument.
   *
   * @param onChange - The onChange function to be called.
   * @param value - The value to be passed as an argument to the onChange function.
   */
  const handleAccept = () => onChange(value);
  /**
   * Function handleDismiss
   *
   * This function is responsible for triggering the `onChange` callback with a `null` value.
   * It is typically used to dismiss or clear a certain value.
   *
   * @function
   * @name handleDismiss
   * @returns
   */
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
          className={classNames({
            [classes.password]: inputType === "password",
          })}
          inputRef={inputRef}
          type={inputType}
          autoFocus
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
