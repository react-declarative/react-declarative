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
 * Custom hook for generating styles using the makeStyles function from Material-UI.
 *
 * @return {object} The generated styles object.
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
 * ModalFilterListSlot is a component that displays a filter list with a modal.
 *
 * @typedef FilterData - The type of filter data.
 * @property className - The class name for the component.
 * @property style - The inline style for the component.
 * @property filterData - The filter data object.
 * @property filters - The array of filters for the modal.
 * @property change - The function to handle filter change event.
 * @property label - The label for the filter list.
 * @property loading - The loading state of the component.
 * @property withSearch - Whether to show the search input or not.
 * @property withToggledFilters - Whether to show the filter button or not.
 * @property search - The search query for the search input.
 * @property onSearchChange - The function to handle search change event.
 * @property onFilterChange - The function to handle filter change event.
 */
export const ModalFilterListSlot = <FilterData extends {}>({
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

  const { filterLabel, readTransform, writeTransform, modalSizeRequest } = useProps();

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
    sizeRequest: modalSizeRequest,
    fullScreen: true,
    outlinePaper: true,
    handler: filterData,
    title: filterLabel,
    readTransform,
    writeTransform,
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
   * Handles a change event for the filter data.
   *
   * @param data - The filter data to handle.
   * @returns
   */
  const handleChange = (data: FilterData) => {
    onFilterChange(data);
    change(data);
  };

  /**
   * Cleans up the search input by calling the onSearchChange function with an empty string.
   *
   * @function handleSearchCleanup
   */
  const handleSearchCleanup = () => {
    onSearchChange("");
  };

  /**
   * Calculates the count of non-null, non-empty, and non-false values in the filterData object.
   *
   * @function
   * @name filtersCount
   * @returns The count of non-null, non-empty, and non-false values in the filterData object.
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

  /**
   * Render the label based on the provided configuration.
   * @returns The rendered label JSX element.
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
        <Badge sx={{ mr: 1, zIndex: 99 }} badgeContent={filtersCount} color="info">
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

export default ModalFilterListSlot;
