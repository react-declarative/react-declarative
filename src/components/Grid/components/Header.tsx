import * as React from "react";
import { useCallback } from "react";
import { alpha, SxProps } from "@mui/material";

import { makeStyles } from "../../../styles";

import Box from "@mui/material/Box";
import Radio from "@mui/material/Radio";
import Checkbox from "@mui/material/Checkbox";

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

import { ACTIONS_WIDTH, CHECKBOX_WIDTH } from "../config";

const ROW_ACTIONS_UNIQUE_KEY = randomString();
const ROW_CHECKBOX_UNIQUE_KEY = randomString();

/**
 * Represents the properties of the Header component.
 *
 * @template T - The type of row data.
 */
interface IHeaderProps<T = RowData> {
  className?: string;
  style?: React.CSSProperties;
  sx?: SxProps<any>;
  columns: Array<IColumn>;
  sort: IGridProps<T>["sort"];
  rowActions: IGridProps<T>["rowActions"];
  scrollXSubject: Subject<number>;
  onScrollX: (scrollX: number) => void;
  onClickHeaderColumn: IGridProps<T>["onClickHeaderColumn"];
}

/**
 * Returns an object with styles for a table component.
 *
 * @function useStyles
 * @returns The styles object for the table.
 *
 * @param theme - The theme object provided by the Material-UI theme provider.
 * @param theme.palette.background.default - The default background color for the theme.
 * @param theme.palette.getContrastText - The function to get the contrast text color for a given background color.
 *
 * @returns The styles object for the table.
 */
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

/**
 * Represents the header component of a data grid.
 * @template T - The type of the row data.
 * @param props - The props for the header component.
 * @param props.className - The CSS class name for the header component.
 * @param props.style - The inline style for the header component.
 * @param props.sx - The sx prop for the header component.
 * @param props.columns - The array of column definitions.
 * @param props.sort - The sort configuration.
 * @param props.rowActions - The array of row actions.
 * @param props.scrollXSubject - The observable for the x-axis scroll position.
 * @param props.onClickHeaderColumn - The callback function for clicking on a header column.
 * @param props.onScrollX - The callback function for horizontal scrolling.
 * @returns - The rendered header component.
 */
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

  /**
   * Callback function used to handle a reference to an HTMLDivElement.
   *
   * @param ref - The reference to the HTMLDivElement.
   * @returns
   */
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

  /**
   * Renders a checkbox component based on the current selection mode.
   *
   * @returns The rendered checkbox component or null if the selection mode is not valid.
   */
  const renderCheckbox = useCallback(() => {
    if (selectionMode === SelectionMode.Single) {
      return (
        <Radio
          readOnly
          sx={{ cursor: "not-allowed", pointerEvents: "none" }}
          color="primary"
        />
      );
    } else if (selectionMode === SelectionMode.Multiple) {
      return (
        <Checkbox
          readOnly
          sx={{ cursor: "not-allowed", pointerEvents: "none" }}
          color="primary"
        />
      );
    } else if (selectionMode === SelectionMode.None) {
      return (
        <Checkbox
          color="primary"
          sx={{ cursor: "not-allowed", pointerEvents: "none" }}
          disabled
        />
      );
    } else {
      return null;
    }
  }, []);

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
            {renderCheckbox()}
          </Center>
        )}
        {columns.map((column, idx) => {
          const rowId = `${String(column.field)}-${idx}`;
          return (
            <Cell
              key={rowId}
              sx={{
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
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
