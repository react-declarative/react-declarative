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

const useStyles = makeStyles()({
  noData: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "12px",
  },
});

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
