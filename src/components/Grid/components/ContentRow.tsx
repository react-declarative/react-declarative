import * as React from "react";
import { useState, useEffect, forwardRef } from "react";
import { alpha, SxProps } from "@mui/system";

import { makeStyles } from "../../../styles";

import Box from "@mui/material/Box";

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

import { ACTIONS_WIDTH } from "../config";
import useAsyncAction from "../../../hooks/useAsyncAction";

const ROW_ACTIONS_UNIQUE_KEY = randomString();

interface IContentRowProps {
  className?: string;
  style?: React.CSSProperties;
  sx?: SxProps;
  columns: Array<IColumn>;
  row: RowData;
  rowKey: IGridProps["rowKey"];
  rowActions: IGridProps["rowActions"];
  payload: IGridProps["payload"];
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
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: 4,
  },
}));

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
      onTableRowClick,
      onRowAction,
      rowMark,
    }: IContentRowProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const { classes } = useStyles();
    const [rowColor, setRowColor] = useState<string>("");

    const { execute } = useAsyncAction(async () => {
      if (typeof rowMark === "function") {
        const color = await rowMark(row);
        setRowColor(color);
      }
    });

    useEffect(() => {
      execute();
    }, []);

    return (
      <div
        ref={ref}
        className={classNames(CHILD_ELEMENT, className)}
        style={style}
      >
        <Box className={classes.contentRow} sx={sx}>
          {rowColor && (
            <Box className={classes.mark} style={{ background: rowColor }} />
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
      </div>
    );
  }
);

export default ContentRow;
