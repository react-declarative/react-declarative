import * as React from "react";
import { forwardRef } from 'react';
import { makeStyles } from "../../../../styles";

import Paper from "@mui/material/Paper";

import classNames from "../../../../utils/classNames";

import AutoSizer, { IAutoSizerProps, IChildParams } from "../../../AutoSizer";

import IListProps, { IListState, IListCallbacks } from '../../../../model/IListProps';
import IAnything from '../../../../model/IAnything';
import IRowData from '../../../../model/IRowData';

import Operations from "./Operations";
import Actions from "./Actions";
import Filters from "./Filters";
import Chips from "./Chips";

const AUTOSIZER_DELAY = 50;
const CONTAINER_MARK = 'react-declarative__containerMark';

interface IContainerProps<FilterData = IAnything, RowData extends IRowData = IAnything> extends
  Omit<IListProps<FilterData, RowData>, keyof {
    ref: never;
    limit: never;
    chips: never;
    isChooser: never;
  }>,
  IListState<FilterData, RowData>,
  IListCallbacks<FilterData, RowData> {
  className?: string;
  style?: React.CSSProperties;
  children: (s: IChildParams<IContainerProps<FilterData, RowData>>) => any;
  ready: () => void;
  listChips: IListProps['chips'];
  ref?: (instance: HTMLDivElement) => void
  onResize?: IAutoSizerProps['onResize'];
}

const useStyles = makeStyles({
  root: {},
  container: {
    display: "flex",
    alignItems: "stretch",
    justifyContent: "stretch",
    flexDirection: "column",
    overflow: 'hidden',
  },
  stretch: {
    flex: 1,
  },
  noElevation: {
    background: "transparent",
  },
});

export const Container = <
  FilterData extends IAnything = IAnything,
  RowData extends IRowData = IAnything,
>(props: IContainerProps<FilterData, RowData>, ref: any) => {

  const classes = useStyles();

  const {
    className,
    style,
    filters = [],
    actions = [],
    listChips,
    heightRequest = (v) => v,
    widthRequest = (v) => v,
    operations,
    title = '',
    filterLabel = '',
    filterData,
    handleFilter,
    handleDefault,
    children,
    isChooser,
    ready,
    toggleFilters,
    onFilterChange,
    handleFiltersCollapsed,
    sizeByParent = true,
  } = props;

  const sizer = {
    ...(!sizeByParent && {
      target: document.documentElement,
    })
  };

  return (
    <AutoSizer
      className={classNames(classes.root, className, CONTAINER_MARK)}
      heightRequest={heightRequest}
      widthRequest={widthRequest}
      delay={AUTOSIZER_DELAY}
      style={style}
      payload={props}
      {...sizer}
    >
      {({ height, width, payload }) => (
        <div ref={ref} style={{ height, width }} className={classes.container}>
          {Array.isArray(actions) && !!actions.length && (
            <Actions<FilterData>
              title={title}
              filterData={filterData!}
              actions={actions}
            />
          )}
          {Array.isArray(operations) && !! operations.length && (
            <Operations
              operations={operations}
              width={width}
            />
          )}
          <Paper className={classNames(classes.container, classes.stretch, {
            [classes.noElevation]: isChooser,
          })}>
            {!isChooser && Array.isArray(filters) && !!filters.length && (
              <Filters<FilterData>
                filterData={filterData!}
                toggleFilters={toggleFilters}
                onFilterChange={onFilterChange}
                change={handleFilter}
                onCollapsedChange={handleFiltersCollapsed}
                clean={handleDefault as any}
                label={filterLabel}
                filters={filters}
                ready={ready}
              />
            )}
            {!isChooser && Array.isArray(listChips) && !!listChips.length && (
              <Chips<RowData>
                listChips={listChips}
              />
            )}
            <div className={classNames(classes.container, classes.stretch)}>
              <AutoSizer payload={payload} onResize={props.onResize}>
                {children}
              </AutoSizer>
            </div>
          </Paper>
        </div>
      )}
    </AutoSizer>
  )
};

export default forwardRef(Container) as typeof Container;
