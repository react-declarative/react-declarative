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

/**
 * Represents the properties for the SortModal component.
 */
interface ISortModalProps {
  columns: IColumn[];
  storageKey: string;
}

/**
 * Defines the styles for a component.
 *
 * @typedef useStyles
 * @property inactive - The styles for the inactive state.
 * @property inactive.opacity - The opacity value for the inactive state.
 * @property container - The styles for the container element.
 * @property container.boxSizing - The box sizing property for the container element.
 * @property container.width - The width property for the container element. It uses the minimum value between 100vw - 100px and 400px.
 * @property container.height - The height property for the container element.
 * @property list - The styles for the list element.
 * @property list.boxSizing - The box sizing property for the list element.
 * @property list.width - The width property for the list element.
 * @property list.&gt; .className:nth-of-type(2n) - The background property for the list element when its second child has a specific class.
 * @property item - The styles for the item element.
 * @property item.&gt; .MuiListItemText-root &gt; .MuiTypography-root - The styles for the typography element inside the item element.
 * @property item.&gt; .MuiListItemText-root &gt; .MuiTypography-root.width - The width property for the typography element.
 * @property item.&gt; .MuiListItemText-root &gt; .MuiTypography-root.overflow - The overflow property for the typography element.
 * @property item.&gt; .MuiListItemText-root &gt; .MuiTypography-root.textOverflow - The text overflow property for the typography element.
 * @property item_right_side - The styles for the right side of the item element.
 * @property item_right_side.display - The display property for the right side of the item element.
 * @property item_right_side.alignItems - The align items property for the right side of the item element.
 * @property item_right_side.gap - The gap property for the right side of the item element.
 * @property dialog_wrapper - The styles for the dialog wrapper element.
 * @property dialog_wrapper.width - The width property for the dialog wrapper element.
 * @property dialog_wrapper.maxwidth - The max width property for the dialog wrapper element.
 * @property dialog_wrapper.boxSizing - The box sizing property for the dialog wrapper element.
 * @property dialog - The styles for the dialog element.
 * @property dialog.&gt;:first-of-type - The styles for the first dialog element.
 * @property dialog.&gt;:first-of-type.padding - The padding property for the first dialog element.
 * @property dialog.width - The width property for the dialog element.
 * @property dialog.boxSizing - The box sizing property for the dialog element.
 */
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
   * @returns - The storage manager object.
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

  /**
   * Represents a memoized array of sorted columns.
   * @type {Array.<Object>}
   */
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

  /**
   * Handles the accept event, which saves the current columns
   * configuration to the storage manager and reloads the page.
   *
   * @function
   * @name handleAccept
   * @returns
   */
  const handleAccept = () => {
    storageManager.setValue(currentColumns);
    reloadPage();
  };

  /**
   * Toggles the visibility of a column in the current columns array.
   *
   * @param field - The field identifier of the column to toggle.
   */
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

  /**
   * Moves the column with the specified field up by one position in the currentColumns array.
   *
   * @param field - The field of the column to move up
   */
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

  /**
   * Moves the specified column one position down in the currentColumns array.
   *
   * @param field - The field name of the column to be moved.
   */
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

  /**
   * Renders a dialog with a list of columns.
   * @returns The rendered dialog component.
   */
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

  /**
   * Configuration object for rendering a table.
   * @typedef Config
   * @property open - Specifies if the modal is open or closed.
   * @property render - Function used to render the modal.
   * @property columns - Array of columns in the modal, sorted in the specified order.
   * @property pickColumns - Function used to open the column selection.
   */
  return {
    open,
    render,
    columns: sortedColumns,
    pickColumns: () => setOpen(true),
  };
};

export default useColumnConfig;
