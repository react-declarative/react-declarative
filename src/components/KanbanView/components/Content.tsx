import * as React from "react";
import { useCallback } from "react";

import { alpha } from "@mui/material";

import { makeStyles } from "../../../styles";

import LoaderView from "../../LoaderView";
import Async from "../../Async";

import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import IBoardRow from "../model/IBoardRow";
import IAnything from "../../../model/IAnything";

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
  payload: IAnything;
  rows: IBoardRow[];
}

export const Content = ({ id, payload, rows }: IContentProps) => {
  const { classes } = useStyles();

  const renderCell = useCallback(({ value, click }: IBoardRow) => {
    if (click) {
      return (
        <Async Loader={Loader}>
          {async () => {
            return (
              <Typography
                className={classes.link}
                onClick={() => click(id, payload)}
              >
                {await value(id, payload)}
              </Typography>
            );
          }}
        </Async>
      );
    }
    return (
      <Async Loader={Loader}>
        {async () => {
          const label = await value(id, payload);
          return (
            <Tooltip title={label}>
              <Typography className={classes.bold}>{label}</Typography>
            </Tooltip>
          );
        }}
      </Async>
    );
  }, []);

  return (
    <Box className={classes.table}>
      {rows.map((row) => (
        <>
          <Typography paddingRight="20px" variant="body2">
            {row.label}
          </Typography>
          {renderCell(row)}
        </>
      ))}
    </Box>
  );
};

export default Content;
