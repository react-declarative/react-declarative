import * as React from "react";
import { useState, useEffect, useCallback, forwardRef } from "react";
import { alpha, SxProps } from "@mui/material";

import { makeStyles } from "../../../styles";

import Box from "@mui/material/Box";
import Radio from "@mui/material/Radio";
import Checkbox from "@mui/material/Checkbox";
import ListItemButton from "@mui/material/ListItemButton";

import { CHILD_ELEMENT } from "../../VirtualView";
import ActionMenu from "../../ActionMenu";

import { IColumn } from "../model/IColumn";
import { RowData } from "../model/RowData";
import { IGridProps } from "../model/IGridProps";

import Cell from "./Cell";
import Center from "./Center";

import randomString from "../../../utils/randomString";
import classNames from "../../../utils/classNames";
import get from "../../../utils/get";

import IAnything from "../../../model/IAnything";
import IOption from "../../../model/IOption";

import useAsyncAction from "../../../hooks/useAsyncAction";
import useSubject from "../../../hooks/useSubject";

import useGridProps from "../hooks/useGridProps";
import useSelection from "../hooks/useSelection";

import SelectionMode from "../../../model/SelectionMode";

import { ACTIONS_WIDTH, CHECKBOX_WIDTH } from "../config";

const ROW_ACTIONS_UNIQUE_KEY = randomString();
const ROW_SELECTION_UNIQUE_KEY = randomString();

/**
 * Represents the properties for the ContentRow component.
 *
 * @interface IContentRowProps
 * @property {string} [className] - The class name for the ContentRow component.
 * @property {React.CSSProperties} [style] - The inline styles for the ContentRow component.
 * @property {SxProps<any>} [sx] - The custom styling for the ContentRow component.
 * @property {IColumn[]} columns - The array of column definitions for the ContentRow component.
 * @property {RowData} row - The data for the current row.
 * @property {IGridProps["rowKey"]} rowKey - The unique key for the current row.
 * @property {IGridProps["rowActions"]} rowActions - The actions for the current row.
 * @property {IGridProps["payload"]} payload - The payload for the current row.
 * @property {IGridProps["recomputeSubject"]} recomputeSubject - The subject used for recomputation.
 * @property {IGridProps["onTableRowClick"]} onTableRowClick - The event handler for table row click.
 * @property {IGridProps["onRowAction"]} onRowAction - The event handler for row action.
 * @property {Exclude<IGridProps["rowMark"], undefined> & { clear(row: any): void }} rowMark - The mark for the current row.
 */
interface IContentRowProps {
  className?: string;
  style?: React.CSSProperties;
  sx?: SxProps<any>;
  columns: Array<IColumn>;
  row: RowData;
  rowKey: IGridProps["rowKey"];
  rowActions: IGridProps["rowActions"];
  payload: IGridProps["payload"];
  recomputeSubject: IGridProps["recomputeSubject"];
  onTableRowClick: IGridProps["onTableRowClick"];
  onRowAction: IGridProps["onRowAction"];
  rowMark: Exclude<IGridProps["rowMark"], undefined> & {
    clear(row: any): void;
  };
}

const useStyles = makeStyles()((theme) => ({
  wrapper: {
    display: "flex",
    alignItems: "stretch",
    justifyContent: "stretch",
  },
  contentRow: {
    flex: 1,
    position: "relative",
    display: "flex",
    alignItems: "stretch",
    justifyContent: "stretch",
    overflow: "hidden",
    minHeight: "50px",
    borderBottom: `1px solid ${alpha(
      theme.palette.getContrastText(theme.palette.background.default),
      0.23
    )}`,
    "&:hover": {
      background: alpha(theme.palette.background.paper, 0.2),
    },
  },
  contentCell: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    paddingLeft: "5px",
    paddingRight: "5px",
    paddingTop: "7.5px",
    paddingBottom: "7.5px",
    width: "100%",
    whiteSpace: "break-spaces",
    overflowWrap: "anywhere",
    textOverflow: "ellipsis",
    overflow: "hidden",
  },
  alignLeft: {
    alignItems: "flex-start",
  },
  alignRight: {
    alignItems: "flex-end",
  },
  alignCenter: {
    alignItems: "center",
  },
  alignStretch: {
    alignItems: "stretch",
    "& > *:nth-of-type(1)": {
      flex: 1,
    },
  },
  rowOnClick: {
    "&:hover": {
      cursor: "pointer",
    },
  },
  mark: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    width: 4,
  },
  noPadding: {
    padding: 0,
  },
}));

/**
 * Component that represents a single row in a content table.
 *
 * @component
 * @param {Object} props - The props object.
 * @param {string} props.className - The class name(s) to apply to the row.
 * @param {Object} props.style - The inline style to apply to the row.
 * @param {Object} props.sx - The extended style to apply to the row.
 * @param {string} props.rowKey - The key used to identify the row.
 * @param {Array} props.columns - The list of columns in the table.
 * @param {Array} props.rowActions - The list of actions that can be performed on the row.
 * @param {Object} props.payload - The payload to be passed to the row actions.
 * @param {Object} props.row - The data of the row.
 * @param {Subject} props.recomputeSubject - The subject to trigger recomputation of the row.
 * @param {Function} props.onTableRowClick - The function to be called when the row is clicked.
 * @param {Function} props.onRowAction - The function to be called when a row action is triggered.
 * @param {Object} props.rowMark - The function that returns the color to mark the row with.
 * @param {React.Ref} ref - The ref object for the row.
 */
export const ContentRow = forwardRef(
  (
    {
      className,
      style,
      sx,
      rowKey = "id",
      columns,
      rowActions,
      payload,
      row,
      recomputeSubject: upperRecomputeSubject,
      onTableRowClick,
      onRowAction,
      rowMark,
    }: IContentRowProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const { classes } = useStyles();
    const [rowMarkColor, setRowMarkColor] = useState<string>("");
    const recomputeSubject = useSubject(upperRecomputeSubject);

    const { selectionMode = SelectionMode.None, rowColor = () => 'inherit' } = useGridProps();
    const { selection, setSelection } = useSelection();

    const { execute } = useAsyncAction(async () => {
      if (typeof rowMark === "function") {
        const color = await rowMark(row);
        setRowMarkColor(color);
      }
    });

    useEffect(() => {
      execute();
      return () => {
        rowMark.clear(row[rowKey] || row);
      };
    }, []);

    useEffect(
      () =>
        recomputeSubject.subscribe(() => {
          execute();
        }),
      []
    );

    const handleSelect = useCallback(
      (e: any) => {
        e.preventDefault();
        e.stopPropagation();
        const id = row[rowKey];
        if (!id) {
          return;
        }
        if (selectionMode === SelectionMode.Single) {
          if (selection.has(id) && selection.size === 1) {
            selection.delete(id);
          } else {
            selection.clear();
            selection.add(id);
          }
        } else {
          selection.has(id) ? selection.delete(id) : selection.add(id);
        }
        setSelection(new Set(selection));
      },
      [selection]
    );

    const renderCheckbox = useCallback(() => {
      if (selectionMode === SelectionMode.Single) {
        return (
          <Radio
            color="primary"
            onClick={handleSelect}
            checked={selection.has(row.id)}
          />
        );
      } else if (selectionMode === SelectionMode.Multiple) {
        return (
          <Checkbox
            color="primary"
            onClick={handleSelect}
            checked={selection.has(row.id)}
          />
        );
      } else if (selectionMode === SelectionMode.None) {
        return <Checkbox color="primary" disabled />;
      } else {
        return null;
      }
    }, [selection]);

    return (
      <ListItemButton
        disableGutters
        disableRipple
        selected={selection.has(row[rowKey])}
        ref={ref}
        sx={{
          background: rowColor(row)
        }}
        className={classNames(CHILD_ELEMENT, className, classes.noPadding)}
        style={style}
      >
        <Box className={classes.contentRow} sx={sx}>
          {rowMarkColor && (
            <Box className={classes.mark} style={{ background: rowMarkColor }} />
          )}
          {selectionMode !== SelectionMode.None && (
            <Center
              className={classes.contentCell}
              key={ROW_SELECTION_UNIQUE_KEY}
              sx={{
                minWidth: CHECKBOX_WIDTH,
                maxWidth: CHECKBOX_WIDTH,
              }}
            >
              {renderCheckbox()}
            </Center>
          )}
          {columns.map((column, idx) => {
            const cellId = `${get(row, rowKey)}-${idx}`;
            return (
              <Cell
                className={classNames(classes.contentCell, {
                  [classes.rowOnClick]: Boolean(onTableRowClick),
                  [classes.alignLeft]: column.align === "left",
                  [classes.alignRight]: column.align === "right",
                  [classes.alignCenter]: column.align === "center",
                  [classes.alignStretch]: column.align === "stretch",
                })}
                onClick={(e) => {
                  onTableRowClick && onTableRowClick(e, row);
                }}
                key={cellId}
                column={column}
                idx={idx}
              >
                {column.format
                  ? column.format(row)
                  : column.field
                  ? String(get(row, column.field))
                  : null}
              </Cell>
            );
          })}
          {!!rowActions?.length && (
            <Center
              className={classes.contentCell}
              key={ROW_ACTIONS_UNIQUE_KEY}
              sx={{
                minWidth: ACTIONS_WIDTH,
                maxWidth: ACTIONS_WIDTH,
              }}
            >
              <ActionMenu
                transparent
                payload={payload}
                options={
                  rowActions.map(
                    ({
                      isDisabled = () => false,
                      isVisible = () => true,
                      ...otherProps
                    }) => ({
                      isVisible: (payload: IAnything) =>
                        isVisible(row, payload),
                      isDisabled: (payload: IAnything) =>
                        isDisabled(row, payload),
                      ...otherProps,
                    })
                  ) as unknown as IOption[]
                }
                onAction={(action) => {
                  if (onRowAction) {
                    onRowAction(action, row);
                  }
                  return;
                }}
              />
            </Center>
          )}
        </Box>
      </ListItemButton>
    );
  }
);

export default ContentRow;
