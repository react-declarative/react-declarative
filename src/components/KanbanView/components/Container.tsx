import * as React from "react";
import { useEffect } from "react";

import { makeStyles } from "../../../styles";

import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";

import LoaderView from "../../LoaderView";
import Header, { IHeaderProps } from "./Header";
import Content, { IContentProps } from "./Content";

import useAsyncValue from "../../../hooks/useAsyncValue";

import IAnything from "../../../model/IAnything";
import TSubject from "../../../model/TSubject";
import IBoardRow from "../model/IBoardRow";

import useFetchRows from "../hooks/useFetchRows";
import useReloadTrigger from "../../../hooks/useReloadTrigger";

/**
 * Represents the properties for the `Container` component.
 */
export interface IContainerProps
  extends IHeaderProps,
    Omit<IContentProps, "rows"> {
  reloadSubject: TSubject<void>;
  rows: IBoardRow[];
  AfterCardContent?: React.ComponentType<{
    id: string;
    data: IAnything;
    payload: IAnything;
  }>;
  onLoadStart?: () => void;
  onLoadEnd?: (isOk: boolean) => void;
  fallback?: (e: Error) => void;
  throwError?: boolean;
}

const LOADER_SIZE = 48;

const useStyles = makeStyles()((theme) => ({
  container: {
    position: "relative",
    display: "flex",
    alignItems: "stretch",
    justifyContent: "stretch",
    flex: 1,
  },
  content: {
    display: "flex",
    alignItems: "stretch",
    justifyContent: "stretch",
    flexDirection: "column",
    overflow: "hidden",
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
    maxWidth: 255,
    flex: 1,
  },
}));

/**
 * @typedef {Object} IContainerProps
 * @property id - The ID of the container.
 * @property column - The current column of the container.
 * @property label - The label of the container.
 * @property columns - The columns of the container.
 * @property reloadSubject - The subject for triggering reload.
 * @property rows - The initial rows of the container.
 * @property withGoBack - Flag indicating whether to show a "Go Back" button.
 * @property withHeaderTooltip - Flag indicating whether to show a tooltip on the header.
 * @property data - The data for fetching rows.
 * @property fallback - The fallback view to be displayed while loading rows.
 * @property onLoadEnd - The callback function called when loading ends.
 * @property onLoadStart - The callback function called before loading starts.
 * @property throwError - The callback function called when an error occurs during loading.
 * @property disabled - Flag indicating whether the container is disabled.
 * @property onChangeColumn - The callback function called when the column is changed.
 * @property onCardLabelClick - The callback function called when the card label is clicked.
 * @property payload - The payload for rendering components.
 * @property AfterCardContent - The component to be rendered after the content.
 */
export const Container = ({
  id,
  column,
  label,
  columns,
  reloadSubject,
  rows: upperRows,
  withGoBack,
  withHeaderTooltip,
  data,
  fallback,
  onLoadEnd,
  onLoadStart,
  throwError,
  disabled,
  onChangeColumn,
  onCardLabelClick,
  payload,
  AfterCardContent,
}: IContainerProps) => {
  const { classes } = useStyles();

  const { reloadTrigger, doReload } = useReloadTrigger();

  const fetchRows = useFetchRows();

  /**
   * Represents the number of rows in a data set or table.
   *
   * @typedef {number} Rows
   */
  const [rows] = useAsyncValue(
    async () => {
      return await fetchRows(id, data, upperRows);
    },
    {
      onLoadStart,
      onLoadEnd,
      fallback,
      throwError,
      deps: [data, column, reloadTrigger],
    }
  );

  useEffect(() => reloadSubject.subscribe(doReload), []);

  /**
   * Render the inner content of a component.
   *
   * @return The rendered inner content.
   */
  const renderInner = () => {
    if (!rows) {
      return <LoaderView sx={{ flex: 1 }} size={LOADER_SIZE} />;
    }
    return (
      <>
        <Header
          reloadSubject={reloadSubject}
          withGoBack={withGoBack}
          withHeaderTooltip={withHeaderTooltip}
          id={id}
          column={column}
          data={data}
          columns={columns}
          disabled={disabled}
          onChangeColumn={onChangeColumn}
          onCardLabelClick={onCardLabelClick}
          onLoadStart={onLoadStart}
          onLoadEnd={onLoadEnd}
          fallback={fallback}
          throwError={throwError}
          payload={payload}
          label={label}
        />
        <Content id={id} payload={payload} rows={rows} data={data} />
        {AfterCardContent && (
          <AfterCardContent id={id} data={data} payload={payload} />
        )}
      </>
    );
  };

  return (
    <Paper className={classes.container}>
      <Box className={classes.content}>{renderInner()}</Box>
    </Paper>
  );
};

export default Container;
