import * as React from "react";
import { useMemo, useState } from "react";

import { makeStyles } from "../../../styles";
import { alpha } from "@mui/material";

import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Switch from "@mui/material/Switch";
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

import createLsManager from "../../../utils/createLsManager";
import reloadPage from "../../../utils/reloadPage";

import IColumn from "../../../model/IColumn";
import ColumnType from "../../../model/ColumnType";

import ArrowUpIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownIcon from "@mui/icons-material/ArrowDownward";

interface ISortModalProps {
  columns: IColumn[];
  storageKey: string;
}

const useStyles = makeStyles()((theme, _, classes: any) => ({
  inactive: {
    opacity: 0.5,
  },
  container: {
    boxSizing: "border-box",
    width: "min(100vw - 100px, 400px)",
    height: 340,
  },
  list: {
    boxSizing: "border-box",
    width: "100%",
    [`& > .${classes["item"]}:nth-of-type(2n)`]: {
      background: alpha(
        theme.palette.getContrastText(theme.palette.background.paper),
        0.04
      ),
    },
  },
  item: {
    "& .MuiListItemText-root > .MuiTypography-root": {
      width: "100%",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
  },
  item_right_side: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },
  dialog_wrapper: {
    width: "100%",
    maxwidth: "400px",
    boxSizing: "border-box",
  },
  dialog: {
    "&:first-of-type": {
      padding: 0,
    },
    width: "100%",
    boxSizing: "border-box",
  },
}));

interface IColumnEntry {
  field: string;
  show: boolean;
  displayName?: string;
}

/**
 * Manages column configuration for sorting modal.
 *
 * @param params - The parameters for the sorting modal.
 * @returns - An object containing the open state, render function, sorted columns, and pick
 *Columns function.
 */
export const useColumnConfig = ({ columns, storageKey }: ISortModalProps) => {
  const { classes } = useStyles();
  const [open, setOpen] = useState<boolean>(false);

  /**
   * Represents a storage manager variable.
   *
   * @returns {object} - The storage manager object.
   */
  const storageManager = useMemo(
    () => {
      const manager = createLsManager<IColumnEntry[]>(`${storageKey}_v1`)
      {
        const value = manager.getValue();
        const { length: totalLength } = columns
          .filter((column) => column.field)
          .filter((column) => column.type !== ColumnType.Action);
        if (value && value.length !== totalLength) {
          manager.clear();
        }
      }
      return manager;
    },
    []
  );

  const [currentColumns, setCurrentColumns] = useState<IColumnEntry[]>(() => {
    let value = storageManager.getValue();
    if (!value) {
      value = columns
        .filter((column) => column.field)
        .filter((column) => column.type !== ColumnType.Action)
        .map((column) => ({
          field: column.field!,
          show: true,
          displayName:
            column.fullName || column.headerName || String(column.field),
        }));
    }
    return value;
  });

  const sortedColumns = useMemo(() => {
    const result = currentColumns
      .filter(({ show }) => show)
      .map(({ field }) => columns.find((column) => column.field === field)!)
      .filter((value) => value);
    const actionColumn = columns.find(({ type }) => type === ColumnType.Action);
    if (actionColumn) {
      result.push(actionColumn);
    }
    return result;
  }, []);

  const handleAccept = () => {
    storageManager.setValue(currentColumns);
    reloadPage();
  };

  const toggleColumn = (field: string) =>
    setCurrentColumns((prevColumns) =>
      prevColumns.map((item) => {
        if (item.field === field) {
          return { ...item, show: !item.show };
        } else {
          return item;
        }
      })
    );

  const moveUpColumn = (field: string) => {
    const currentIdx = currentColumns.findIndex((item) => item.field === field);
    if (currentIdx === 0) return;
    setCurrentColumns((prevColumns) => {
      const swapColumn = prevColumns[currentIdx];
      prevColumns[currentIdx] = prevColumns[currentIdx - 1];
      prevColumns[currentIdx - 1] = swapColumn;
      return [...prevColumns];
    });
  };

  const moveDownColumn = (field: string) => {
    const currentIdx = currentColumns.findIndex((item) => item.field === field);
    if (currentIdx === currentColumns.length) return;
    setCurrentColumns((prevColumns) => {
      const swapColumn = prevColumns[currentIdx];
      prevColumns[currentIdx] = prevColumns[currentIdx + 1];
      prevColumns[currentIdx + 1] = swapColumn;
      return [...prevColumns];
    });
  };

  const render = () => (
    <Dialog open={open} className={classes.dialog_wrapper}>
      <DialogContent className={classes.dialog}>
        <Box className={classes.container}>
          <List className={classes.list} disablePadding>
            {currentColumns.map((column, idx) => {
              return (
                <ListItem key={idx} className={classes.item}>
                  <ListItemText primary={column.displayName} />
                  <Box className={classes.item_right_side}>
                    <IconButton
                      onClick={() => moveUpColumn(column.field!)}
                      disabled={idx == 0 || !column.show}
                    >
                      <ArrowUpIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => moveDownColumn(column.field!)}
                      disabled={
                        idx == currentColumns.length - 1 || !column.show
                      }
                    >
                      <ArrowDownIcon />
                    </IconButton>
                    <Switch
                      checked={column.show}
                      onClick={() => toggleColumn(column.field!)}
                    />
                  </Box>
                </ListItem>
              );
            })}
          </List>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={handleAccept}>
          OK
        </Button>
        <Button color="primary" onClick={() => setOpen(false)}>
          Отмена
        </Button>
      </DialogActions>
    </Dialog>
  );

  return {
    open,
    render,
    columns: sortedColumns,
    pickColumns: () => setOpen(true),
  };
};

export default useColumnConfig;
