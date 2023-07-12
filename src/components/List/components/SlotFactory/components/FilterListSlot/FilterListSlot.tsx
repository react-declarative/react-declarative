import * as React from 'react';
import { useState, useEffect, useLayoutEffect, useCallback, useRef } from 'react';

import { makeStyles } from "../../../../../../styles";
import { alpha } from '@mui/material/styles';

import classNames from '../../../../../../utils/classNames';

import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';

import Restore from '@mui/icons-material/Restore';
import More from '@mui/icons-material/ExpandMore';
import Less from '@mui/icons-material/ExpandLess';
import Search from '@mui/icons-material/Search';
import Close from '@mui/icons-material/Close';

import usePayload from '../../../../hooks/usePayload';

import { IFilterListSlot } from '../../../../slots/FilterListSlot';

import One from '../../../../../One';

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
    flexDirection: 'row-reverse',
  },
  title: {
    display: "flex",
    alignItems: "center",
  },
  disabled: {
    pointerEvents: 'none',
    userSelect: 'none',
    opacity: 0.5,
  },
  labelContent: {
    display: 'flex',
    minHeight: '60px',
    '& > *:nth-of-type(1)': {
      flex: 1,
    },
    padding: theme.spacing(1),
  },
  filters: {
    padding: theme.spacing(1),
    overflowX: 'hidden',
    overflowY: 'auto',
  },
}));

export const FilterListSlot = <FilterData extends {}>({
  className,
  style,
  height,
  filterData,
  filters,
  change,
  ready,
  clean,
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

  const searchInputRef = useRef<HTMLInputElement>(null);

  const { classes } = useStyles();

  const [collapsed, setCollapsed] = useState(!!withToggledFilters);
  const [disabled, setDisabled] = useState(false);

  const isInitialized = useRef(false);

  const handleCollapse = () => setCollapsed(!collapsed);

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

  useLayoutEffect(() => {
    const { current: input } = searchInputRef;
    if (!search && input) {
      input.value = "";
    }
  }, [search]);

  const handleCollapseEnd = useCallback(() => {
    if (isInitialized.current) {
      onCollapsedChange(collapsed);
      setTimeout(() => setDisabled(false), 100);
    }
  }, [collapsed]);

  const handleSearchCleanup = () => {
    onSearchChange("");
  };

  const renderLabel = () => {
    if (withSearch) {
      return (
        <TextField
          label="Search"
          variant="standard"
          inputRef={searchInputRef}
          onChange={({ target }) => onSearchChange(target.value)}
          onKeyDown={({ key, currentTarget }) => {
            if (key === 'Enter' || key === 'Escape') {
              currentTarget.blur();
            }
          }}
          className={classNames({
            [classes.disabled]: loading,
          })}
          InputProps={{
            readOnly: loading,
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
            endAdornment: !!search && (
              <InputAdornment sx={{ cursor: 'pointer', marginBottom: '15px' }} onClick={handleSearchCleanup} position="end">
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
        <Collapse
          onTransitionEnd={handleCollapseEnd}
          in={collapsed}
        >
          <Box
            className={classNames(classes.filters, {
              [classes.disabled]: loading,
            })}
            sx={{
              maxHeight: Math.max((height / 2) - 150, 220),
            }}
          >
            <One<FilterData>
              handler={filterData}
              payload={payload}
              fields={filters}
              change={handleChange}
              ready={ready}
              readonly={loading}
            />
          </Box>
        </Collapse>
        <Collapse in={!collapsed}>
          <Box className={classes.labelContent}>
            {renderLabel()}
          </Box>
        </Collapse>
      </div>
      <div className={classNames(classes.controls, {
        [classes.controlsWidth]: !withToggledFilters,
      })}>
        <IconButton disabled={loading} onClick={clean}>
          <Restore />
        </IconButton>
        {!withToggledFilters && (
          <IconButton disabled={disabled} onClick={handleCollapse}>
            {collapsed ? <Less /> : <More />}
          </IconButton>
        )}
      </div>
    </div>
  );
};

export default FilterListSlot;
