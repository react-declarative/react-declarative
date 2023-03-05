import * as React from "react";
import { useState, useCallback, useMemo, useEffect } from "react";

import { makeStyles } from "../../styles";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import VirtualView from "../VirtualView";

import Operations from "./components/Operations";
import CardItem from "./components/CardItem";
import Search from "./components/Search";

import ICardViewProps from "./model/ICardViewProps";
import IItemData from "./model/IItemData";

import { StateContextProvider, IState } from "./context/StateContext";
import { PropsContextProvider } from "./context/PropsContext";

import useActualCallback from "../../hooks/useActualCallback";
import useSubject from "../../hooks/useSubject";
import useChange from "../../hooks/useChange";

import classNames from "../../utils/classNames";

const DEFAULT_SKIP_STEP = 25;

const useStyles = makeStyles()({
  root: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    justifyContent: "stretch",
    width: "100%",
  },
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    justifyContent: "stretch",
    gap: 5,
  },
  content: {
    flex: 1,
  },
  placeholder: {
    display: 'flex',
    justifyContent: 'center',
  },
});

export const CardView = <ItemData extends IItemData = any>(
  props: ICardViewProps<ItemData>
) => {
  const {
    className,
    style,
    sx,
    operations,
    handler,
    reloadSubject: upperReloadSubject,
    scrollXSubject: upperScrollXSubject,
    scrollYSubject,
    onLoadStart,
    onLoadEnd,
    fallback,
    skipStep = DEFAULT_SKIP_STEP,
    noSearch = false,
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
    menuOpened: false,
    selectedIds: new Set(),
  }));
  const setLoading = useCallback(
    (loading: boolean) => setState((prevState) => ({ ...prevState, loading })),
    []
  );
  const reloadSubject = useSubject(upperReloadSubject);
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
        const currentSkip = initial ? 0 : state.skip;
        const items = await handler(state.search, currentSkip);
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
            skip: currentSkip + skipStep,
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
  useChange(() => {
    handleDataRequest(true);
  }, [state.search]);
  useEffect(
    reloadSubject.subscribe(() => {
      handleDataRequest(true);
    }),
    [reloadSubject]
  );
  const stateContext = useMemo(
    () => ({
      state,
      action: {
        setSearch: (search: string) =>
          setState((prevState) => ({
            ...prevState,
            selectedIds: new Set(),
            skip: 0,
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
        setMenuOpened: (menuOpened: boolean) =>
          setState((prevState) => ({
            ...prevState,
            menuOpened,
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
            {!noSearch && (
              <Search disabled={state.loading} />
            )}
            {!!operations?.length && (
              <Operations disabled={state.loading} items={state.items} />
            )}
            <VirtualView
              className={classes.content}
              loading={state.loading}
              hasMore={state.hasMore}
              onDataRequest={handleDataRequest}
              scrollXSubject={scrollXSubject}
              scrollYSubject={scrollYSubject}
            >
              {!state.items.length && (
                <Typography className={classes.placeholder}>
                  {state.loading ? "Loading" : "Nothing found"}
                </Typography>
              )}
              {state.items.map((item, idx) => (
                <CardItem key={`${item.id}-${idx}`} item={item} />
              ))}
            </VirtualView>
          </Box>
        </Box>
      </StateContextProvider>
    </PropsContextProvider>
  );
};

export default CardView;
