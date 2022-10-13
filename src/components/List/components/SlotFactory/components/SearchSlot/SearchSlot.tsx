import * as React from 'react';
import { useState, useEffect, useRef } from 'react';

import { makeStyles } from "../../../../../../styles";
import { alpha } from '@mui/material/styles';

import classNames from '../../../../../../utils/classNames';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';

import Restore from '@mui/icons-material/Restore';
import Search from '@mui/icons-material/Search';
import Close from '@mui/icons-material/Close';

import { ISearchSlot } from '../../../../slots/SearchSlot';

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
    minWidth: 75,
    marginRight: 5,
    flexDirection: 'row-reverse',
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
}));

export const SearchSlot = ({
  className,
  style,
  label,
  loading,
  clean,
  search: upperSearch,
  onSearchChange = () => null,
}: ISearchSlot) => {

  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchEscapeRef = useRef(false);

  const { classes } = useStyles();

  const [search, setSearch] = useState(upperSearch);

  useEffect(() => {
    setSearch(upperSearch);
  }, [upperSearch]);

  useEffect(() => {
    if (searchEscapeRef.current) {
      searchEscapeRef.current = false;
      searchInputRef.current?.blur();
    }
  }, [search]);

  const handleSearchEscape = () => {
    setSearch(upperSearch);
    searchEscapeRef.current = true;
  };

  const handleSearchCleanup = () => {
    setSearch("");
    searchEscapeRef.current = true;
  };

  return (
    <div className={classNames(className, classes.root)} style={style}>
      <div className={classes.container}>
        <Box className={classes.labelContent}>
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
        </Box>
      </div>
      <div className={classes.controls}>
        <IconButton disabled={loading} onClick={clean}>
          <Restore />
        </IconButton>
      </div>
    </div>
  );
};

export default SearchSlot;
