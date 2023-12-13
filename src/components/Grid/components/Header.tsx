import * as React from "react";
import { useCallback } from "react";
import { alpha, SxProps } from "@mui/system";

import { makeStyles } from "../../../styles";

import Box from "@mui/material/Box";

import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

import IColumn from "../model/IColumn";
import RowData from "../model/RowData";
import IGridProps from "../model/IGridProps";
import SelectionMode from "../../../model/SelectionMode";

import Cell from "./Cell";
import Center from "./Center";

import useGridProps from "../hooks/useGridProps";

import Subject from "../../../utils/rx/Subject";
import randomString from "../../../utils/randomString";
import classNames from "../../../utils/classNames";
import * as typo from "../../../utils/typo";

import { ACTIONS_WIDTH, CHECKBOX_WIDTH } from "../config";

const ROW_ACTIONS_UNIQUE_KEY = randomString();
const ROW_CHECKBOX_UNIQUE_KEY = randomString();

interface IHeaderProps<T = RowData> {
  className?: string;
  style?: React.CSSProperties;
  sx?: SxProps;
  columns: Array<IColumn>;
  sort: IGridProps<T>["sort"];
  rowActions: IGridProps<T>["rowActions"];
  scrollXSubject: Subject<number>;
  onScrollX: (scrollX: number) => void;
  onClickHeaderColumn: IGridProps<T>["onClickHeaderColumn"];
}

const useStyles = makeStyles()((theme) => ({
  root: {
    position: "relative",
    overflowX: "auto",
    overflowY: "hidden",
    width: "100%",
    height: "35px",
    borderBottom: `1px solid ${alpha(
      theme.palette.getContrastText(theme.palette.background.default),
      0.23
    )}`,
    scrollbarWidth: "none",
    "&::-webkit-scrollbar": {
      display: "none",
    },
  },
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    height: "100%",
    minWidth: "100%",
    display: "flex",
    alignItems: "stretch",
    justifyContent: "stretch",
  },
  headerCell: {
    display: "flex",
    userSelect: "none",
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
    fontWeight: "bold",
    opacity: 0.7,
  },
  headerCellClick: {
    "&:hover": {
      backgroundColor: "#f9f9f9",
      cursor: "pointer",
    },
  },
  coloredHeaderCell: {
    background: alpha(theme.palette.background.paper, 0.2),
  },
  headerCellSortable: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    "&>*:nth-of-type(n+1)": {
      marginLeft: theme.spacing(1),
    },
  },
}));

export const Header = <T extends RowData>({
  className,
  style,
  sx,
  columns,
  sort,
  rowActions,
  scrollXSubject,
  onClickHeaderColumn,
  onScrollX,
}: IHeaderProps<T>) => {
  const { classes } = useStyles();

  const { selectionMode = SelectionMode.None } = useGridProps();

  const handleRef = useCallback(
    (ref: HTMLDivElement | null) => {
      if (!ref) {
        return;
      }
      scrollXSubject.subscribe((scrollX) => {
        if (ref.scrollLeft !== scrollX) {
          ref.scrollTo(Math.min(scrollX, ref.scrollWidth), ref.scrollTop);
        }
      });
    },
    [scrollXSubject]
  );

  return (
    <Box
      ref={handleRef}
      className={classNames(className, classes.root)}
      style={style}
      sx={sx}
      onScroll={(e) => {
        const target = e.target as HTMLDivElement;
        if (onScrollX) {
          onScrollX(target.scrollLeft);
        }
      }}
    >
      <Box className={classes.container}>
        {selectionMode !== SelectionMode.None && (
          <Center
            className={classes.headerCell}
            key={ROW_CHECKBOX_UNIQUE_KEY}
            sx={{
              minWidth: CHECKBOX_WIDTH,
              maxWidth: CHECKBOX_WIDTH,
            }}
          >
            {typo.nbsp}
          </Center>
        )}
        {columns.map((column, idx) => {
          const rowId = `${String(column.field)}-${idx}`;
          return (
            <Cell
              key={rowId}
              className={classNames(classes.headerCell, {
                [classes.headerCellClick]: Boolean(onClickHeaderColumn),
                [classes.coloredHeaderCell]:
                  sort && sort.value === column.field,
              })}
              column={column}
              idx={idx}
              onClick={() => {
                if (onClickHeaderColumn) {
                  onClickHeaderColumn(column.field as unknown as keyof T);
                }
              }}
            >
              <div
                className={classNames({
                  [classes.headerCellSortable]: Boolean(sort),
                })}
              >
                {column.label}
                {sort && sort.value === column.field ? (
                  sort?.sortDirection === "ASC" ? (
                    <ArrowDropUpIcon />
                  ) : (
                    <ArrowDropDownIcon />
                  )
                ) : null}
              </div>
            </Cell>
          );
        })}
        {!!rowActions?.length && (
          <Center
            className={classes.headerCell}
            key={ROW_ACTIONS_UNIQUE_KEY}
            sx={{
              minWidth: ACTIONS_WIDTH,
              maxWidth: ACTIONS_WIDTH,
            }}
          >
            Actions
          </Center>
        )}
      </Box>
    </Box>
  );
};

export default Header;
