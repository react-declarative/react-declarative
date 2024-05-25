import * as React from "react";
import { useState, useEffect, useCallback, useRef } from "react";

import { makeStyles } from "../../../styles";
import { alpha } from "@mui/material/styles";

import classNames from "../../../utils/classNames";

import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";

import More from "@mui/icons-material/ExpandMore";
import Less from "@mui/icons-material/ExpandLess";
import Search from "@mui/icons-material/Search";
import Close from "@mui/icons-material/Close";

import useManagedCursor from "../../../hooks/useManagedCursor";
import usePayload from "../hooks/usePayload";
import useProps from "../hooks/useProps";

import { IFilterListSlot } from "../slots/FilterListSlot";

import One from "../../One";

/**
 * Returns the styles for the useStyles variable.
 *
 * @function
 * @name useStyles
 * @returns The styles for the component.
 */
const useStyles = makeStyles()((theme) => ({
  root: {
    display: "flex",
    alignItems: "stretch",
    justifyContent: "stretch",
    background: alpha(
      theme.palette.getContrastText(theme.palette.background.paper),
      0.05
    ),
  },
  container: {
    flex: 1,
    minHeight: 60,
    maxHeight: "50vh",
    overflow: "hidden",
    overflowY: "auto",
  },
  controls: {
    display: "flex",
    alignItems: "center",
  },
  controlsWidth: {
    minWidth: 75,
    marginRight: 5,
    flexDirection: "row-reverse",
  },
  title: {
    display: "flex",
    alignItems: "center",
  },
  disabled: {
    pointerEvents: "none",
    userSelect: "none",
    opacity: 0.5,
  },
  labelContent: {
    display: "flex",
    minHeight: "60px",
    "& > *:nth-of-type(1)": {
      flex: 1,
    },
    padding: theme.spacing(1),
  },
  filters: {
    padding: theme.spacing(1),
    overflowX: "hidden",
    overflowY: "auto",
  },
}));

/**
 * Represents a classic filter list slot component.
 *
 * @template FilterData - The data type of the filter.
 *
 * @param props - The props for the component.
 * @param props.className - The class name for the component.
 * @param props.style - The inline style for the component.
 * @param props.height - The height of the component.
 * @param props.filterData - The filter data for the component.
 * @param props.filters - The filters for the component.
 * @param props.change - The function to call when the filter changes.
 * @param props.label - The label for the component.
 * @param props.loading - Indicates if the component is loading.
 * @param props.withSearch - Indicates if the component has search functionality.
 * @param props.withToggledFilters - Indicates if the component has toggled filters.
 * @param props.search - The search query for the component.
 * @param props.onSearchChange - The function to call when the search query changes.
 * @param props.onFilterChange - The function to call when the filter changes.
 * @param props.onCollapsedChange - The function to call when the component's collapsed state changes.
 *
 * @returns The classic filter list slot component.
 */
export const ClassicFilterListSlot = <FilterData extends {}>({
  className,
  style,
  height,
  filterData,
  filters,
  change,
  label,
  loading,
  withSearch,
  withToggledFilters,
  search,
  onSearchChange = () => null,
  onFilterChange = () => null,
  onCollapsedChange = () => null,
}: IFilterListSlot<FilterData>) => {
  const payload = usePayload();
  const { features, readTransform, writeTransform } = useProps();

  const { classes } = useStyles();

  const [collapsed, setCollapsed] = useState(!!withToggledFilters);
  const [disabled, setDisabled] = useState(false);

  const isInitialized = useRef(false);

  const {
    inputRef,
    inputValue,
    onInputChange,
  } = useManagedCursor({
    value: search,
    onChange: onSearchChange,
  });

  /**
   * Function to handle collapse behavior
   *
   * @description This function toggles the value of 'collapsed' by calling the 'setCollapsed' function.
   *
   * @returns This function does not return any value.
   */
  const handleCollapse = () => setCollapsed(!collapsed);

  /**
   * Handles the change event for the given filter data.
   *
   * @param data - The filter data to handle.
   * @returns
   */
  const handleChange = (data: FilterData) => {
    onFilterChange(data);
    change(data);
  };

  useEffect(() => {
    if (isInitialized.current) {
      setDisabled(true);
      /* react transitioncancel hack */
      setTimeout(handleCollapseEnd, 1_000);
    }
  }, [collapsed]);

  useEffect(() => {
    isInitialized.current = true;
    return () => {
      isInitialized.current = false;
    };
  }, []);

  /**
   * Callback function for handling the end of collapse animation.
   * Triggers the provided `onCollapsedChange` function and sets a timeout to enable the component after 100 milliseconds
   * if the component is initialized.
   *
   * @callback handleCollapseEnd
   * @param collapsed - Indicates if the component is collapsed.
   */
  const handleCollapseEnd = useCallback(() => {
    if (isInitialized.current) {
      onCollapsedChange(collapsed);
      setTimeout(() => setDisabled(false), 100);
    }
  }, [collapsed]);

  /**
   * Cleans up the search by calling the onSearchChange function with an empty string.
   *
   * @function handleSearchCleanup
   * @returns
   */
  const handleSearchCleanup = () => {
    onSearchChange("");
  };

  /**
   * Renders the label component based on the value of 'withSearch' variable.
   * If 'withSearch' is true, it renders a TextField component with search functionality.
   * If 'withSearch' is false, it renders a Typography component with the label text.
   *
   * @returns The rendered label component.
   */
  const renderLabel = () => {
    if (withSearch) {
      return (
        <TextField
          label="Search"
          variant="standard"
          inputRef={inputRef}
          value={inputValue}
          onChange={onInputChange}
          onKeyDown={({ key, currentTarget }) => {
            if (key === "Enter" || key === "Escape") {
              currentTarget.blur();
            }
          }}
          className={classNames({
            [classes.disabled]: loading,
          })}
          sx={{
            maxWidth: "max(calc(50% - 75px), 256px)",
          }}
          InputProps={{
            readOnly: loading,
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
            endAdornment: !!search && (
              <InputAdornment
                sx={{ cursor: "pointer", marginBottom: "15px" }}
                onClick={handleSearchCleanup}
                position="end"
              >
                <Close />
              </InputAdornment>
            ),
          }}
          placeholder={label}
          InputLabelProps={{
            shrink: true,
          }}
          focused
        />
      );
    } else {
      return (
        <Typography variant="body1" className={classes.title}>
          {label}
        </Typography>
      );
    }
  };

  return (
    <div className={classNames(className, classes.root)} style={style}>
      <div className={classes.container}>
        <Collapse onTransitionEnd={handleCollapseEnd} in={collapsed}>
          <Box
            className={classNames(classes.filters, {
              [classes.disabled]: loading,
            })}
            sx={{
              maxHeight: Math.max(height / 2 - 150, 220),
            }}
          >
            <One<FilterData>
              features={features}
              readTransform={readTransform}
              writeTransform={writeTransform}
              handler={filterData}
              payload={payload}
              fields={filters}
              change={handleChange}
              readonly={loading}
            />
          </Box>
        </Collapse>
        <Collapse in={!collapsed}>
          <Box className={classes.labelContent}>{renderLabel()}</Box>
        </Collapse>
      </div>
      <div
        className={classNames(classes.controls, {
          [classes.controlsWidth]: !withToggledFilters,
        })}
      >
        {!withToggledFilters && (
          <IconButton disabled={disabled} onClick={handleCollapse}>
            {collapsed ? <Less /> : <More />}
          </IconButton>
        )}
      </div>
    </div>
  );
};

export default ClassicFilterListSlot;
