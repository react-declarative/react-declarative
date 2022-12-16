import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { makeStyles } from '../../../../styles';
import { alpha, SxProps } from '@mui/material';

import Collapse from '../../../common/Collapse';

import Item from '../Item';

import IRecordViewProps from '../../model/IRecordViewProps';

import classNames from '../../../../utils/classNames';
import isObject from '../../../../utils/isObject';

import useSearch from '../../context/SearchContext';

import IData from '../../model/IData';

export interface IContentProps extends Pick<IRecordViewProps, keyof {
  keyWidth: never;
  valueWidth: never;
  totalWidth: never;
}> {
  formatValue: Exclude<IRecordViewProps['formatValue'], undefined>;
  formatKey: Exclude<IRecordViewProps['formatKey'], undefined>;
  data: IRecordViewProps['data'];
  path?: string;
  className?: string;
  style?: React.CSSProperties;
  sx?: SxProps;
  withDarkParent?: boolean;
}

const useStyles = makeStyles()((theme) => ({
  group: {
    borderRadius: '4px',
  },
  groupKey: {
    textDecoration: 'underline',
    height: '100%',
  },
  groupBlack: {
    background: alpha(
      theme.palette.getContrastText(theme.palette.background.default),
      0.05
    ),
  },
  groupWrite: {
    backgroundColor: theme.palette.background.default,
  },
}));

export const Content = ({
  path = 'root',
  data,
  keyWidth,
  valueWidth,
  totalWidth,
  formatValue,
  formatKey,
  withDarkParent = false,
  ...otherProps
}: IContentProps) => {
  const { classes } = useStyles();

  const { isSearching, isChecked, setIsChecked } = useSearch();

  const [checked, setChecked] = useState(isChecked(path));

  useEffect(() => {
    setIsChecked(path, checked);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, checked]);

  const handleCheck = (check: boolean) => {
    if (!isSearching) {
      setChecked(check);
    }
  };

  const renderInner = useCallback(
    () =>
      Object.entries(data).map(([key, value], index) => {
        const prefix = `${path}.${key}`;
        if (isObject(value)) {
          return (
            <Grid
              key={prefix}
              container
              columns={totalWidth}
              className={classNames(classes.group, {
                [classes.groupBlack]: index % 2 === 0,
                [classes.groupWrite]: index % 2 !== 0,
              })}
            >
              <Grid item xs={keyWidth}>
                <Typography
                  sx={{ mt: 3, ml: 1 }}
                  className={classes.groupKey}
                  variant="body1"
                >
                  {formatKey(key, prefix)}
                </Typography>
              </Grid>
              <Grid item xs={valueWidth} sx={{ mt: 3, mb: 3 }}>
                <Content
                  withDarkParent={index % 2 === 0}
                  formatValue={formatValue}
                  formatKey={formatKey}
                  data={value as IData}
                  keyWidth={keyWidth}
                  valueWidth={valueWidth}
                  totalWidth={totalWidth}
                  path={prefix}
                  {...otherProps}
                />
              </Grid>
            </Grid>
          );
        }
        return (
          <Item
            withDarkParent={withDarkParent}
            formatValue={formatValue}
            formatKey={formatKey}
            key={prefix}
            path={prefix}
            itemKey={key}
            value={value}
            index={index}
            keyWidth={keyWidth}
            valueWidth={valueWidth}
            totalWidth={totalWidth}
            {...otherProps}
          />
        );
      }),
    [
      classes,
      data,
      path,
      otherProps,
      keyWidth,
      valueWidth,
      totalWidth,
      withDarkParent,
      formatValue,
      formatKey,
    ],
  );

  if (path === 'root') {
    return <>{renderInner()}</>;
  }

  return (
    <Collapse checked={checked || isSearching} onCheck={handleCheck}>
      {renderInner()}
    </Collapse>
  );
};

export default Content;
