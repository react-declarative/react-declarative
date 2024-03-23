import * as React from 'react';

import { makeStyles } from "../../../../../../styles";
import { alpha } from '@mui/material/styles';

import classNames from '../../../../../../utils/classNames';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

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

/**
 * Represents a search input component with label, loading state, and search functionality.
 * @param props - The properties of the SearchSlot component.
 * @param props.className - The additional CSS class name for the root element of the component.
 * @param props.style - The inline CSS style object for the root element of the component.
 * @param props.label - The label text for the search input component.
 * @param props.loading - The loading state of the search input component.
 * @param props.search - The current search value of the search input component.
 * @param props.onSearchChange - The callback function triggered when the search value changes.
 * @returns - The rendered SearchSlot component.
 */
export const SearchSlot = ({
  className,
  style,
  label,
  loading,
  search,
  onSearchChange = () => null,
}: ISearchSlot) => {

  const { classes } = useStyles();

  /**
   * Executes the cleanup process for search functionality.
   *
   * @function handleSearchCleanup
   * @returns
   */
  const handleSearchCleanup = () => {
    onSearchChange("");
  };

  return (
    <div className={classNames(className, classes.root)} style={style}>
      <div className={classes.container}>
        <Box className={classes.labelContent}>
          <TextField
            label="Search"
            variant="standard"
            value={search}
            sx={{
              maxWidth: 'max(calc(50% - 75px), 256px)',
            }}
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
        </Box>
      </div>
      <div className={classes.controls} />
    </div>
  );
};

export default SearchSlot;
