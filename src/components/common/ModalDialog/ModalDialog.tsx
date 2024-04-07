import * as React from 'react';

import { makeStyles } from "../../../styles";

import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

/**
 * A function that returns the styles for a dialog component.
 * @returns The styles object for the dialog component.
 */
const useStyles = makeStyles()({
  dialog: {
    '&:first-of-type': {
      padding: 0,
    },
    overflow: 'hidden',
  },
});

/**
 * Represents the props for a modal dialog component.
 * @interface
 * @extends DialogProps
 */
interface IModalDialogProps extends DialogProps {
  children: React.ReactNode;
  disabled?: boolean;
  invalid?: boolean;
  canCancel?: boolean;
  noSave?: boolean;
  dividers?: boolean;
  onAccept?: () => void;
  onDismiss?: () => void;
}

/**
 * Represents a modal dialog component.
 * @typedef {Object} IModalDialogProps
 * @property children - The content inside the dialog.
 * @property disabled - Specifies if the dialog is disabled.
 * @property invalid - Specifies if the dialog is invalid.
 * @property dividers - Specifies if the dialog content should have dividers.
 * @property canCancel - Specifies if the dialog can be canceled.
 * @property noSave - Specifies if the dialog has save functionality disabled.
 * @property onAccept - The callback function to be executed when the 'OK' button is clicked. Default value is a function that prints 'accept'.
 * @property onDismiss - The callback function to be executed when the 'Cancel' button is clicked. Default value is a function that prints 'dismiss'.
 * @property other - Any other properties that can be passed to the Dialog component.
 */
export const ModalDialog = ({
  children,
  disabled,
  invalid,
  dividers = false,
  canCancel = true,
  noSave = false,
  onAccept = () => console.log('accept'),
  onDismiss = () => console.log('dismiss'),
  ...other
}: IModalDialogProps) => {
  const { classes } = useStyles();
  return (
    <Dialog {...other}>
      <DialogContent dividers={dividers} className={classes.dialog}>
        { children }
      </DialogContent>
      <DialogActions>
        {!noSave && (
          <Button
            disabled={disabled || invalid}
            color="primary"
            onClick={onAccept}
          >
            OK
          </Button>
        )}
        {canCancel && (
          <Button
            disabled={disabled}
            color="primary"
            onClick={onDismiss}
          >
            Cancel
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ModalDialog;
