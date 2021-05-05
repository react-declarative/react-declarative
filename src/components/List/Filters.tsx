import * as React from 'react';
import { makeStyles } from '@material-ui/core';

import classNames from '../../utils/classNames';

import IAnything from '../../model/IAnything';
import IField from '../../model/IField';

import One from '../One';

const useStyles = makeStyles({
  root: {

  }
});

interface IFiltersProps<FilterData = IAnything> {
  className?: string;
  filterData: FilterData;
  style?: React.CSSProperties;
  filters: IField<FilterData>[];
  change: (data: FilterData) => void;
}

export const Filters = <FilterData extends IAnything>({
  className,
  style,
  filterData,
  filters,
  change,
}: IFiltersProps<FilterData>) => {
  const classes = useStyles();
  return (
    <div
      className={classNames(className, classes.root)}
      style={style}
    >
      <One<FilterData>
        handler={filterData}
        fields={filters}
        change={change}
      />
    </div>
  )
};

export default Filters;
