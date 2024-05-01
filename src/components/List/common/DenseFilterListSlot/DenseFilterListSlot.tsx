import * as React from "react";
import { Fragment, useMemo } from "react";

import { makeStyles } from "../../../../styles";
import { alpha } from "@mui/material/styles";

import { IListAction } from "../../../../model/IListProps";
import { IFilterListSlot } from "../../slots/FilterListSlot";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";

import Fab from "@mui/material/Fab";
import Badge from "@mui/material/Badge";
import Button from "@mui/material/Button";

import ActionAdd from "../../components/common/ListActionAdd";
import ActionFab from "../../components/common/ListActionFab";
import ActionMenu from "../../components/common/ListActionMenu";

import usePayload from "../../hooks/usePayload";
import useProps from "../../hooks/useProps";
import useActionModal from "../../../ActionModal";
import useCachedRows from "../../hooks/useCachedRows";

import ActionType from "../../../../model/ActionType";

import FilterListIcon from "@mui/icons-material/FilterList";
import Search from "@mui/icons-material/Search";
import Close from "@mui/icons-material/Close";

const FILTER_SHRINK = 500;

const useStyles = makeStyles()((theme) => ({
  root: {
    display: "flex",
    alignItems: "stretch",
    justifyContent: "stretch",
    background: alpha(
      theme.palette.getContrastText(theme.palette.background.paper),
      0.05,
    ),
  },
  container: {
    flex: 1,
    minHeight: "45px",
    maxHeight: "50vh",
    overflow: "hidden",
    overflowY: "auto",
  },
  controls: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
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
    alignItems: "flex-end",
    minHeight: "45px",
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

export const DenseFilterListSlot = ({
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
  height,
  width,
  onSearchChange = () => null,
  onFilterChange = () => null,
}: IFilterListSlot) => {
  const payload = usePayload();

  const { selectedRows } = useCachedRows();

  const {
    filterLabel,
    readTransform,
    writeTransform,
    modalSizeRequest,
    actions = [],
  } = useProps();

  const { render, pickData: pickFilters } = useActionModal({
    AfterTitle: ({ onClose }) => (
      <IconButton size="small" onClick={onClose}>
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

  const { classes, cx: clsx } = useStyles();

  const handleChange = (data: Record<string, unknown>) => {
    onFilterChange(data);
    change(data);
  };

  const handleSearchCleanup = () => {
    onSearchChange("");
  };

  const filtersCount = useMemo(() => {
    const keys = Object.keys(filterData || {});
    let counter = 0;
    for (const key of keys) {
      if (filterData[key] === null) {
        continue;
      }
      if (filterData[key] === "") {
        continue;
      }
      if (filterData[key] === false) {
        continue;
      }
      counter++;
    }
    return counter;
  }, [filterData]);

  const createAction = ({
    type,
    options: upperOptions = [],
    isDisabled,
    isVisible,
    label,
    icon,
    action,
  }: IListAction) => {
    if (type === ActionType.Add) {
      return (
        <ActionAdd
          label={label}
          action={action}
          isDisabled={isDisabled}
          isVisible={isVisible}
          height={height}
          width={width}
        />
      );
    } else if (type === ActionType.Fab) {
      return (
        <ActionFab
          label={label}
          action={action}
          icon={icon}
          isDisabled={isDisabled}
          isVisible={isVisible}
          height={height}
          width={width}
        />
      );
    } else if (type === ActionType.Menu) {
      const options = upperOptions.map(
        ({ isDisabled = () => false, isVisible = () => true, ...other }) => ({
          ...other,
          isDisabled: () => isDisabled(selectedRows, payload),
          isVisible: () => isVisible(selectedRows, payload),
        }),
      );
      return <ActionMenu options={options} deps={[payload]} />;
    } else {
      throw new Error("List Actions unknown action type");
    }
  };

  const renderLabel = () => {
    if (withSearch) {
      return (
        <TextField
          variant="standard"
          value={search}
          onChange={({ target }) => onSearchChange(target.value)}
          onKeyDown={({ key, currentTarget }) => {
            if (key === "Enter" || key === "Escape") {
              currentTarget.blur();
            }
          }}
          className={clsx({
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
          placeholder={label || "Search"}
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

  const isShrink = width < FILTER_SHRINK;

  return (
    <div className={clsx(className, classes.root)} style={style}>
      <div className={classes.container}>
        <Box className={classes.labelContent}>{renderLabel()}</Box>
      </div>
      <div
        className={clsx(classes.controls, {
          [classes.controlsWidth]: !withToggledFilters,
        })}
      >
        <Badge badgeContent={filtersCount} color="info">
          {isShrink ? (
            <Fab
              sx={{ minHeight: "40px", maxHeight: "40px", zIndex: 99 }}
              disabled={loading}
              size="small"
              color="primary"
              onClick={pickFilters}
            >
              <FilterListIcon color="inherit" />
            </Fab>
          ) : (
            <Button
              startIcon={<FilterListIcon />}
              variant="contained"
              size="small"
              sx={{ minHeight: "35px", maxHeight: "35px", zIndex: 99 }}
              disabled={loading}
              onClick={pickFilters}
            >
              Filters
            </Button>
          )}
        </Badge>
        {actions.map((action, idx) => (
          <Fragment key={idx}>{createAction(action)}</Fragment>
        ))}
      </div>
      {render()}
    </div>
  );
};

export default DenseFilterListSlot;
