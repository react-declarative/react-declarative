import * as React from 'react';
import { useState, useEffect, useCallback, useRef } from 'react';

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

import { IFilterListSlot } from '../../../../slots/FilterListSlot';
import IAnything from '../../../../../../model/IAnything';

import One from '../../../../../One';

const useStyles = makeStyles((theme) => ({
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
    minWidth: 80,
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
    '& > *:nth-child(1)': {
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

export const FilterListSlot = <FilterData extends IAnything>({
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
  toggleFilters,
  search: upperSearch,
  onSearchChange = () => null,
  onFilterChange = () => null,
  onCollapsedChange = () => null,
}: IFilterListSlot<FilterData>) => {

  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchEscapeRef = useRef(false);

  const classes = useStyles();

  const [collapsed, setCollapsed] = useState(!!toggleFilters);
  const [disabled, setDisabled] = useState(false);

  const [search, setSearch] = useState(upperSearch);

  const isInitialized = useRef(false);

  const handleCollapse = () => setCollapsed(!collapsed);

  const handleChange = (data: FilterData) => {
    onFilterChange(data);
    change(data);
  };

  useEffect(() => {
    setSearch(upperSearch);
  }, [upperSearch]);

  useEffect(() => {
    if (searchEscapeRef.current) {
      searchEscapeRef.current = false;
      searchInputRef.current?.blur();
    }
  }, [search]);

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

  const handleCollapseEnd = useCallback(() => {
    if (isInitialized.current) {
      onCollapsedChange(collapsed);
      setTimeout(() => setDisabled(false), 100);
    }
  }, [collapsed]);

  const handleSearchEscape = () => {
    setSearch(upperSearch);
    searchEscapeRef.current = true;
  };

  const renderLabel = () => {
    if (withSearch) {
      return (
        <TextField
          label="Search"
          variant="standard"
          value={search}
          inputRef={searchInputRef}
          onChange={({ target }) => setSearch(target.value)}
          onBlur={() => {
            if (search !== upperSearch) {
              onSearchChange(search)
            }
          }}
          onKeyDown={({ key }) => {
            if (key === 'Enter' && search !== upperSearch) {
              searchInputRef.current?.blur();
            } else if (key === 'Escape') {
              handleSearchEscape();
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
            )
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
        [classes.controlsWidth]: !toggleFilters,
      })}>
        <IconButton disabled={loading} onClick={clean}>
          <Restore />
        </IconButton>
        {!toggleFilters && (
          <IconButton disabled={disabled} onClick={handleCollapse}>
            {collapsed ? <Less /> : <More />}
          </IconButton>
        )}
      </div>
    </div>
  );
};

export default FilterListSlot;
