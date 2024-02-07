import * as React from "react";

import ModalDialog from "../ModalDialog";

import Box from "@mui/material/Box";
import InputBase from "@mui/material/InputBase";
import DialogTitle from "@mui/material/DialogTitle";

interface IAlertPickerProps {
  onOk: () => void;
  title: string;
  description: string;
  large?: boolean;
  open?: boolean;
}

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
