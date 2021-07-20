import * as React from "react";
import { useState } from "react";
import { makeStyles } from "@material-ui/core";

import classNames from '../../../../../utils/classNames';

import { GridCellParams } from "@material-ui/data-grid";

import ListItemIcon from '@material-ui/core/ListItemIcon';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';

import MoreVertIcon from '@material-ui/icons/MoreVert';

import { useProps } from "../../PropProvider";

import { SKIP_ROW_CLICK } from "../hooks/useRowClickHandler";

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
    <div className={classNames(classes.root, SKIP_ROW_CLICK)}>
      <IconButton
        aria-label="more"
        aria-haspopup="true"
        onClick={handleOpen}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        anchorEl={anchorEl}
        keepMounted
        open={!!anchorEl}
        onClose={handleClose}
      >
        {rowActions.map(({ action = 'unknown-action', icon: Icon, label }, idx) => (
          <MenuItem key={idx} onClick={handleClick(action)}>
            {!!Icon && (
              <ListItemIcon>
                  <Icon />
              </ListItemIcon>
            )}
            <Typography variant="inherit">
              {label}
            </Typography>
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
