import * as React from "react";
import { useCallback } from "react";

import { alpha } from "@mui/material";

import { makeStyles } from "../../../styles";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import IBoardRowInternal from "../model/IBoardRowInternal";
import IAnything from "../../../model/IAnything";

import classNames from "../../../utils/classNames";

const useStyles = makeStyles()((theme) => ({
  table: {
    display: "grid",
    gridTemplateColumns: "fit-content(130px) 1fr",
    maxWidth: "255px",
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
  },
  link: {
    color: theme.palette.primary.main,
    cursor: "pointer",
    textDecoration: "underline",
  },
}));

export interface IContentProps {
  id: string;
  data: IAnything;
  payload: IAnything;
  rows: IBoardRowInternal[];
}

export const Content = ({
  id,
  data,
  payload,
  rows,
}: IContentProps) => {
  const { classes } = useStyles();

  const renderCell = useCallback(
    ({ value, click }: IBoardRowInternal, className: string) => {
      if (click) {
        return (
          <Typography
            className={classNames(classes.link, className)}
            onClick={() => click(id, data, payload)}
          >
            {value}
          </Typography>
        );
      }
      return (
        <Typography className={classNames(classes.bold, className)}>
          {value}
        </Typography>
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
