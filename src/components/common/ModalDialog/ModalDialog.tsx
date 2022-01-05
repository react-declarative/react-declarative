import * as React from 'react';

import { makeStyles } from "../../../styles";

import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

const useStyles = makeStyles({
  dialog: {
    '&:first-child': {
      padding: 0,
    },
    overflow: 'hidden',
  },
});

interface IModalDialogProps extends DialogProps {
  children: React.ReactNode;
  canCancel?: boolean;
  dividers?: boolean;
  onAccept: () => void;
  onDismis: () => void;
}

export const ModalDialog = ({
  children,
  dividers = false,
  canCancel = true,
  onAccept = () => console.log('accept'),
  onDismis = () => console.log('dismiss'),
  ...other
}: IModalDialogProps) => {
  const classes = useStyles();
  return (
    <Dialog {...other}>
      <DialogContent dividers={dividers} className={classes.dialog}>
        { children }
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={onAccept}>OK</Button>
        <Button disabled={!canCancel} color="primary" onClick={onDismis}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalDialog;
