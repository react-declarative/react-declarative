import * as React from "react";
import { useCallback } from "react";

import { alpha } from "@mui/material";

import { makeStyles } from "../../../styles";

import { usePreventAction } from "../../ActionButton";
import LoaderView from "../../LoaderView";
import Async from "../../Async";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import IBoardRow from "../model/IBoardRow";
import IAnything from "../../../model/IAnything";

import classNames from "../../../utils/classNames";

const Loader = LoaderView.createLoader(12);

const useStyles = makeStyles()((theme) => ({
  table: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    "& > *": {
      display: "flex",
      alignItems: "center",
      justifyContent: "stretch",
      whiteSpace: "nowrap",
      padding: 5,
      borderBottom: `1px solid ${alpha(
        theme.palette.getContrastText(theme.palette.background.default),
        0.23
      )}`,
      "& > *": {
        flex: 1,
      },
      maxWidth: "130px",
      overflow: "hidden",
    },
  },
  row: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  noBorder: {
    border: "none !important",
  },
  bold: {
    fontWeight: "bold !important",
    "& > *": {
      pointerEvents: "none",
    },
  },
  link: {
    color: theme.palette.primary.main,
    cursor: "pointer",
    textDecoration: "underline",
    "& > *": {
      pointerEvents: "none",
    },
  },
}));

export interface IContentProps {
  id: string;
  data: IAnything;
  payload: IAnything;
  rows: IBoardRow[];
  onLoadStart?: () => void;
  onLoadEnd?: (isOk: boolean) => void;
  fallback?: (e: Error) => void;
  throwError?: boolean;
}

export const Content = ({
  id,
  data,
  payload,
  rows,
  onLoadStart,
  onLoadEnd,
  fallback,
  throwError,
}: IContentProps) => {
  const { classes } = useStyles();

  const { loading, handleLoadStart, handleLoadEnd } = usePreventAction({
    onLoadStart,
    onLoadEnd,
  });

  const renderCell = useCallback(
    ({ value, click }: IBoardRow, className: string) => {
      if (click) {
        return (
          <Async
            Loader={Loader}
            onLoadStart={handleLoadStart}
            onLoadEnd={handleLoadEnd}
            loading={loading}
            fallback={fallback}
            throwError={throwError}
          >
            {async () => {
              return (
                <Typography
                  className={classNames(classes.link, className)}
                  onClick={() => click(id, data, payload)}
                >
                  {typeof value === "function"
                    ? await value(id, data, payload)
                    : value}
                </Typography>
              );
            }}
          </Async>
        );
      }
      return (
        <Async
          Loader={Loader}
          onLoadStart={handleLoadStart}
          onLoadEnd={handleLoadEnd}
          loading={loading}
          fallback={fallback}
          throwError={throwError}
        >
          {async () => {
            const label =
              typeof value === "function"
                ? await value(id, data, payload)
                : value;
            return (
              <Typography className={classNames(classes.bold, className)}>
                {label}
              </Typography>
            );
          }}
        </Async>
      );
    },
    []
  );

  return (
    <Box className={classes.table}>
      {rows.map((row, idx) => {
        const className = classNames({
          [classes.noBorder]: idx === rows.length - 1,
        });
        return (
          <>
            <Typography
              className={className}
              paddingRight="20px"
              variant="body2"
            >
              {row.label}
            </Typography>
            {renderCell(row, className)}
          </>
        );
      })}
    </Box>
  );
};

export default Content;
