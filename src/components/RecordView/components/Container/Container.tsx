import * as React from 'react';
import { GridSize, BoxProps } from '@mui/material';

import { makeStyles } from '../../../../styles';

import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import Box from '@mui/material/Box';
import Close from '@mui/icons-material/Close';
import Search from '@mui/icons-material/Search';

import { Content } from '../Content';

import IRecordViewProps from '../../model/IRecordViewProps';

import useSearch from '../../context/SearchContext';
import usePreventAutofill from '../../../../hooks/usePreventAutofill';

export interface IContainerProps extends BoxProps {
  keyWidth: GridSize;
  valueWidth: GridSize;
  totalWidth: number | undefined;
  formatValue: Exclude<IRecordViewProps['formatValue'], undefined>;
  formatKey: Exclude<IRecordViewProps['formatKey'], undefined>;
  background?: IRecordViewProps['background'];
  BeforeSearch?: IRecordViewProps['BeforeSearch'];
  AfterSearch?: IRecordViewProps['AfterSearch'];
  payload?: IRecordViewProps['payload'];
}

const useStyles = makeStyles()({
  beforeSearch: {
    width: 'calc(100% - 10px)',
    margin: '5px',
    marginBottom: '0px',
    display: 'flex',
    alignItems: 'stretch',
    justifyContent: 'stretch',
    '& > *': {
      flex: 1,
    },
  },
  afterSearch: {
    width: 'calc(100% - 10px)',
    margin: '5px',
    marginTop: '0px',
    display: 'flex',
    alignItems: 'stretch',
    justifyContent: 'stretch',
    '& > *': {
      flex: 1,
    },
  },
});

export const Container = ({
  formatValue,
  formatKey,
  keyWidth,
  valueWidth,
  totalWidth,
  background,
  BeforeSearch,
  AfterSearch,
  payload,
  ...otherProps
}: IContainerProps) => {
  const { classes } = useStyles();
  const { data, search, isSearching, setSearch } = useSearch();
  const preventAutofill = usePreventAutofill();
  return (
    <Box
      {...otherProps}
      sx={{ ...otherProps.sx, position: 'relative', maxWidth: '100%' }}
    >
      {BeforeSearch && (
        <Box className={classes.beforeSearch}>
          <BeforeSearch payload={payload} />
        </Box>
      )}
      <TextField
        fullWidth
        sx={{ mb: 1 }}
        variant="standard"
        onChange={({ target }) => setSearch(target.value.toString())}
        value={search}
        placeholder="Search"
        InputProps={{
          autoComplete: 'off',
          endAdornment: (
            <InputAdornment position="end">
              <div style={{ marginRight: -10 }}>
                <IconButton onClick={() => setSearch('')}>
                  {isSearching ? <Close /> : <Search />}
                </IconButton>
              </div>
            </InputAdornment>
          ),
        }}
        name="search"
        type="text"
        {...preventAutofill}
      />
      {AfterSearch && (
        <Box className={classes.afterSearch}>
          <AfterSearch payload={payload} />
        </Box>
      )}
      {Object.keys(data).length === 0 && (
        <Typography variant="body1">Nothing found</Typography>
      )}
      <Content
        data={data}
        formatValue={formatValue}
        formatKey={formatKey}
        keyWidth={keyWidth}
        valueWidth={valueWidth}
        totalWidth={totalWidth}
        background={background}
      />
    </Box>
  );
};

export default Container;
