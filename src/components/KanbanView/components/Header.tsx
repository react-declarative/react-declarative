import * as React from "react";
import { useMemo, useState, useCallback, useEffect } from "react";

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

import useReloadTrigger from "../../../hooks/useReloadTrigger";
import useAsyncValue from "../../../hooks/useAsyncValue";
import useFetchLabel from "../hooks/useFetchLabel";

import IAnything from "../../../model/IAnything";
import IBoardColumn from "../model/IBoardColumn";
import IBoardItem from "../model/IBoardItem";
import TSubject from "../../../model/TSubject";

/**
 * Represents the properties for the Header component.
 */
export interface IHeaderProps<ColumnType = any> {
  id: string;
  reloadSubject: TSubject<void>;
  label: IBoardItem['label'];
  withGoBack: boolean;
  withHeaderTooltip: boolean;
  payload: IAnything;
  data: IAnything;
  disabled: boolean;
  column: ColumnType;
  columns: IBoardColumn[];
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

/**
 * Header component for displaying and navigating through columns.
 *
 * @param props - The props object containing the following properties:
 *   - id {string} - The id of the header.
 *   - payload {Object} - The payload object.
 *   - column {string} - The current column.
 *   - columns {Array} - The array of columns.
 *   - data {Array} - The data array.
 *   - disabled {boolean} - Indicates if the header is disabled.
 *   - reloadSubject {Subject} - The reload subject.
 *   - withGoBack {boolean} - Indicates if the go back button should be displayed.
 *   - withHeaderTooltip {boolean} - Indicates if the header tooltip should be displayed.
 *   - label {Function} - The label function or column name.
 *   - onChangeColumn {Function} - The function to call when a column is changed.
 *   - onCardLabelClick {Function} - The function to call when the card label is clicked.
 *   - fallback {ReactElement} - The fallback component to render.
 *   - onLoadEnd {Function} - The function to call when the async value loading ends.
 *   - onLoadStart {Function} - The function to call when the async value loading starts.
 *   - throwError {boolean} - Indicates if an error should be thrown.
 *
 * @returns The Header component.
 */
export const Header = ({
  id,
  payload,
  column,
  columns,
  data,
  disabled,
  reloadSubject,
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
  const { reloadTrigger, doReload } = useReloadTrigger();

  const [label] = useAsyncValue(async () => {
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
      column,
      reloadTrigger,
    ],
  });

  useEffect(() => reloadSubject.subscribe(doReload), []);

  const [beforeAnchorEl, setBeforeAnchorEl] =
    useState<HTMLButtonElement | null>(null);
  const [afterAnchorEl, setAfterAnchorEl] = useState<HTMLButtonElement | null>(
    null
  );

  /**
   * Retrieves the columns that appear before the current column.
   *
   * @function
   * @name beforeCurrentColumn
   * @returns {Array} - An array of columns before the current column.
   *
   * @param {string} column - The current column value.
   * @param {Array} columns - The array of columns.
   */
  const beforeCurrentColumn = useMemo(() => {
    const currentColumnIdx = columns.findIndex(({ column: value }) => value === column);
    return columns.filter((_, idx) => idx < currentColumnIdx).reverse();
  }, [column]);

  /**
   * Variable representing the columns after the current column.
   *
   * @type {Array}
   *
   * @description
   * This variable is a memoized value that contains all the columns in the `columns` array
   * that come after the current column. The current column is determined by matching the
   * value of the `column` property against the `value` property of each element in the
   * `columns` array.
   *
   * @returns {Array} The columns that come after the current column.
   */
  const afterCurrentColumn = useMemo(() => {
    const currentColumnIdx = columns.findIndex(({ column: value }) => value === column);
    return columns.filter((_, idx) => idx > currentColumnIdx);
  }, [column]);

  /**
   * Renders a tooltip with optional header based on the value of the `label` variable.
   * If `label` is `null`, it will render a loader.
   * If `withHeaderTooltip` is `true`, it will render a tooltip with a chip as the content.
   * If `withHeaderTooltip` is `false` or not provided, it will render just the chip.
   * The `onCardLabelClick` function can be provided to handle the click event on the chip.
   *
   * @returns {React.Element} - The rendered tooltip or chip.
   */
  const renderTooltip = useCallback(() => {
    if (label === null) {
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
                onChangeColumn(id, column.column, data, payload);
                setBeforeAnchorEl(null);
              }}
            >
              {column.label || column.column}
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
                onChangeColumn(id, column.column, data, payload);
                setAfterAnchorEl(null);
              }}
            >
              {column.label || column.column}
            </MenuItem>
          ))}
        </Menu>
      </Box>
    </Box>
  );
};

export default Header;
