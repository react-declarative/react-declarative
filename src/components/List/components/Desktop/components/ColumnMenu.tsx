import * as React from "react";

import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ButtonBase from "@material-ui/core/ButtonBase";
import Box from "@material-ui/core/Box";

import { useGridSlotComponentProps } from "@material-ui/data-grid";
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
