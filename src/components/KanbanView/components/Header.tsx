import * as React from "react";
import { useMemo, useState, useCallback } from "react";

import { makeStyles } from "../../../styles";

import LoaderView from "../../LoaderView";

import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import Menu from "@mui/material/Menu";
import Chip from "@mui/material/Chip";

import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";

import useAsyncValue from "../../../hooks/useAsyncValue";
import useFetchLabel from "../hooks/useFetchLabel";

import IAnything from "../../../model/IAnything";
import IBoardItem from "../model/IBoardItem";

export interface IHeaderProps<ColumnType = any> {
  id: string;
  label: IBoardItem['label'];
  withGoBack: boolean;
  withHeaderTooltip: boolean;
  payload: IAnything;
  data: IAnything;
  disabled: boolean;
  column: ColumnType;
  columns: ColumnType[];
  onLoadStart?: () => void;
  onLoadEnd?: (isOk: boolean) => void;
  fallback?: (e: Error) => void;
  throwError?: boolean;
  onChangeColumn: (
    id: string,
    column: any,
    data: IAnything,
    payload: IAnything
  ) => void | Promise<void>;
  onCardLabelClick?: (id: string, data: IAnything, payload: IAnything) => void;
}

const Loader = LoaderView.createLoader(12);

const useStyles = makeStyles()((theme) => ({
  header: {
    display: "flex",
    alignItems: "stretch",
    justifyContent: "stretch",
    flexDirection: "column",
    paddingLeft: theme.spacing(0.5),
    paddingRight: theme.spacing(0.5),
  },
  row: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  chip: {
    maxWidth: 150,
  },
}));

export const Header = ({
  id,
  payload,
  column,
  columns,
  data,
  disabled,
  withGoBack,
  withHeaderTooltip,
  label: labelFn = column,
  onChangeColumn,
  onCardLabelClick,
  fallback,
  onLoadEnd,
  onLoadStart,
  throwError,
}: IHeaderProps) => {
  const { classes } = useStyles();

  const fetchLabel = useFetchLabel();

  const label = useAsyncValue(async () => {
    return await fetchLabel(id, async () => {
      if (typeof labelFn === "function") {
        return await labelFn(id, data, payload);
      }
      return labelFn;
    });
  }, {
    onLoadStart,
    onLoadEnd,
    fallback,
    throwError,
    deps: [
      data,
    ],
  });

  const [beforeAnchorEl, setBeforeAnchorEl] =
    useState<HTMLButtonElement | null>(null);
  const [afterAnchorEl, setAfterAnchorEl] = useState<HTMLButtonElement | null>(
    null
  );

  const beforeCurrentColumn = useMemo(() => {
    const currentColumnIdx = columns.findIndex((value) => value === column);
    return columns.filter((_, idx) => idx < currentColumnIdx).reverse();
  }, [column]);

  const afterCurrentColumn = useMemo(() => {
    const currentColumnIdx = columns.findIndex((value) => value === column);
    return columns.filter((_, idx) => idx > currentColumnIdx);
  }, [column]);

  const renderTooltip = useCallback(() => {
    if (!label) {
      return <Loader />;
    }
    if (withHeaderTooltip) {
      return (
        <Tooltip title={label}>
          <Chip
            className={classes.chip}
            color="primary"
            onClick={
              onCardLabelClick
                ? () => onCardLabelClick(id, data, payload)
                : undefined
            }
            label={label}
          />
        </Tooltip>
      );
    }
    return (
      <Chip
        className={classes.chip}
        color="primary"
        onClick={
          onCardLabelClick
            ? () => onCardLabelClick(id, data, payload)
            : undefined
        }
        label={label}
      />
    );
  }, [label]);

  return (
    <Box className={classes.header}>
      <Box className={classes.row}>
        <IconButton
          onClick={({ currentTarget }) => {
            setBeforeAnchorEl(currentTarget);
            setAfterAnchorEl(null);
          }}
          disabled={!withGoBack || !beforeCurrentColumn.length || disabled}
          size="small"
        >
          <KeyboardArrowLeft />
        </IconButton>
        <Menu
          anchorEl={beforeAnchorEl}
          open={!!beforeAnchorEl}
          onClose={() => setBeforeAnchorEl(null)}
        >
          {beforeCurrentColumn.map((column, idx) => (
            <MenuItem
              key={`${column}-${idx}`}
              onClick={() => {
                onChangeColumn(id, column, data, payload);
                setBeforeAnchorEl(null);
              }}
            >
              {column}
            </MenuItem>
          ))}
        </Menu>
        {renderTooltip()}
        <IconButton
          onClick={({ currentTarget }) => {
            setBeforeAnchorEl(null);
            setAfterAnchorEl(currentTarget);
          }}
          disabled={!afterCurrentColumn.length || disabled}
          size="small"
        >
          <KeyboardArrowRight />
        </IconButton>
        <Menu
          anchorEl={afterAnchorEl}
          open={!!afterAnchorEl}
          onClose={() => setAfterAnchorEl(null)}
        >
          {afterCurrentColumn.map((column, idx) => (
            <MenuItem
              key={`${column}-${idx}`}
              onClick={() => {
                onChangeColumn(id, column, data, payload);
                setAfterAnchorEl(null);
              }}
            >
              {column}
            </MenuItem>
          ))}
        </Menu>
      </Box>
    </Box>
  );
};

export default Header;
