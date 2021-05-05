import * as React from 'react';
import { makeStyles } from '@material-ui/core';

import Dialog, { DialogProps } from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles({
  dialog: {
    '&:first-child': {
      padding: 0,
    },
    overflow: 'hidden',
  },
});

interface IModalDialogProps extends DialogProps {
  children: React.ReactChild;
  dividers?: boolean;
  onAccept: () => void;
  onDismis: () => void;
}

export const ModalDialog = ({
  children,
  dividers = false,
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
        <Button color="primary" onClick={onAccept}> OK </Button>
        <Button color="primary" onClick={onDismis}> Cancel </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalDialog;
