import * as React from "react";
import { useState } from "react";
import { makeStyles } from "@mui/styles";

import classNames from '../../../../../utils/classNames';

import { GridCellParams } from "@mui/x-data-grid";

import ListItemIcon from '@mui/material/ListItemIcon';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';

import MoreVertIcon from '@mui/icons-material/MoreVert';

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
