import * as React from "react";
import { useMemo, useRef, useState } from "react";
import { alpha, darken } from "@mui/material";
import dayjs from "dayjs";

import { makeStyles, useTheme } from "../../styles";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import ScrollView from "../ScrollView";
import VirtualView from "../VirtualView";

import Card from "./components/Card";

import IKanbanViewProps from "./model/IKanbanViewProps";
import IBoardItem from "./model/IBoardItem";

import useSingleton from "../../hooks/useSingleton";

import classNames from "../../utils/classNames";

const DEFAULT_BUFFERSIZE = 15;
const DEFAULT_MINROWHEIGHT = 125;

const useStyles = makeStyles()((theme) => ({
  root: {
    display: "flex",
    alignItems: "stretch",
    justifyContent: "stretch",
    flexDirection: "column",
    minHeight: "100%",
    width: "100%",
  },
  container: {
    position: "relative",
    flex: 1,
    display: "flex",
    alignItems: "stretch",
    justifyContent: "stretch",
  },
  content: {
    flex: 1,
    display: "flex",
  },
  group: {
    position: "relative",
    overflow: "hidden",
    display: "flex",
    alignItems: "stretch",
    justifyContent: "stretch",
    flexDirection: "column",
    maxWidth: "276px",
    minWidth: "276px",
    gap: 10,
    padding: 10,
    marginRight: 10,
    borderRadius: "6px",
    border: "1px solid transparent",
  },
  groupHeader: {
    position: "absolute",
    paddingLeft: 12,
    top: 0,
    left: 0,
    height: "45px",
    width: "100%",
    background: theme.palette.background.paper,
    display: "flex",
    alignItems: "center",
    justifyContent: "stretch",
    gap: 8,
  },
  groupHeaderAdjust: {
    height: "35px",
  },
  activeGroup: {
    background: `${theme.palette.primary.main} !important`,
  },
  list: {
    flex: 1,
    minWidth: "256px",
    height: "100%",
  },
  disabled: {
    pointerEvents: "none",
    cursor: "not-allowed",
  },
}));

export const KanbanView = ({
  withUpdateOrder,
  columns: upperColumns,
  className,
  payload: upperPayload = {},
  disabled = false,
  items,
  style,
  sx,
  bufferSize = DEFAULT_BUFFERSIZE,
  minRowHeight = DEFAULT_MINROWHEIGHT,
  AfterCardContent,
  AfterColumnTitle,
  BeforeColumnTitle,
  onChangeColumn = () => {},
  onCardLabelClick,
  onLoadStart,
  onLoadEnd,
  fallback,
  throwError,
}: IKanbanViewProps) => {
  const [dragColumn, setDragColumn] = useState<string | null>(null);
  const dragId = useRef<string | null>(null);

  const { classes } = useStyles();

  const theme = useTheme();

  const payload = useSingleton(upperPayload);
  const columns = useSingleton(upperColumns);

  const itemMap = useMemo(() => {
    const itemMap = new Map<string, IBoardItem[]>();
    for (const { column } of columns) {
      const itemList = items.filter((item) => item.column === column);
      if (withUpdateOrder) {
        itemList.sort(
          ({ updatedAt: a = "1970-01-01" }, { updatedAt: b = "1970-01-01" }) =>
            dayjs(a).isBefore(b) ? 1 : -1
        );
      }
      itemMap.set(column, itemList);
    }
    return itemMap;
  }, [items]);

  const columnList = useMemo(() => columns.map(({ column }) => column), []);
  const defaultColor = useMemo(
    () =>
      theme.palette.mode === "dark"
        ? darken(theme.palette.background.paper, 0.06)
        : alpha("#000", 0.1),
    []
  );

  return (
    <Box
      className={classNames(classes.root, className, {
        [classes.disabled]: disabled,
      })}
      style={style}
      sx={sx}
    >
      <Box className={classes.container}>
        <ScrollView withScrollbar hideOverflowY className={classes.content}>
          {columns.map(({ column, rows, label, color = defaultColor }) => {
            const itemList = itemMap.get(column) || [];
            return (
              <Box
                onDrop={() => {
                  const item = items.find(({ id }) => id === dragId.current);
                  if (item) {
                    setDragColumn(null);
                    onChangeColumn(dragId.current!, column, item.data, payload);
                    dragId.current = null;
                  }
                }}
                onDragEnd={() => {
                  setDragColumn(null);
                }}
                onDragOver={(e) => {
                  setDragColumn(column);
                  e.preventDefault();
                }}
                className={classNames(classes.group, {
                  [classes.activeGroup]: dragColumn === column,
                })}
                sx={{
                  background: color,
                }}
              >
                <Box className={classes.groupHeader}>
                  <Box
                    className={classNames(classes.group, {
                      [classes.activeGroup]: dragColumn === column,
                    })}
                    sx={{
                      borderRadius: "50%",
                      height: "12px",
                      width: "12px",
                      background: color,
                    }}
                  />
                  {BeforeColumnTitle && (
                    <BeforeColumnTitle column={column} payload={payload} />
                  )}
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    sx={{ opacity: 0.6, fontSize: "16px", flex: 1 }}
                  >
                    {label || column}
                  </Typography>
                  {AfterColumnTitle && (
                    <AfterColumnTitle column={column} payload={payload} />
                  )}
                </Box>
                <div className={classes.groupHeaderAdjust} />

                <VirtualView
                  bufferSize={bufferSize}
                  className={classes.list}
                  minRowHeight={minRowHeight}
                >
                  {itemList.map((document) => (
                    <Card
                      payload={payload}
                      key={document.id}
                      onChangeColumn={onChangeColumn}
                      onDrag={() => {
                        dragId.current = document.id;
                      }}
                      disabled={disabled}
                      columns={columnList}
                      rows={rows}
                      AfterCardContent={AfterCardContent}
                      onCardLabelClick={onCardLabelClick}
                      onLoadStart={onLoadStart}
                      onLoadEnd={onLoadEnd}
                      fallback={fallback}
                      throwError={throwError}
                      {...document}
                    />
                  ))}
                </VirtualView>
              </Box>
            );
          })}
        </ScrollView>
      </Box>
    </Box>
  );
};

export default KanbanView;
