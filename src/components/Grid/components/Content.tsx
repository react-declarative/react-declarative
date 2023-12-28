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

interface IContentProps {
  className?: string;
  style?: React.CSSProperties;
  sx?: SxProps;
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
  onScrollX: (scrollX: number) => void;
  onTableRowClick: IGridProps["onTableRowClick"];
  onRowAction: IGridProps["onRowAction"];
  onButtonSkip: IGridProps["onButtonSkip"];
  onSkip: IGridProps["onSkip"];
  rowMark: IGridProps["rowMark"];
}

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
  rowMark: upperRowMark = () => "",
}: IContentProps) => {
  const { classes } = useStyles();

  const { width } = useContainerSize();
  const recomputeSubject = useSubject(upperRecomputeSubject);

  const rowMark = useMemo(
    () => memoize(([row]) => row[rowKey] || row, upperRowMark),
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
            <Typography variant="body1">No data</Typography>
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
