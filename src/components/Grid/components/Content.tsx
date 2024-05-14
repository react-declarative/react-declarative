import * as React from "react";
import { useMemo, useEffect } from "react";
import { SxProps } from "@mui/material";

import { makeStyles } from "../../../styles";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import IColumn from "../model/IColumn";
import IGridProps from "../model/IGridProps";
import RowData from "../model/RowData";

import Line from "./Line";
import ContentRow from "./ContentRow";

import VirtualView from "../../VirtualView";

import classNames from "../../../utils/classNames";
import memoize from "../../../utils/hof/memoize";
import get from "../../../utils/get";

import useContainerSize from "../hooks/useContainerSize";
import useSubject from "../../../hooks/useSubject";

import { DEFAULT_ROW_HEIGHT } from "../config";

/**
 * Represents the props for the Content component.
 */
interface IContentProps {
  className?: string;
  style?: React.CSSProperties;
  sx?: SxProps<any>;
  recomputeSubject: IGridProps["recomputeSubject"];
  scrollXSubject: IGridProps["scrollYSubject"];
  scrollYSubject: IGridProps["scrollXSubject"];
  columns: Array<IColumn>;
  rowKey: IGridProps["rowKey"];
  loading: IGridProps["loading"];
  minRowHeight: IGridProps["minRowHeight"];
  bufferSize: IGridProps["bufferSize"];
  data: IGridProps["data"];
  hasMore: IGridProps["hasMore"];
  errorMessage: IGridProps["errorMessage"];
  rowActions: IGridProps["rowActions"];
  payload: IGridProps["payload"];
  noDataLabel: IGridProps["noDataLabel"];
  onScrollX: (scrollX: number) => void;
  onTableRowClick: IGridProps["onTableRowClick"];
  onRowAction: IGridProps["onRowAction"];
  onButtonSkip: IGridProps["onButtonSkip"];
  onSkip: IGridProps["onSkip"];
  rowMark: IGridProps["rowMark"];
  rowColor: IGridProps["rowColor"];
}

/**
 * Defines the styles for a component.
 *
 * @typedef StylesObject
 * @property content - The styles for the content element.
 * @property noData - The styles for the noData element.
 */
const useStyles = makeStyles()({
  content: {
    height: "calc(100% - 35px)",
  },
  noData: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "12px",
  },
});

/**
 * Renders the content of a virtual view table.
 *
 * @param props - The props object.
 * @param props.className - The CSS class name for the content.
 * @param props.style - The inline style object for the content.
 * @param props.sx - The sx prop for the content.
 * @param props.recomputeSubject - The recompute subject function.
 * @param props.scrollXSubject - The scrollX subject function.
 * @param props.scrollYSubject - The scrollY subject function.
 * @param props.columns - The columns of the table.
 * @param props.loading - Indicates if the table is in a loading state.
 * @param props.data - The data to be rendered in the table.
 * @param props.rowKey - The key to identify each row in the table.
 * @param props.hasMore - Indicates if there is more data available.
 * @param props.errorMessage - The error message to be displayed.
 * @param props.rowActions - The actions available for each row.
 * @param props.payload - The payload object for the content.
 * @param props.minRowHeight - The minimum height of each row.
 * @param props.bufferSize - The number of buffers to use for the virtual view.
 * @param props.onTableRowClick - The click event handler for a table row.
 * @param props.onRowAction - The event handler for a row action.
 * @param props.onButtonSkip - The click event handler for the show more button.
 * @param props.onSkip - The event handler for skipping data.
 * @param props.onScrollX - The event handler for the horizontal scroll.
 * @param props.rowMark - The function to mark a row.
 *
 * @returns The content component.
 */
export const Content = ({
  className,
  style,
  sx,
  recomputeSubject: upperRecomputeSubject,
  scrollXSubject,
  scrollYSubject,
  columns,
  loading,
  data,
  rowKey = "id",
  hasMore,
  errorMessage,
  rowActions,
  payload,
  minRowHeight = DEFAULT_ROW_HEIGHT,
  bufferSize,
  onTableRowClick,
  onRowAction,
  onButtonSkip,
  onSkip,
  onScrollX,
  noDataLabel = "No data",
  rowMark: upperRowMark = () => "",
  rowColor: upperRowColor = () => "",
}: IContentProps) => {
  const { classes } = useStyles();

  const { width } = useContainerSize();
  const recomputeSubject = useSubject(upperRecomputeSubject);

  const rowMark = useMemo(
    () => memoize(([row]) => row[rowKey] || row, upperRowMark),
    []
  );

  const rowColor = useMemo(
    () => memoize(([row]) => row[rowKey] || row, upperRowColor),
    []
  );

  useEffect(() => recomputeSubject.subscribe(() => {
    rowMark.clear();
  }), []);

  useEffect(
    () => () => {
      rowMark.clear();
    },
    []
  );

  return (
    <VirtualView
      withScrollbar
      className={classNames(className, classes.content)}
      style={style}
      sx={sx}
      scrollXSubject={scrollXSubject}
      scrollYSubject={scrollYSubject}
      minRowHeight={minRowHeight}
      bufferSize={bufferSize}
      loading={loading}
      hasMore={hasMore}
      onDataRequest={(initial) => {
        if (onSkip && hasMore) {
          onSkip(initial);
        }
      }}
      onScroll={(e) => {
        const target = e.target as HTMLDivElement;
        if (onScrollX) {
          onScrollX(target.scrollLeft);
        }
      }}
    >
      {!loading && !errorMessage && data.length === 0 && (
        <Line columns={columns} withRowActions={!!rowActions?.length}>
          <Box
            className={classes.noData}
            sx={{ position: "sticky", left: 0, width }}
          >
            <Typography variant="body1">{noDataLabel}</Typography>
          </Box>
        </Line>
      )}
      {errorMessage && (
        <Line columns={columns} withRowActions={!!rowActions?.length}>
          <Box
            className={classes.noData}
            sx={{ position: "sticky", left: 0, width }}
          >
            <Typography color="error" variant="body1">
              {errorMessage}
            </Typography>
          </Box>
        </Line>
      )}
      {data.map((row: RowData, idx) => {
        const rowId = `${get(row, rowKey)}-${idx}`;
        return (
          <ContentRow
            key={rowId}
            rowMark={rowMark}
            rowColor={rowColor}
            columns={columns}
            row={row}
            recomputeSubject={recomputeSubject}
            onTableRowClick={onTableRowClick}
            onRowAction={onRowAction}
            rowActions={rowActions}
            payload={payload}
            rowKey={rowKey}
          />
        );
      })}
      {data.length > 0 &&
        !errorMessage &&
        onButtonSkip &&
        !onSkip &&
        !loading &&
        hasMore && (
          <Line columns={columns} withRowActions={!!rowActions?.length}>
            <Box
              className={classes.noData}
              sx={{ position: "sticky", left: 0, width }}
            >
              <Button variant="outlined" onClick={onButtonSkip}>
                Show More
              </Button>
            </Box>
          </Line>
        )}
    </VirtualView>
  );
};

export default Content;
