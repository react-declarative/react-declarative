import * as React from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { makeStyles } from '../../../../styles';
import { alpha, SxProps } from '@mui/material';

import Collapse from '../../../common/Collapse';

import Item, { IItemProps } from '../Item';

import IRecordViewProps from '../../model/IRecordViewProps';

import classNames from '../../../../utils/classNames';
import isObject from '../../../../utils/isObject';

import useSearch from '../../context/SearchContext';

import IData from '../../model/IData';
import IAnything from '../../../../model/IAnything';

import { RECORD_NEVER_VALUE } from '../../constant/RECORD_NEVER_VALUE';
import Empty from '../Empty';

const Fragment = () => <></>

/**
 * Represents the properties for the `Content` component.
 */
export interface IContentProps extends Pick<IRecordViewProps, keyof {
  keyWidth: never;
  valueWidth: never;
  totalWidth: never;
}> {
  background?: IRecordViewProps['background'];
  formatValue: Exclude<IRecordViewProps['formatValue'], undefined>;
  formatKey: Exclude<IRecordViewProps['formatKey'], undefined>;
  data: IRecordViewProps['data'];
  path?: string;
  className?: string;
  style?: React.CSSProperties;
  sx?: SxProps<any>;
  payload?: IAnything;
  withDarkParent?: boolean;
  itemKey: string;
  BeforeCollapseLabel?: React.ComponentType<{ itemKey: string; payload: IAnything; path: string; }>;
  AfterCollapseLabel?: React.ComponentType<{ itemKey: string; payload: IAnything; path: string; }>;
  EmptyItem?: React.ComponentType<any>;
  CustomItem?: React.ComponentType<IItemProps>;
}

const useStyles = makeStyles<{
  background?: string
}>()((theme, {
  background = theme.palette.background.default,
}) => ({
  group: {
    borderRadius: '4px',
  },
  groupKey: {
    textDecoration: 'underline',
    height: '100%',
  },
  groupBlack: {
    background: alpha(
      theme.palette.getContrastText(background),
      0.05
    ),
  },
  groupWrite: {
    backgroundColor: background,
  },
}));

/**
 * Renders the content of a collapsible panel.
 *
 * @param [path='root'] - The current path of the content.
 * @param data - The data to be rendered.
 * @param keyWidth - The width of the key column.
 * @param valueWidth - The width of the value column.
 * @param totalWidth - The total width of the content.
 * @param [formatValue] - The function to format the value.
 * @param [formatKey] - The function to format the key.
 * @param [withDarkParent=false] - Whether the parent content has a dark background.
 * @param [background] - The background color of the content.
 * @param [otherProps] - Other additional props.
 *
 * @returns - The rendered content.
 */
export const Content = ({
  path = 'root',
  data,
  keyWidth,
  valueWidth,
  totalWidth,
  formatValue,
  formatKey,
  payload,
  BeforeCollapseLabel = Fragment,
  AfterCollapseLabel = Fragment,
  withDarkParent = false,
  background,
  itemKey,
  EmptyItem = Empty,
  CustomItem = Item,
  ...otherProps
}: IContentProps) => {
  const { classes } = useStyles({ background });

  const { isSearching, isChecked, setIsChecked } = useSearch();

  const [checked, setChecked] = useState(isChecked(path));

  useEffect(() => {
    setIsChecked(path, checked);
  }, [path, checked]);

  const BeforeCollapseLabelInternal = useMemo(() => () => <BeforeCollapseLabel itemKey={itemKey} payload={payload} path={path} />, [path]);
  const AfterCollapseLabelInternal = useMemo(() => () => <AfterCollapseLabel itemKey={itemKey}  payload={payload} path={path} />, [path]);

  /**
   * Sets the checked value based on the provided boolean flag,
   * if not currently in a searching state.
   *
   * @param check - The boolean value to set the checked state to.
   */
  const handleCheck = (check: boolean) => {
    if (!isSearching) {
      setChecked(check);
    }
  };

  /**
   * Function to render the inner content based on the data provided.
   *
   * @returns - The rendered content.
   */
  const renderInner = useCallback(
    () =>
      Object.entries(data).map(([key, value], index) => {
        const prefix = `${path}.${key}`;
        if (key === RECORD_NEVER_VALUE) {
          return (
            <EmptyItem />
          );
        }
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
                  sx={{ mt: 3, ml: 1, overflow: 'hidden' }}
                  className={classes.groupKey}
                  variant="body1"
                >
                  {formatKey(key, prefix)}
                </Typography>
              </Grid>
              <Grid item xs={valueWidth} sx={{ mt: 3, mb: 3 }}>
                <Content
                  background={background}
                  withDarkParent={index % 2 === 0}
                  formatValue={formatValue}
                  formatKey={formatKey}
                  data={value as IData}
                  keyWidth={keyWidth}
                  payload={payload}
                  itemKey={key}
                  valueWidth={valueWidth}
                  totalWidth={totalWidth}
                  BeforeCollapseLabel={BeforeCollapseLabel}
                  AfterCollapseLabel={AfterCollapseLabel}
                  EmptyItem={EmptyItem}
                  CustomItem={CustomItem}
                  path={prefix}
                  {...otherProps}
                />
              </Grid>
            </Grid>
          );
        }
        return (
          <CustomItem
            background={background}
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
      background,
    ],
  );

  if (path === 'root') {
    return <>{renderInner()}</>;
  }

  return (
    <Collapse
      checked={checked || isSearching}
      onCheck={handleCheck}
      BeforeLabel={BeforeCollapseLabelInternal}
      AfterLabel={AfterCollapseLabelInternal}
    >
      {renderInner()}
    </Collapse>
  );
};

export default Content;
