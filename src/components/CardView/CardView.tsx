import * as React from "react";
import { useState, useCallback, useMemo } from "react";

import { makeStyles } from "../../styles";

import Box from "@mui/material/Box";

import VirtualView from "../VirtualView";

import CardItem from "./components/CardItem";

import ICardViewProps from "./model/ICardViewProps";
import IItemData from "./model/IItemData";

import { StateContextProvider, IState } from "./context/StateContext";
import { PropsContextProvider } from "./context/PropsContext";

import useActualCallback from "../../hooks/useActualCallback";
import useSubject from "../../hooks/useSubject";

import classNames from "../../utils/classNames";

const DEFAULT_SKIP_STEP = 25;

const useStyles = makeStyles()({
  root: {
    position: 'relative',
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    justifyContent: "stretch",
    width: '100%',
  },
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    justifyContent: "stretch",
  },
  content: {
    flex: 1,
  },
});

export const CardView = <ItemData extends IItemData = any>(
  props: ICardViewProps<ItemData>
) => {
  const {
    className,
    style,
    sx,
    handler,
    scrollXSubject: upperScrollXSubject,
    scrollYSubject,
    onLoadStart,
    onLoadEnd,
    fallback,
    skipStep = DEFAULT_SKIP_STEP,
    throwError = false,
  } = props;
  const { classes } = useStyles();
  const [state, setState] = useState<IState<ItemData>>(() => ({
    items: [],
    loading: false,
    hasMore: true,
    search: "",
    skip: 0,
    isAllSelected: false,
    selectedIds: new Set(),
  }));
  const setLoading = useCallback(
    (loading: boolean) => setState((prevState) => ({ ...prevState, loading })),
    []
  );
  const scrollXSubject = useSubject(upperScrollXSubject);
  const handleDataRequest = useActualCallback(async (initial: boolean) => {
    if (state.loading) {
      return;
    }
    if (!state.hasMore) {
      return;
    }
    if (initial) {
      setState((prevState) => ({
        ...prevState,
        items: [],
        selectedIds: new Set(),
      }));
      scrollXSubject.next(0);
    }
    let isOk = true;
    try {
      onLoadStart && onLoadStart();
      setLoading(true);
      if (typeof handler === "function") {
        const items = await handler(state.search, state.skip);
        setState((prevState) => {
          const prevItemMap = new Map(
            prevState.items.map((item) => [item.id, item])
          );
          for (const item of items) {
            if (prevItemMap.has(item.id)) {
              prevItemMap.set(item.id, item);
            }
          }
          const pendingItems = items.filter(({ id }) => !prevItemMap.has(id));
          return {
            ...prevState,
            skip: prevState.skip + skipStep,
            hasMore: pendingItems.length >= skipStep,
            items: [...prevItemMap.values(), ...pendingItems],
          };
        });
      } else {
        setState((prevState) => ({
          ...prevState,
          items: handler,
          hasMore: false,
        }));
      }
    } catch (e: any) {
      isOk = false;
      if (!throwError) {
        fallback && fallback(e as Error);
      } else {
        throw e;
      }
    } finally {
      onLoadEnd && onLoadEnd(isOk);
      setLoading(false);
    }
  });
  const stateContext = useMemo(
    () => ({
      state,
      action: {
        setSearch: (search: string) =>
          setState((prevState) => ({
            ...prevState,
            search,
          })),
        setIsAllSelected: (isAllSelected: boolean) =>
          setState((prevState) => ({
            ...prevState,
            isAllSelected,
          })),
        setSelectedIds: (selectedIds: Set<IItemData["id"]>) =>
          setState((prevState) => ({
            ...prevState,
            selectedIds,
          })),
      },
    }),
    [state]
  );
  return (
    <PropsContextProvider value={props}>
      <StateContextProvider<ItemData> value={stateContext}>
        <Box
          className={classNames(className, classes.root)}
          style={style}
          sx={sx}
        >
          <Box className={classes.container}>
            <VirtualView
              className={classes.content}
              loading={state.loading}
              hasMore={state.hasMore}
              onDataRequest={handleDataRequest}
              scrollXSubject={scrollXSubject}
              scrollYSubject={scrollYSubject}
            >
              {state.items.map((item, idx) => (
                <CardItem
                  key={`${item.id}-${idx}`}
                  item={item}
                />
              ))}
            </VirtualView>
          </Box>
        </Box>
      </StateContextProvider>
    </PropsContextProvider>
  );
};

export default CardView;
