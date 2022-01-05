import * as React from "react";

import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ButtonBase from "@mui/material/ButtonBase";
import Box from "@mui/material/Box";

import { useGridSlotComponentProps } from "../hooks/useGridSlotComponentProps";
import { useProps } from "../../PropProvider";

export const ColumnMenu = () => {
  const gridProps = useGridSlotComponentProps();
  const listProps = useProps();

  const {
    state: {
      columnMenu: { field: columnMenuField = "" },
    },
  } = gridProps;

  const {
    columns = [],
    onColumnMenuAction,
  } = listProps;

  const {
    columnMenu = [],
  } = columns.find(({field}) => field === columnMenuField)! || {};

  const handleClick = (item: string) => (e: any) => {
    e.stopPropagation();
    onColumnMenuAction && onColumnMenuAction(item);
    gridProps.apiRef.current.hideColumnMenu();
  };

  return (
    <Box display="flex" flexDirection="column">
      {columnMenu.map(({ action = 'unknown-action', label }, idx) => (
        <ButtonBase key={idx} onClick={handleClick(action)}>
          <ListItem>
            <ListItemText primary={label} />
          </ListItem>
        </ButtonBase>
      ))}
    </Box>
  );
};

export default ColumnMenu;
