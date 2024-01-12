import * as React from "react";

import { makeStyles } from "../../../styles";

import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";

import LoaderView from "../../LoaderView";
import Header, { IHeaderProps } from "./Header";
import Content, { IContentProps } from "./Content";

import useAsyncValue from "../../../hooks/useAsyncValue";

import IAnything from "../../../model/IAnything";
import IBoardRow from "../model/IBoardRow";
import useFetchRows from "../hooks/useFetchRows";

export interface IContainerProps extends IHeaderProps, Omit<IContentProps, 'rows'> {
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

export const Container = ({
  id,
  column,
  label,
  columns,
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

  const fetchRows = useFetchRows();

  const rows = useAsyncValue(async () => {
    return await fetchRows(id, data, upperRows);
  }, {
    onLoadStart,
    onLoadEnd,
    fallback,
    throwError,
  });

  const renderInner = () => {
    if (!rows) {
      return <LoaderView sx={{ flex: 1 }} size={LOADER_SIZE} />;
    }
    return (
      <>
        <Header
          withGoBack={withGoBack}
          withHeaderTooltip={withHeaderTooltip}
          id={id}
          column={column}
          data={data}
          columns={columns}
          disabled={disabled}
          onChangeColumn={onChangeColumn}
          onCardLabelClick={onCardLabelClick}
          payload={payload}
          label={label}
        />
        <Content
          id={id}
          payload={payload}
          rows={rows}
          data={data}
        />
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
