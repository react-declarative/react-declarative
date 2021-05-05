import * as React from 'react';
import { Fragment } from 'react';
import { makeStyles } from '@material-ui/core';

import Fab from '@material-ui/core/Fab';

import Add from '@material-ui/icons/Add';

import classNames from '../../utils/classNames';

import { ActionType, IListAction } from '../../model/IListProps';
import IAnything from '../../model/IAnything';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'stretch',
  },
  stretch: {
    flex: 1,
  },
  noData: {
    maxHeight: 0,
  },
});

interface IActionsProps<FilterData = IAnything> {
  className?: string;
  style?: React.CSSProperties;
  filterData: FilterData;
  actions: IListAction<FilterData>[];
}

const createAction = <FilterData extends IAnything>(data: FilterData, {
  type,
  onClick,
}: IListAction) => {
  if (type === ActionType.Add) {
    return (
      <Fab onClick={() => onClick(data)}>
        <Add />
      </Fab>
    );
  } else {
    throw new Error('List Actions unknown action type');
  }
};

export const Actions = <FilterData extends IAnything>({
  className,
  filterData,
  actions,
  style,
}: IActionsProps<FilterData>) => {
  const classes = useStyles();
  return (
    <div
      className={classNames(className, classes.root, {
        [classes.noData]: actions.length === 0,
      })}
      style={style}
    >
      <div className={classes.stretch} />
      {actions.map((action, idx) => (
        <Fragment key={idx}>
          { createAction(filterData, action) }
        </Fragment>
      ))}
    </div>
  )
};

export default Actions;
