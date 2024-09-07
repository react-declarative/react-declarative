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
import IAnything from '../../../../model/IAnything';

import useSearch from '../../context/SearchContext';
import usePreventAutofill from '../../../../hooks/usePreventAutofill';

import classNames from '../../../../utils/classNames';
import { IItemProps } from '../Item';

/**
 * Interface for ContainerProps which extends BoxProps
 * @interface
 */
export interface IContainerProps extends BoxProps {
  keyWidth: GridSize;
  valueWidth: GridSize;
  totalWidth: number | undefined;
  formatValue: Exclude<IRecordViewProps['formatValue'], undefined>;
  formatKey: Exclude<IRecordViewProps['formatKey'], undefined>;
  BeforeSearch?: IRecordViewProps['BeforeSearch'];
  AfterSearch?: IRecordViewProps['AfterSearch'];
  BeforeCollapseLabel?: React.ComponentType<{ itemKey: string; payload: IAnything; path: string; }>;
  AfterCollapseLabel?: React.ComponentType<{ itemKey: string; payload: IAnything; path: string; }>;
  EmptyItem?: React.ComponentType<any>;
  CustomItem?: React.ComponentType<IItemProps>;
  payload?: IRecordViewProps['payload'];
}

const useStyles = makeStyles()({
  root: {
    position: 'relative', 
    maxWidth: '100%'
  },
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

/**
 * Container is a React component that displays a searchable content container with various customizable options.
 *
 * @param props - The props object containing properties for configuring the Container component.
 * @param props.formatValue - The function to format the display value of each item in the container.
 * @param props.formatKey - The function to format the display key of each item in the container.
 * @param props.keyWidth - The width of the key column in pixels.
 * @param props.valueWidth - The width of the value column in pixels.
 * @param props.totalWidth - The total width of the container in pixels.
 * @param props.BeforeSearch - The component to render before the search input field.
 * @param props.AfterSearch - The component to render after the search input field.
 * @param props.payload - Custom payload data to be passed to BeforeSearch and AfterSearch components.
 * @param otherProps - Other properties to be passed down to the container element.
 * @returns - The rendered Container component.
 */
export const Container = ({
  formatValue,
  formatKey,
  keyWidth,
  valueWidth,
  totalWidth,
  BeforeSearch,
  AfterSearch,
  BeforeCollapseLabel,
  AfterCollapseLabel,
  EmptyItem,
  CustomItem,
  payload,
  className,
  style,
  sx,
  ...otherProps
}: IContainerProps) => {
  const { classes } = useStyles();
  const { data, search, isSearching, setSearch } = useSearch();
  const preventAutofill = usePreventAutofill();
  return (
    <Box
      className={classNames(className, classes.root)}
      style={style}
      sx={sx}
      {...otherProps}
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
        payload={payload}
        formatValue={formatValue}
        formatKey={formatKey}
        keyWidth={keyWidth}
        valueWidth={valueWidth}
        totalWidth={totalWidth}
        EmptyItem={EmptyItem}
        CustomItem={CustomItem}
        itemKey="root"
        BeforeCollapseLabel={BeforeCollapseLabel}
        AfterCollapseLabel={AfterCollapseLabel}
      />
    </Box>
  );
};

export default Container;
