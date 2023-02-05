import * as React from "react";
import { forwardRef } from "react";
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

const ROW_ACTIONS_UNIQUE_KEY = randomString();

interface IContentRowProps {
  className?: string;
  style?: React.CSSProperties;
  sx?: SxProps;
  columns: Array<IColumn>;
  row: RowData;
  rowKey: IGridProps["rowKey"];
  rowActions: IGridProps["rowActions"];
  rowActionsPayload: IGridProps["rowActionsPayload"];
  onTableRowClick: IGridProps["onTableRowClick"];
  onRowAction: IGridProps["onRowAction"];
}

const useStyles = makeStyles()((theme) => ({
  contentRow: {
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
    "& > *:nth-child(1)": {
      flex: 1,
    },
  },
  rowOnClick: {
    "&:hover": {
      cursor: "pointer",
    },
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
      rowActionsPayload,
      row,
      onTableRowClick,
      onRowAction,
    }: IContentRowProps,
    ref
  ) => {
    const { classes } = useStyles();
    return (
      <Box
        ref={ref}
        className={classNames(CHILD_ELEMENT, className, classes.contentRow)}
        style={style}
        sx={sx}
      >
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
              key={cellId}
              column={column}
              idx={idx}
            >
              {/* eslint-disable-next-line no-nested-ternary */}
              {column.format
                ? column.format(row)
                : column.field
                ? get(row, column.field)
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
              payload={rowActionsPayload}
              options={
                rowActions.map(
                  ({
                    isDisabled = () => false,
                    isVisible = () => true,
                    ...otherProps
                  }) => ({
                    isVisible: (payload: IAnything) => isVisible(row, payload),
                    isDisabled: (payload: IAnything) =>
                      isDisabled(row, payload),
                    ...otherProps,
                  })
                ) as unknown as IOption[]
              }
              onAction={(action) => {
                if (onRowAction) {
                  onRowAction(row, action);
                }
              }}
            />
          </Center>
        )}
      </Box>
    );
  }
);

export default ContentRow;
