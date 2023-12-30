import * as React from "react";
import { useMemo, useState } from "react";

import { makeStyles } from "../../../styles";

import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import Menu from "@mui/material/Menu";
import Chip from "@mui/material/Chip";

import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";

import IAnything from "../../../model/IAnything";

export interface IHeaderProps {
  id: string;
  label: string;
  payload: IAnything;
  disabled: boolean;
  column: string;
  columns: string[];
  onChangeColumn: (
    id: string,
    column: string,
    payload: IAnything
  ) => Promise<void>;
  onCardLabelClick?: (id: string, payload: IAnything) => void;
}

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
}));

export const Header = ({
  id,
  payload,
  column,
  columns,
  disabled,
  label,
  onChangeColumn,
  onCardLabelClick,
}: IHeaderProps) => {
  const { classes } = useStyles();

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

  return (
    <Box className={classes.header}>
      <Box className={classes.row}>
        <IconButton
          onClick={({ currentTarget }) => {
            setBeforeAnchorEl(currentTarget);
            setAfterAnchorEl(null);
          }}
          disabled={!beforeCurrentColumn.length || disabled}
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
                onChangeColumn(id, column, payload);
                setBeforeAnchorEl(null);
              }}
            >
              {column}
            </MenuItem>
          ))}
        </Menu>
        <Tooltip title={label}>
          <Chip
            color="primary"
            onClick={
              onCardLabelClick ? () => onCardLabelClick(id, payload) : undefined
            }
            label={label}
          />
        </Tooltip>
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
                onChangeColumn(id, column, payload);
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
