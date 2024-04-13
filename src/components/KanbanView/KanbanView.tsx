import * as React from "react";
import { useEffect, useMemo, useRef, useState, forwardRef } from "react";
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
import { FetchLabelProvider } from "./hooks/useFetchLabel";

import useSingleton from "../../hooks/useSingleton";
import useSubject from "../../hooks/useSubject";

import getGenesisStamp from "../../utils/getGenesisStamp";
import classNames from "../../utils/classNames";
import Source from "../../utils/rx/Source";
import ttl from "../../utils/hof/ttl";
import compose from "../../utils/compose";

import IBoardRowInternal from "./model/IBoardRowInternal";
import IAnything from "../../model/IAnything";
import IBoardRow from "./model/IBoardRow";

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
    [`& .${SCROLL_VIEW_TARGER}`]: {
      "& > div > div": {
        marginBottom: theme.spacing(2),
      },
    },
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
/**
 * KanbanViewInternal is a React component that renders a kanban board view. It displays items in columns and allows dragging and dropping of items between columns.
 *
 * @template Data - The type of data associated with each item in the kanban board columns.
 * @template Payload - The type of payload to be passed to various event handlers.
 * @template ColumnType - The type of column identifier.
 *
 * @param props - The props object.
 * @param props.reloadSubject - An observable that triggers a reload of the data.
 * @param [props.withUpdateOrder] - A flag indicating whether to update the order of items based on their updatedAt property.
 * @param props.columns - An array of column definitions.
 * @param [props.className] - Additional CSS class to apply to the component.
 * @param [props.payload={}] - The payload object to be passed to various event handlers.
 * @param [props.disabled=false] - A flag indicating whether the component is disabled.
 * @param props.items - The array of items to be displayed in the kanban board.
 * @param [props.style] - Additional inline styles to apply to the component.
 * @param [props.sx] - Additional sx styles to apply to the component.
 * @param [props.deps=[]] - An array of dependencies to watch for changes.
 * @param [props.withGoBack=false] - A flag indicating whether to allow items to be dragged back to the previous column.
 * @param [props.withHeaderTooltip=false] - A flag indicating whether to show a tooltip on the column header.
 * @param [props.filterFn=() => true] - A function to filter the items to be displayed in the kanban board.
 * @param [props.cardLabel=(id) => id] - A function to generate the label for each card.
 * @param [props.bufferSize=DEFAULT_BUFFERSIZE] - The buffer size for the virtual view.
 * @param [props.minRowHeight=DEFAULT_MINROWHEIGHT] - The minimum height of each row in the virtual view.
 * @param [props.rowTtl=DEFAULT_ROWTTL] - The time-to-live for each row in the virtual view cache.
 * @param [props.AfterCardContent] - React node to be displayed after the card content.
 * @param [props.AfterColumnTitle] - A function to render additional content after the column title.
 * @param [props.BeforeColumnTitle] - A function to render additional content before the column title.
 * @param [props.onDataRequest] - A callback function to be called when data is requested.
 * @param [props.onChangeColumn] - A callback function to be called when an item is moved to a different column.
 * @param [props.onCardLabelClick] - A callback function to be called when a card label is clicked.
 * @param [props.onLoadStart] - A callback function to be called when the data loading starts.
 * @param [props.onLoadEnd] - A callback function to be called when the data loading ends.
 * @param [props.fallback] - React node to be displayed when data loading fails.
 * @param [props.throwError] - A flag indicating whether to throw an error when data loading fails.
 * @param ref - A ref object to attach to the root element of the component.
 * @returns - The rendered KanbanViewInternal component.
 */
const KanbanViewInternal = <
  Data extends IAnything = IAnything,
  Payload extends IAnything = IAnything,
  ColumnType = IAnything
>(
  {
    reloadSubject: upperReloadSubject,
    withUpdateOrder,
    columns: upperColumns,
    className,
    payload: upperPayload = {} as Payload,
    disabled = false,
    items,
    style,
    sx,
    deps = [],
    withGoBack = false,
    withHeaderTooltip = false,
    filterFn = () => true,
    cardLabel = (id) => id,
    bufferSize = DEFAULT_BUFFERSIZE,
    minRowHeight = DEFAULT_MINROWHEIGHT,
    rowTtl = DEFAULT_ROWTTL,
    AfterCardContent,
    AfterColumnTitle,
    BeforeColumnTitle,
    onDataRequest,
    onChangeColumn,
    onCardLabelClick,
    onLoadStart,
    onLoadEnd,
    fallback,
    throwError,
  }: IKanbanViewProps<Data, Payload, ColumnType>,
  ref: React.Ref<HTMLDivElement>
) => {
  const reloadSubject = useSubject(upperReloadSubject);

  const [dragColumn, setDragColumn] = useState<ColumnType | null>(null);
  const dragId = useRef<string | null>(null);

  const { classes } = useStyles();

  const theme = useTheme();

  const payload = useSingleton(upperPayload);
  const columns = useSingleton(upperColumns);

  /**
   * Fetches transformed rows from a given set of rows.
   *
   * @param id - The ID used for fetching the rows.
   * @param data - Additional data used for transformations.
   * @param rows - The rows to be transformed.
   * @returns The transformed rows.
   */
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
              const visibleValue =
                typeof visible === "function"
                  ? await visible(id, data, payload)
                  : visible === undefined ? true : !!visible;
              const label = visibleValue
                ? typeof value === "function"
                  ? await value(id, data, payload)
                  : value
                : undefined;
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

  /**
   * A memoized function that fetches a label.
   *
   * @param _ - The unused parameter.
   * @param fn - A function that returns a React node or a promise that resolves to a React node.
   * @return {Promise<React.ReactNode>} - A promise that resolves to a React node.
   */
  const fetchLabel = useMemo(
    () =>
      ttl(
        async (
          _: string,
          fn: () => React.ReactNode | Promise<React.ReactNode>
        ): Promise<React.ReactNode> => {
          return await fn();
        },
        {
          key: ([id]) => id,
          timeout: rowTtl,
        }
      ),
    []
  );

  useEffect(() => {
    onDataRequest && onDataRequest(true);
  }, []);

  useEffect(() => Source.fromEvent('visibilitychange').connect(() => {
    if (document.visibilityState === 'visible') {
      onDataRequest && onDataRequest(false);
    }
  }), []);

  useEffect(
    () =>
      Source.fromInterval(DEFAULT_GCINTERVAL).connect(() => {
        fetchRows.gc();
        fetchLabel.gc();
      }),
    []
  );

  useEffect(
    () =>
      reloadSubject.subscribe(() => {
        fetchRows.clear();
        fetchLabel.clear();
      }),
    []
  );

  /**
   * Variable: itemMap
   *
   * Description:
   * The `itemMap` variable is a memoized `Map` object where keys are of type `ColumnType`
   * and values are arrays of `IBoardItem<Data, Payload, ColumnType>`.
   *
   * The `itemMap` is created by using the `useMemo()` hook. It performs the following steps:
   *  1. Initializes an empty `Map` object.
   *  2. Filters `items` array using the provided `filterFn`.
   *  3. If `withUpdateOrder` is `true`, sorts the filtered `itemListAll` based on the `updatedAt` property in descending order.
   *  4. Iterates through each `column` in the `columns` array.
   *      a. Filters `itemListAll` to get items with matching `column` property.
   *      b. Sets the `column` as the key and the filtered `itemList` as the value in the `itemMap`.
   *  5. Returns the final `itemMap`.
   *
   *
   * @param items - The list of board items.
   * @param columns - The list of columns.
   * @param filterFn - The filter function used to filter the items.
   * @param withUpdateOrder - Flag indicating whether to sort the items based on `updatedAt` property.
   * @param deps - Additional dependencies used by `useMemo()` hook.
   *
   * @returns - The memoized map of items grouped by columns.
   */
  const itemMap = useMemo(() => {
    const itemMap = new Map<
      ColumnType,
      IBoardItem<Data, Payload, ColumnType>[]
    >();
    const itemListAll = items.filter(filterFn);
    if (withUpdateOrder) {
      itemListAll.sort(
        ({ updatedAt: a = getGenesisStamp() as unknown as string }, { updatedAt: b = getGenesisStamp() as unknown as string }) =>
          dayjs(a).isBefore(b) ? 1 : -1
      );
    }
    for (const { column } of columns) {
      const itemList = itemListAll.filter((item) => item.column === column);
      itemMap.set(column, itemList);
    }
    return itemMap;
  }, [items, ...deps]);

  useEffect(() => {
    fetchRows.clear();
    fetchLabel.clear();
  }, [itemMap, ...deps]);

  /**
   * Retrieves a list of columns from a given array of objects using the "columns" key.
   * This list is memoized using React's useMemo hook, ensuring that it is only computed when the dependencies change.
   *
   * @param columns - The array of objects containing columns.
   *
   * @returns - The resulting list of columns.
   */
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
      <FetchLabelProvider payload={fetchLabel}>
        <Box
          ref={ref}
          className={classNames(classes.root, className, {
            [classes.disabled]: disabled,
          })}
          style={style}
          sx={sx}
        >
          <Box className={classes.container}>
            <ScrollView withScrollbar hideOverflowY className={classes.content}>
              {columns.map(({ column, rows, label, color = defaultColor }, idx) => {
                const itemList = itemMap.get(column) || [];
                return (
                  <Box
                    key={`${column}-${idx}`}
                    onDrop={() => {
                      const item = items.find(
                        ({ id }) => id === dragId.current
                      );
                      if (item) {
                        const prevColumnIdx = columnList.indexOf(item.column);
                        const currentColumnIdx = columnList.indexOf(column);
                        let isPrevColumn = true;
                        isPrevColumn = isPrevColumn && !withGoBack;
                        isPrevColumn =
                          isPrevColumn && prevColumnIdx > currentColumnIdx;
                        if (isPrevColumn) {
                          return;
                        }
                        if (prevColumnIdx === currentColumnIdx) {
                          return;
                        }
                        setDragColumn(null);
                        fetchLabel.clear(dragId.current);
                        fetchRows.clear(dragId.current);
                        onChangeColumn &&
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
                            reloadSubject={reloadSubject}
                            withGoBack={withGoBack}
                            withHeaderTooltip={withHeaderTooltip}
                            payload={payload}
                            key={document.id}
                            onChangeColumn={(id, ...args) => {
                              fetchLabel.clear(id);
                              fetchRows.clear(id);
                              onChangeColumn && onChangeColumn(id, ...args);
                            }}
                            onDrag={() => {
                              dragId.current = document.id;
                            }}
                            disabled={disabled}
                            columns={columns}
                            rows={rows}
                            label={document.label || cardLabel}
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
      </FetchLabelProvider>
    </FetchRowsProvider>
  );
};

/**
 * @example useEffect(KanbanViewInternal.enableScrollOnDrag(ref), [])
 */
KanbanViewInternal.enableScrollOnDrag =
  (
    ref: React.MutableRefObject<HTMLDivElement | undefined>,
    {
      threshold = 200,
      speed = 15,
    }: {
      threshold?: number;
      speed?: number;
    } = {}
  ) =>
  () => {
    const scrollViewTarget = ref.current?.querySelector<HTMLDivElement>(
      `.${SCROLL_VIEW_TARGER}`
    );

    if (!scrollViewTarget) {
      console.warn("KanbanViewInternal enableScrollOnDrag ref is undefined");
      return () => undefined;
    }

    let isDragging = false;
    let clientX = 0;

    const dragOverSubject = Source.create<MouseEvent>((next) => {
      document.addEventListener("dragover", next);
      return () => document.removeEventListener("dragover", next);
    });

    const dragStateSubject = Source.create<boolean>((next) => {
      const handler =
        (enter = true) =>
        () =>
          next(enter);
      const leave = handler(false);
      const enter = handler(true);
      document.body.addEventListener("dragstart", enter);
      document.body.addEventListener("dragend", leave);
      return () => {
        document.body.removeEventListener("dragend", leave);
        document.body.removeEventListener("dragstart", enter);
      };
    });

    const scrollStateSubject = Source.create<number>((next) => {
      let scrollInterval: NodeJS.Timer | null = null;

      const handler = () => {
        if (!isDragging) {
          return;
        }
        const { left, right } = scrollViewTarget.getBoundingClientRect();
        if (clientX < left + threshold) {
          next(Math.max(scrollViewTarget.scrollLeft - speed, 0));
        } else if (clientX > right - threshold) {
          next(scrollViewTarget.scrollLeft + speed);
        }
      };

      const unDragState = dragStateSubject.connect((isDragging) => {
        scrollInterval && clearInterval(scrollInterval);
        if (isDragging) {
          scrollInterval = setInterval(handler, 10);
        }
      });

      return compose(
        () => scrollInterval && clearInterval(scrollInterval),
        unDragState
      );
    });

    const unDragOver = dragOverSubject.connect((event) => {
      clientX = event.clientX;
    });

    const unDragState = dragStateSubject.connect((dragging) => {
      isDragging = dragging;
    });

    const touchStartSubject = Source.create<TouchEvent>((next) => {
      document.addEventListener("touchstart", next, {
        passive: true,
      });
      return () => document.removeEventListener("touchstart", next);
    });

    const unScrollState = scrollStateSubject.connect((left) => {
      scrollViewTarget.scrollLeft = left;
    });

    const disposeFn = compose(unDragOver, unDragState, unScrollState);

    const unTouchStart = touchStartSubject.connect(disposeFn);

    return compose(disposeFn, unTouchStart);
  };

/**
 * @template Data, Payload, ColumnType
 * @typedef IKanbanViewProps - Props for KanbanViewInternal component
 * @property reloadSubject - Subject that triggers data reload
 * @property withUpdateOrder - Determines whether items should be sorted by update date
 * @property columns - Array of columns with corresponding rows, label and color
 * @property className - CSS class name for the component
 * @property payload - Payload object for custom data
 * @property disabled - Determines whether the component is disabled
 * @property items - Array of kanban items
 * @property style - Inline styles for the component
 * @property sx - Material-UI system styles
 * @property deps - Array of dependencies
 * @property withGoBack - Determines whether to allow going back to previous columns when dragging an item
 * @property withHeaderTooltip - Determines whether to show tooltip on column headers
 * @property filterFn - Function to filter kanban items
 * @property cardLabel - Function to generate card label from item ID
 * @property bufferSize - The number of card items to render in the virtual view
 * @property minRowHeight - Minimum height of each row in the virtual view
 * @property rowTtl - Time-to-live in milliseconds for each row cache
 * @property AfterCardContent - Custom component to render after card content
 * @property AfterColumnTitle - Custom component to render after column title
 * @property BeforeColumnTitle - Custom component to render before column title
 * @property onDataRequest - Function called when data is requested
 * @property onChangeColumn - Function called when an item is dragged to a new column
 * @property onCardLabelClick - Function called when the card label is clicked
 * @property onLoadStart - Function called when data loading starts
 * @property onLoadEnd - Function called when data loading ends
 * @property fallback - Function or React node to render when an error occurs
 * @property throwError - Function called when an error occurs
 * @property ref - Ref object for the root element of the component
 */
export const KanbanView = forwardRef(
  KanbanViewInternal
) as unknown as typeof KanbanViewInternal;
KanbanView.enableScrollOnDrag = KanbanViewInternal.enableScrollOnDrag;

export default KanbanView;
