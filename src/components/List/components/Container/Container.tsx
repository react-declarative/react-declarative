import * as React from "react";
import { forwardRef } from 'react';
import { makeStyles } from "@material-ui/core";

import Paper from "@material-ui/core/Paper";

import classNames from "../../../../utils/classNames";

import AutoSizer from "../../../common/AutoSizer";

import IListProps, { IListState, IListCallbacks } from '../../../../model/IListProps';
import IAnything from '../../../../model/IAnything';
import IRowData from '../../../../model/IRowData';

import Actions from "./Actions";
import Filters from "./Filters";

const AUTOSIZER_DELAY = 50;

interface ISize {
  height: number;
  width: number;
}

interface IContainerProps<FilterData = IAnything, RowData extends IRowData = IAnything> extends
  Omit<IListProps<FilterData, RowData>, keyof {
    ref: never;
    limit: never;
    autoReload: never;
  }>,
  IListState<FilterData, RowData>,
  IListCallbacks<FilterData, RowData> {
  className?: string;
  style?: React.CSSProperties;
  children: (s: ISize) => any;
  ready: () => void;
  ref?: (instance: HTMLDivElement) => void
}

const useStyles = makeStyles({
  root: {},
  container: {
    display: "flex",
    alignItems: "stretch",
    justifyContent: "stretch",
    flexDirection: "column",
    "&&& .MuiDataGrid-root": {
      border: "1px solid transparent",
    },
  },
  stretch: {
    flex: 1,
  },
  noElevation: {
    background: "transparent",
    boxShadow: "none",
  },
});

export const Container = <
  FilterData extends IAnything = IAnything,
  RowData extends IRowData = IAnything,
>({
  className,
  style,
  filters = [],
  actions = [],
  heightRequest = (v) => v,
  widthRequest = (v) => v,
  title = '',
  filterLabel = '',
  filterData,
  handleFilter,
  handleDefault,
  initComplete,
  children,
  isMobile,
  ready,
  toggleFilters,
  onFilterChange,
  sizeByParent = true,
}: IContainerProps<FilterData, RowData>, ref: any) => {
  const classes = useStyles();

  const sizer = {
    ...(!sizeByParent && {
      target: document.body,
    })
  };

  return (
    <AutoSizer
      className={classNames(classes.root, className)}
      heightRequest={heightRequest}
      widthRequest={widthRequest}
      delay={AUTOSIZER_DELAY}
      style={style}
      {...sizer}
    >
      {({ height, width }) => (
        <div ref={ref} style={{ height, width }} className={classes.container}>
          {Array.isArray(actions) && !!actions.length && (
            <Actions<FilterData> title={title} filterData={filterData!} actions={actions} />
          )}
          <Paper className={classNames(classes.container, classes.stretch, {
            [classes.noElevation]: isMobile,
          })}>
            {Array.isArray(filters) && !!filters.length && (
              <Filters<FilterData>
                filterData={filterData!}
                toggleFilters={toggleFilters}
                onFilterChange={onFilterChange}
                change={handleFilter}
                clean={handleDefault as any}
                label={filterLabel}
                filters={filters}
                ready={ready}
              />
            )}
            <div className={classNames(classes.container, classes.stretch)}>
              {!!initComplete && (
                <AutoSizer>
                  {children}
                </AutoSizer>
              )}
            </div>
          </Paper>
        </div>
      )}
    </AutoSizer>
  )
};

export default forwardRef(Container) as typeof Container;
