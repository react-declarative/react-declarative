import * as React from "react";
import { useEffect } from "react";

import { makeStyles } from "../../../../../styles";

import Box from "@mui/material/Box";
import MatListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";

import NotInterested from "@mui/icons-material/NotInterested";

import IListProps, {
  IListState,
  IListCallbacks,
} from "../../../../../model/IListProps";
import IAnything from "../../../../../model/IAnything";
import IRowData from "../../../../../model/IRowData";

import useSubject from "../../../../../hooks/useSubject";
import useScrollManager from "../../../hooks/useScrollManager";
import useElementSize from "../../../../../hooks/useElementSize";
import useRenderWaiter from "../../../../../hooks/useRenderWaiter";
import useSinglerunAction from "../../../../../hooks/useSinglerunAction";
import useUpsertManager from "../../../hooks/useUpsertManager";

import ModalLoader from "./components/ModalLoader";
import ListItem from "./components/ListItem";

import Container from "../../Container";
import VirtualView from "../../../../VirtualView";

const DEFAULT_ITEM_SIZE = 75;

export const MOBILE_LIST_ROOT = "react-declarative__mobileListRoot";

/**
 * A function that returns an object with CSS styles for a component.
 *
 * @function
 * @name useStyles
 * @returns - An object containing CSS styles for a component.
 */
const useStyles = makeStyles()((theme) => ({
  root: {
    position: "relative",
  },
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    background: theme.palette.background.paper,
  },
  empty: {
    position: "absolute",
    zIndex: 999,
    top: 0,
    left: 0,
    right: 0,
  },
}));

/**
 * Interface for the Chooser component props
 *
 * @template FilterData - The type of filter data
 * @template RowData - The type of row data
 */
interface IChooserProps<
  FilterData extends {} = IAnything,
  RowData extends IRowData = IAnything
> extends Omit<
      IListProps<FilterData, RowData>,
      keyof {
        ref: never;
        limit: never;
        chips: never;
        search: never;
        filterData: never;
        isChooser: never;
        isInfinite: never;
        isCustom: never;
        payload: never;
      }
    >,
    IListState<FilterData, RowData>,
    IListCallbacks<FilterData, RowData> {
  className?: string;
  style?: React.CSSProperties;
  listChips: IListProps["chips"];
}

/**
 * Chooser component that displays a list of rows and allows filtering and pagination.
 *
 * @template FilterData - The type of filter data.
 * @template RowData - The type of row data.
 *
 * @param props - The props for the Chooser component.
 * @returns The rendered component.
 */
export const Chooser = <
  FilterData extends {} = IAnything,
  RowData extends IRowData = IAnything
>(
  props: IChooserProps<FilterData, RowData>
) => {
  const { classes } = useStyles();

  const scrollManager = useScrollManager();
  const scrollYSubject = useSubject<number>();

  const state = useUpsertManager({
    rows: props.rows,
    scrollYSubject,
  });

  useEffect(() => scrollManager.scrollYSubject.subscribe(() => {
    scrollYSubject.next(0);
  }), []);

  const {
    offset,
    limit,
    total,
    loading,
    withLoader = false,
  } = props;

  const { size: { width: dialogWidth } } = useElementSize({
    target: document.body,
    selector: '.MuiDialog-container > .MuiPaper-root'
  });

  const { elementRef, size: { height: rootHeight } } = useElementSize();

  const { handlePageChange } = props;

  const pendingPage = Math.floor(offset / limit) + 1;
  const hasMore = !total || pendingPage * limit < total;

  const waitForRequest = useRenderWaiter([loading]);

  /**
   * Handles a data request.
   *
   * @param request - The request object containing information about the data request.
   * @param callback - The callback function to be executed when the data request is handled.
   * @returns
   */
  const { execute: handleDataRequest } = useSinglerunAction(async (initial: boolean) => {
    if (initial) {
      return;
    }
    let isOk = true;
    isOk = isOk && hasMore;
    isOk = isOk && !loading;
    if (isOk) {
      handlePageChange(pendingPage);
      await waitForRequest();
    }
  });

  return (
    <Container<FilterData, RowData> {...props} {...state}>
      <Box ref={elementRef} className={classes.root}>
        <Box className={classes.container}>
          <Box position="relative" style={{ height: rootHeight, width: dialogWidth }}>
            <VirtualView
              scrollYSubject={scrollYSubject}
              minRowHeight={DEFAULT_ITEM_SIZE}
              onDataRequest={async (initial) => void await handleDataRequest(initial)}
              sx={{ height: rootHeight, width: dialogWidth }}
            >
              {!loading && state.rows.length === 0 && (
                <MatListItem className={classes.empty}>
                  <ListItemIcon>
                    <NotInterested />
                  </ListItemIcon>
                  <ListItemText primary="Empty" secondary="Nothing found" />
                </MatListItem>
              )}
              {state.rows.map((row, idx) => (
                <ListItem key={`${row.id}-${idx}`} row={row} />
              ))}
            </VirtualView>
            <ModalLoader open={withLoader && loading} />
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Chooser;
