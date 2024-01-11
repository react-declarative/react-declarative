import * as React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { alpha, darken } from "@mui/material";
import dayjs from "dayjs";

import { makeStyles, useTheme } from "../../styles";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import ScrollView, { SCROLL_VIEW_TARGER } from "../ScrollView";
import VirtualView from "../VirtualView";

import Card from "./components/Card";

import IKanbanViewProps from "./model/IKanbanViewProps";
import IBoardItem from "./model/IBoardItem";

import { FetchRowsProvider } from "./hooks/useFetchRows";
import useSingleton from "../../hooks/useSingleton";

import classNames from "../../utils/classNames";
import Source from "../../utils/rx/Source";
import ttl from "../../utils/hof/ttl";

import IBoardRowInternal from "./model/IBoardRowInternal";
import IAnything from "../../model/IAnything";
import IBoardRow from "./model/IBoardRow";
import compose from "../../utils/compose";

const DEFAULT_BUFFERSIZE = 15;
const DEFAULT_MINROWHEIGHT = 125;
const DEFAULT_ROWTTL = 500;
const DEFAULT_GCINTERVAL = 45_000;

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
    maxWidth: "276px",
    minWidth: "276px",
    marginRight: 10,
    borderRadius: "6px",
  },
  groupWrapper: {
    flex: 1,
    padding: 10,
    marginTop: 45,
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

export const KanbanView = <
  Data extends IAnything = IAnything,
  Payload extends IAnything = IAnything,
  ColumnType = IAnything
>({
  withUpdateOrder,
  columns: upperColumns,
  className,
  payload: upperPayload = {} as Payload,
  disabled = false,
  items,
  style,
  sx,
  withGoBack = false,
  filterFn = () => true,
  bufferSize = DEFAULT_BUFFERSIZE,
  minRowHeight = DEFAULT_MINROWHEIGHT,
  rowTtl = DEFAULT_ROWTTL,
  AfterCardContent,
  AfterColumnTitle,
  BeforeColumnTitle,
  onChangeColumn = () => {},
  onCardLabelClick,
  onLoadStart,
  onLoadEnd,
  fallback,
  throwError,
}: IKanbanViewProps<Data, Payload, ColumnType>) => {
  const [dragColumn, setDragColumn] = useState<ColumnType | null>(null);
  const dragId = useRef<string | null>(null);

  const { classes } = useStyles();

  const theme = useTheme();

  const payload = useSingleton(upperPayload);
  const columns = useSingleton(upperColumns);

  const fetchRows = useMemo(
    () =>
      ttl(
        async (
          id: string,
          data: IAnything,
          rows: IBoardRow[]
        ): Promise<IBoardRowInternal[]> => {
          const result = await Promise.all(
            rows.map(async ({ value, visible, ...other }) => {
              const visibleResult =
                typeof visible === "function"
                  ? await visible(id, data, payload)
                  : visible;
              const visibleValue =
                typeof visibleResult === "boolean" ? visibleResult : true;
              const label =
                typeof value === "function"
                  ? await value(id, data, payload)
                  : value;
              return {
                visible: visibleValue,
                value: label,
                ...other,
              };
            })
          );
          return result.filter(({ visible }) => visible);
        },
        {
          key: ([id]) => id,
          timeout: rowTtl,
        }
      ),
    []
  );

  useEffect(
    () =>
      Source.fromInterval(DEFAULT_GCINTERVAL).connect(() => {
        fetchRows.gc();
      }),
    []
  );

  const itemMap = useMemo(() => {
    const itemMap = new Map<ColumnType, IBoardItem<Data, ColumnType>[]>();
    const itemListAll = items.filter(filterFn);
    if (withUpdateOrder) {
      itemListAll.sort(
        ({ updatedAt: a = "1970-01-01" }, { updatedAt: b = "1970-01-01" }) =>
          dayjs(a).isBefore(b) ? 1 : -1
      );
    }
    for (const { column } of columns) {
      const itemList = itemListAll.filter((item) => item.column === column);
      itemMap.set(column, itemList);
    }
    return itemMap;
  }, [items]);

  useEffect(() => {
    fetchRows.clear();
  }, [itemMap]);

  const columnList = useMemo(() => columns.map(({ column }) => column), []);
  const defaultColor = useMemo(
    () =>
      theme.palette.mode === "dark"
        ? darken(theme.palette.background.paper, 0.06)
        : alpha("#000", 0.1),
    []
  );

  return (
    <FetchRowsProvider payload={fetchRows}>
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
                      onChangeColumn(
                        dragId.current!,
                        column,
                        item.data,
                        payload
                      );
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
                  className={classes.group}
                >
                  <Box className={classes.groupHeader}>
                    <Box
                      className={classNames({
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
                      {label || String(column)}
                    </Typography>
                    {AfterColumnTitle && (
                      <AfterColumnTitle column={column} payload={payload} />
                    )}
                  </Box>
                  <Box
                    className={classNames(classes.groupWrapper, {
                      [classes.activeGroup]: dragColumn === column,
                    })}
                    sx={{
                      background: color,
                    }}
                  >
                    <VirtualView
                      bufferSize={bufferSize}
                      className={classes.list}
                      minRowHeight={minRowHeight}
                    >
                      {itemList.map((document) => (
                        <Card
                          withGoBack={withGoBack}
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
                </Box>
              );
            })}
          </ScrollView>
        </Box>
      </Box>
    </FetchRowsProvider>
  );
};

KanbanView.enableScrollOnDrag = ({
  threshold = 150,
  speed = 20,
}: {
  threshold?: number;
  speed?: number;
} = {}) => {
  const scrollViewTarget = document.querySelector<HTMLDivElement>(
    `.${SCROLL_VIEW_TARGER}`
  );

  if (!scrollViewTarget) {
    return () => undefined;
  }

  let scrollInterval: NodeJS.Timer | null = null;

  const mouseMoveSubject = Source.create<MouseEvent>((next) => {
    document.addEventListener("mousemove", next);
    return () => document.removeEventListener("mousemove", next);
  });

  const mouseUpSubject = Source.create<MouseEvent>((next) => {
    document.addEventListener("mouseup", next);
    return () => document.removeEventListener("mouseup", next);
  });

  const touchEndSubject = Source.create<TouchEvent>((next) => {
    document.addEventListener("touchend", next);
    return () => document.removeEventListener("touchend", next);
  });

  const unMouseMove = mouseMoveSubject.connect((event) => {
    if (document.activeElement?.closest(`.${SCROLL_VIEW_TARGER}`)) {
      if (event.clientY < scrollViewTarget!.offsetTop + threshold) {
        scrollInterval && clearInterval(scrollInterval);
        scrollInterval = setInterval(function () {
          scrollViewTarget.scrollTop -= speed;
        }, 10);
      } else if (event.clientY > window.innerHeight - threshold) {
        scrollInterval && clearInterval(scrollInterval);
        scrollInterval = setInterval(function () {
          scrollViewTarget.scrollTop += speed;
        }, 10);
      } else {
        scrollInterval && clearInterval(scrollInterval);
      }
    }
  });

  const unMouseUp = Source.join([mouseUpSubject, touchEndSubject], {
    race: true,
  }).connect(() => {
    scrollInterval && clearInterval(scrollInterval);
  });

  return compose(unMouseMove, unMouseUp);
};

export default KanbanView;
