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
 * @property {string} id - The ID of the container.
 * @property {string} column - The current column of the container.
 * @property {string} label - The label of the container.
 * @property {Array<string>} columns - The columns of the container.
 * @property {Subject} reloadSubject - The subject for triggering reload.
 * @property {Array<string>} rows - The initial rows of the container.
 * @property {boolean} withGoBack - Flag indicating whether to show a "Go Back" button.
 * @property {boolean} withHeaderTooltip - Flag indicating whether to show a tooltip on the header.
 * @property {any} data - The data for fetching rows.
 * @property {React.ReactElement} fallback - The fallback view to be displayed while loading rows.
 * @property {Function} onLoadEnd - The callback function called when loading ends.
 * @property {Function} onLoadStart - The callback function called before loading starts.
 * @property {Function} throwError - The callback function called when an error occurs during loading.
 * @property {boolean} disabled - Flag indicating whether the container is disabled.
 * @property {Function} onChangeColumn - The callback function called when the column is changed.
 * @property {Function} onCardLabelClick - The callback function called when the card label is clicked.
 * @property {any} payload - The payload for rendering components.
 * @property {React.ReactElement} AfterCardContent - The component to be rendered after the content.
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
