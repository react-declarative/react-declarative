import * as React from "react";

import ModalDialog from "../ModalDialog";

import Box from "@mui/material/Box";
import InputBase from "@mui/material/InputBase";
import DialogTitle from "@mui/material/DialogTitle";

/**
 * Represents the props for the AlertPicker component.
 */
interface IAlertPickerProps {
  onOk: () => void;
  title: string;
  description: string;
  large?: boolean;
  open?: boolean;
}

/**
 * AlertPicker component displays a modal dialog with a title and a description.
 * It is used for showing alert messages to users.
 *
 * @param props - The properties passed to the component.
 * @param props.onOk - The callback function to be executed when the user clicks the accept button.
 * @param props.title - The title of the alert message.
 * @param props.description - The description of the alert message.
 * @param [props.open=true] - Indicates whether the alert picker is open or not.
 * @param [props.large] - Indicates whether to display the alert picker in a large size or not.
 * @returns - The JSX element representing the AlertPicker component.
 */
export const AlertPicker = ({
  onOk,
  title,
  description,
  open = true,
  large,
}: IAlertPickerProps) => {
  return (
    <ModalDialog
      open={open}
      canCancel={false}
      onAccept={onOk}
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
          autoFocus
          readOnly
          minRows={3}
          maxRows={large ? 20 : 3}
          multiline
          value={description}
          sx={{ width: "100%" }}
        />
      </Box>
    </ModalDialog>
  );
};

export default AlertPicker;
