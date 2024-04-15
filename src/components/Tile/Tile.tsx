import * as React from "react";

import { makeStyles } from "../../styles";

import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import VirtualView from "../VirtualView";

import TileItem from "./components/TileItem";

import { SelectionProvider } from "./hooks/useSelection";
import { RowMarkProvider } from "./hooks/useRowMark";

import IAnything from "../../model/IAnything";
import ITileProps from "./model/ITileProps";
import useSingleton from "../../hooks/useSingleton";

const DEFAULT_MIN_HEIGHT = 72;
const DEFAULT_BUFFER_SIZE = 25;

/**
 * A helper function to define and create CSS styles using the makeStyles API from Material-UI.
 * @returns - An object containing CSS classes.
 */
const useStyles = makeStyles()({
  noData: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "12px",
  },
});

/**
 * Tile component for displaying a list of items in a virtual view.
 *
 * @template Data - The type of data in each tile item.
 * @template Payload - The type of additional payload data.
 * @param props - The props for the Tile component.
 * @param [props.className] - The CSS class name for the Tile component.
 * @param [props.style] - The inline style for the Tile component.
 * @param [props.sx] - The sx prop for the Tile component (System UI).
 * @param props.data - The array of data items to be rendered.
 * @param props.loading - Indicates if the tile list is currently loading data.
 * @param props.hasMore - Indicates if there are more items to load.
 * @param [props.bufferSize=10] - The number of items to render outside the visible area.
 * @param [props.minRowHeight=48] - The minimum height of each row item.
 * @param [props.payload={}] - Additional payload data to be passed to the TileItem component.
 * @param [props.rowColor=() => 'inherit'] - A function that returns the background color for each row item.
 * @param [props.rowKey="id"] - The key to use for identifying each row item.
 * @param [props.errorMessage] - The error message to display if there was an error loading data.
 * @param [props.children] - The child elements to be rendered within each TileItem component.
 * @param [props.onSkip] - A callback function to handle skipping to the next page of data.
 * @param [props.onButtonSkip] - A callback function to handle skipping to the next page of data when a button is clicked.
 * @param [props.onItemClick] - A callback function to handle when a row item is clicked.
 * @param [props.onSelectedRows] - A callback function to handle when a row item is selected.
 * @param [props.selectedRows] - The array of data items that are currently selected.
 * @param [props.selectionMode] - The selection mode for the Tile component (e.g., "single", "multiple").
 * @param [props.recomputeSubject] - The subject(s) to trigger recomputation of row heights.
 * @param [props.rowMark] - The key to use for identifying each row mark.
 * @returns The Tile component.
 */
export const Tile = <Data extends IAnything = IAnything, Payload = IAnything>({
  className,
  style,
  sx,
  data,
  loading,
  hasMore,
  bufferSize = DEFAULT_BUFFER_SIZE,
  minRowHeight = DEFAULT_MIN_HEIGHT,
  payload: upperPayload = {} as Payload,
  rowColor = () => 'inherit',
  rowKey = "id",
  errorMessage,
  children,
  onSkip,
  onButtonSkip,
  onItemClick,
  onSelectedRows,
  selectedRows,
  selectionMode,
  recomputeSubject,
  scrollXSubject,
  scrollYSubject,
  rowMark,
}: ITileProps<Data, Payload>) => {
  const { classes } = useStyles();

  const payload = useSingleton(upperPayload);

  return (
    <SelectionProvider
      onSelectedRows={onSelectedRows}
      selectedRows={selectedRows}
    >
      <RowMarkProvider
        recomputeSubject={recomputeSubject}
        rowKey={rowKey}
        rowMark={rowMark}
      >
        <VirtualView
          withScrollbar
          component={List}
          className={className}
          style={style}
          sx={sx}
          scrollYSubject={scrollYSubject}
          scrollXSubject={scrollXSubject}
          minRowHeight={minRowHeight}
          bufferSize={bufferSize}
          loading={loading}
          hasMore={hasMore}
          onDataRequest={(initial) => {
            if (onSkip && hasMore) {
              onSkip(initial);
            }
          }}
        >
          {!loading && !errorMessage && data.length === 0 && (
            <Box className={classes.noData}>
              <Typography variant="body1">No data</Typography>
            </Box>
          )}
          {errorMessage && (
            <Box className={classes.noData}>
              <Typography color="error" variant="body1">
                {errorMessage}
              </Typography>
            </Box>
          )}
          {data.map((item, idx) => (
            <TileItem
              key={item[rowKey] || idx}
              rowColor={rowColor(item)}
              index={idx}
              payload={payload}
              data={item}
              rowKey={rowKey}
              selectionMode={selectionMode}
              onItemClick={onItemClick}
            >
              {children}
            </TileItem>
          ))}
          {data.length > 0 &&
            !errorMessage &&
            onButtonSkip &&
            !onSkip &&
            !loading &&
            hasMore && (
              <Box className={classes.noData}>
                <Button variant="outlined" onClick={onButtonSkip}>
                  Show More
                </Button>
              </Box>
            )}
        </VirtualView>
      </RowMarkProvider>
    </SelectionProvider>
  );
};

export default Tile;
