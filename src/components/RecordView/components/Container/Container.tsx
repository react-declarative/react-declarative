import * as React from 'react';
import { GridSize, BoxProps } from '@mui/material';

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

export interface IContainerProps extends BoxProps {
  keyWidth: GridSize;
  valueWidth: GridSize;
  totalWidth: number | undefined;
  formatValue: Exclude<IRecordViewProps['formatValue'], undefined>;
}

export const Container = ({
  formatValue,
  keyWidth,
  valueWidth,
  totalWidth,
  ...otherProps
}: IContainerProps) => {
  const { data, search, isSearching, setSearch } = useSearch();
  return (
    <Box
      {...otherProps}
      sx={{ ...otherProps.sx, position: 'relative', maxWidth: '100%' }}
    >
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
      />
      {Object.keys(data).length === 0 && (
        <Typography variant="h3">Nothing found</Typography>
      )}
      <Content
        data={data}
        formatValue={formatValue}
        keyWidth={keyWidth}
        valueWidth={valueWidth}
        totalWidth={totalWidth}
      />
    </Box>
  );
};

export default Container;
