import * as React from "react";
import { useState } from "react";
import { makeStyles } from "@material-ui/core";

import { GridCellParams } from "@material-ui/data-grid";

import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';

import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import { useProps } from "../../PropProvider";

const useStyles = makeStyles({
  root: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: '100%',
  },
});

type IActionCellProps = GridCellParams;

export const ActionCell = (props: IActionCellProps) => {
  const classes = useStyles();
  const listProps = useProps();

  const [anchorEl, setAnchorEl] = useState(null);

  const {
    rowActions = [],
    onRowAction,
  } = listProps;

  const handleOpen = (event: any) => {
    if (rowActions.length) {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = (action: string) => () => {
    onRowAction && onRowAction(props.row, action);
    handleClose();
  };

  return (
    <div className={classes.root}>
      <IconButton
        aria-label="more"
        aria-controls="long-menu"
        aria-haspopup="true"
        onClick={handleOpen}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        keepMounted
        open={!!anchorEl}
        onClose={handleClose}
      >
        {rowActions.map(({action, label}, idx) => (
          <MenuItem key={idx} onClick={handleClick(action)}>
            {label}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export const renderActionCell = (props: IActionCellProps) => {
  return <ActionCell {...props} />;
};

export default ActionCell;
