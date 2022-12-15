import * as React from 'react';
import { useMemo } from 'react';

import { makeStyles } from '../../../../styles';
import { alpha } from '@mui/material';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { SxProps } from '@mui/system';

import IRecordViewProps from '../../model/IRecordViewProps';

import replaceString from '../../utils/replaceString';
import classNames from '../../../../utils/classNames';
import keyToTitle from '../../utils/keyToTitle';

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
  sx?: SxProps;
  withDarkParent?: boolean;
}

const row = (value: React.ReactNode) => {
  if (value == null || value === '' || value === 'null') {
    return '—';
  } else if (typeof value === 'boolean') {
    return String(value);
  } else if (typeof value === 'object') {
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
  sx?: SxProps;
  withDarkParent?: boolean;
}

const useStyles = makeStyles()((theme) => ({
  key: {
    borderRadius: '4px',
    '&:hover': {
      background: alpha(
        theme.palette.getContrastText(theme.palette.background.default),
        0.02
      ),
    },
  },
  keyBlack: {
    background: alpha(
      theme.palette.getContrastText(theme.palette.background.default),
      0.05
    ),
  },
  keyWhite: {
    backgroundColor: theme.palette.background.default,
  },
}));

export const Item = ({
  formatValue,
  keyWidth,
  valueWidth,
  totalWidth,
  value: upperValue,
  itemKey,
  path,
  index,
  withDarkParent = false,
}: IItemProps) => {
  const { classes } = useStyles();

  const value = useMemo(() => {
    const currentValue =
      typeof upperValue === 'string' ||
      typeof upperValue === 'number' ||
      typeof upperValue === 'boolean'
        ? upperValue
        : null;
    return formatValue(replaceString(path, 'root.', ''), currentValue);
  }, [path, upperValue, formatValue]);

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
        <Typography variant="body1" sx={{ ml: 1 }}>{keyToTitle(itemKey)}: </Typography>
      </Grid>
      <Grid item xs={valueWidth}>
        <Typography variant="body1">
          <strong>
            {row(value)}
          </strong>
        </Typography>
      </Grid>
    </Grid>
  );
};

export default Item;
