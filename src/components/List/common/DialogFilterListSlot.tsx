import * as React from "react";
import { useMemo } from "react";

import { makeStyles } from "../../../styles";
import { alpha } from "@mui/material/styles";

import classNames from "../../../utils/classNames";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";

import Search from "@mui/icons-material/Search";
import Close from "@mui/icons-material/Close";

import useActionModal from "../../ActionModal";
import usePayload from "../hooks/usePayload";
import useProps from "../hooks/useProps";

import { IFilterListSlot } from "../slots/FilterListSlot";

import Badge from "@mui/material/Badge";
import Button from "@mui/material/Button";

import FilterListIcon from "@mui/icons-material/FilterList";

/**
 * useStyles is a function that returns the styles for a component using the makeStyles hook from the Material-UI library.
 *
 * @returns - An object containing the CSS styles for the component.
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
    marginRight: "5px",
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
 * DialogFilterListSlot represents a reusable component for displaying and managing a list of filters in a dialog.
 *
 * @template FilterData - The type of the filter data.
 *
 * @param props - The props for the component.
 * @param props.className - The class name for the component.
 * @param props.style - The inline style for the component.
 * @param props.filterData - The filter data.
 * @param props.filters - The list of filters.
 * @param props.change - The function to call when the filters are changed.
 * @param props.label - The label for the filter list.
 * @param props.loading - Indicates if the filter list is currently loading.
 * @param props.withSearch - Indicates if a search input should be displayed.
 * @param props.withToggledFilters - Indicates if the filters should be toggled.
 * @param props.search - The search value.
 * @param props.onSearchChange - The function to call when the search value is changed.
 * @param props.onFilterChange - The function to call when a filter is changed.
 *
 * @returns - The rendered component.
 */
export const DialogFilterListSlot = <FilterData extends {}>({
  className,
  style,
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
}: IFilterListSlot) => {
  const payload = usePayload();

  const {
    filterLabel,
  } = useProps();

  const { render, pickData: pickFilters } = useActionModal({
    AfterTitle: ({
      onClose,
    }) => (
      <IconButton
        size="small"
        onClick={onClose}
      >
        <Close />
      </IconButton>
    ),
    outlinePaper: true,
    handler: filterData,
    title: filterLabel,
    payload,
    fields: filters,
    onSubmit: (data) => {
      if (data) {
        handleChange(data);
      }
      return true;
    },
    readonly: loading,
  });

  const { classes } = useStyles();

  /**
   * Handles the change event for a filter.
   *
   * @param data - The data for the filter.
   */
  const handleChange = (data: FilterData) => {
    onFilterChange(data);
    change(data);
  };

  /**
   * Clean up search input and trigger search change event.
   *
   * @function handleSearchCleanup
   * @returns
   */
  const handleSearchCleanup = () => {
    onSearchChange("");
  };

  /**
   * Renders a label based on the value of `withSearch` variable.
   *
   * If `withSearch` is true, it renders a TextField component with search functionality.
   * If `withSearch` is false, it renders a Typography component with the provided label.
   *
   * @returns - The rendered label.
   */
  const renderLabel = () => {
    if (withSearch) {
      return (
        <TextField
          label="Search"
          variant="standard"
          value={search}
          onChange={({ target }) => onSearchChange(target.value)}
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

  /**
   * useMemo hook that calculates the count of non-null, non-empty, and non-false values in the filterData object.
   *
   * @function
   * @name filtersCount
   * @returns - The count of valid filters.
   * @param filterData - The object containing filter data.
   * @returns - The count of valid filters.
   */
  const filtersCount = useMemo(() => {
    const keys = Object.keys(filterData || {});
    let counter = 0;
    for (const key of keys) {
      if (filterData[key] === null) {
        continue
      } 
      if (filterData[key] === "") {
        continue
      }
      if (filterData[key] === false) {
        continue
      }
      counter++;
    }
    return counter;
  }, [filterData]);

  return (
    <div className={classNames(className, classes.root)} style={style}>
      <div className={classes.container}>
        <Box className={classes.labelContent}>{renderLabel()}</Box>
      </div>
      <div
        className={classNames(classes.controls, {
          [classes.controlsWidth]: !withToggledFilters,
        })}
      >
        <Badge sx={{ mr: 1 }} badgeContent={filtersCount} color="info">
          <Button
            startIcon={<FilterListIcon />}
            variant="contained"
            sx={{ fontWeight: "bold", ml: 1 }}
            disabled={loading}
            onClick={pickFilters}
          >
            Filters
          </Button>
        </Badge>
      </div>
      {render()}
    </div>
  );
};

export default DialogFilterListSlot;
