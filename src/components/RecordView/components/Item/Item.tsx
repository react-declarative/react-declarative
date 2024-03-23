import * as React from 'react';
import { useMemo } from 'react';

import { makeStyles } from '../../../../styles';
import { alpha } from '@mui/material';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { SxProps } from '@mui/material';

import IRecordViewProps from '../../model/IRecordViewProps';

import classNames from '../../../../utils/classNames';
import isObject from '../../../../utils/isObject';

/**
 * Represents the properties of an item in a record view.
 */
export interface IItemProps extends Pick<IRecordViewProps, keyof {
  keyWidth: never;
  valueWidth: never;
  totalWidth: never;
}> {
  background?: IRecordViewProps['background'];
  formatValue: Exclude<IRecordViewProps['formatValue'], undefined>;
  formatKey: Exclude<IRecordViewProps['formatKey'], undefined>;
  index: number;
  path: string;
  itemKey: string;
  value: unknown;
  className?: string;
  style?: React.CSSProperties;
  sx?: SxProps<any>;
  withDarkParent?: boolean;
}

/**
 * Returns display value for a given variable.
 *
 * @param value - The value to be displayed.
 * @returns - The display value.
 */
const row = (value: React.ReactNode) => {
  if (value == null || value === undefined || value === '' || value === 'null') {
    return '—';
  } else if (typeof value === 'boolean') {
    return String(value);
  } else if (isObject(value)) {
    return (
      <pre>
        {JSON.stringify(value, null , 2)}
      </pre>
    );
  } else if (value.toString().startsWith('http')) {
    return (
      <a
        href={value.toString()}
        target="_blank"
        rel="noreferrer"
        style={{ wordBreak: 'break-all' }}
      >
        {value}
      </a>
    );
  } else {
    return value;
  }
};

/**
 * Represents the props for an item in a record view.
 */
export interface IItemProps extends Pick<IRecordViewProps, keyof {
  keyWidth: never;
  valueWidth: never;
  totalWidth: never;
}> {
  formatValue: Exclude<IRecordViewProps['formatValue'], undefined>;
  index: number;
  path: string;
  itemKey: string;
  value: unknown;
  className?: string;
  style?: React.CSSProperties;
  sx?: SxProps<any>;
  withDarkParent?: boolean;
}

const useStyles = makeStyles<{
  background?: string;
}>()((theme, {
  background = theme.palette.background.default,
}) => ({
  key: {
    borderRadius: '4px',
    '&:hover': {
      background: alpha(
        theme.palette.getContrastText(background),
        0.02
      ),
    },
  },
  keyBlack: {
    background: alpha(
      theme.palette.getContrastText(background),
      0.05
    ),
  },
  keyWhite: {
    backgroundColor: background,
  },
}));

/**
 * Represents an item component.
 *
 * @param ItemProps - The props for the item component.
 * @param ItemProps.formatValue - The formatting function for the item's value.
 * @param ItemProps.formatKey - The formatting function for the item's key.
 * @param ItemProps.keyWidth - The width of the item's key column.
 * @param ItemProps.valueWidth - The width of the item's value column.
 * @param ItemProps.totalWidth - The total width of the item component.
 * @param ItemProps.value - The value of the item.
 * @param ItemProps.itemKey - The key of the item.
 * @param ItemProps.path - The path of the item.
 * @param ItemProps.index - The index of the item.
 * @param ItemProps.background - The background color of the item.
 * @param ItemProps.withDarkParent - Indicates if the item has a dark parent.
 * @returns The rendered item component.
 */
export const Item = ({
  formatValue,
  formatKey,
  keyWidth,
  valueWidth,
  totalWidth,
  value: upperValue,
  itemKey,
  path,
  index,
  background,
  withDarkParent = false,
}: IItemProps) => {
  const { classes } = useStyles({ background });

  /**
   * Calculate and memoize the formatted value based on the given parameters.
   *
   * @param {string} itemKey - The key of the item.
   * @param {string | number | boolean} upperValue - The upper value to be formatted.
   * @param {string} path - The path of the item.
   * @param {function} formatValue - The function used to format the value.
   * @returns {*} The formatted value.
   */
  const value = useMemo(() => {
    const currentValue =
      typeof upperValue === 'string' ||
      typeof upperValue === 'number' ||
      typeof upperValue === 'boolean'
        ? upperValue
        : null;
    return formatValue(
      itemKey,
      currentValue,
      path.startsWith('root.') ? path.replace('root.', '') : path,
    );
  }, [itemKey, path, upperValue, formatValue]);

  return (
    <Grid
      container
      columns={totalWidth}
      sx={{ pt: 2, pb: 2 }}
      className={classNames(
        classes.key,
        withDarkParent
          ? {
              [classes.keyBlack]: index % 2 !== 0,
              [classes.keyWhite]: index % 2 === 0,
            }
          : {
              [classes.keyBlack]: index % 2 === 0,
              [classes.keyWhite]: index % 2 !== 0,
            },
      )}
    >
      <Grid item xs={keyWidth}>
        <Typography variant="body1" sx={{ ml: 1 }}>{formatKey(itemKey, path)}</Typography>
      </Grid>
      <Grid item zeroMinWidth xs={valueWidth}>
        <Typography
          sx={{
            whiteSpace: 'break-spaces',
            overflowWrap: 'break-word',
            textOverflow: 'ellipsis',
            fontWeight: 'bold',
          }}
          variant="body1"
        >
          {row(value)}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default Item;
