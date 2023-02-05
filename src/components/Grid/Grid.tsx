import * as React from 'react';
import { useEffect, useMemo } from 'react';

import IGridProps from './model/IGridProps';
import RowData from './model/RowData';

import Container from './components/Container';
import Header from './components/Header';
import Content from './components/Content';
import Loader from './components/Loader';

import createConstraintManager from './helpers/createConstraintManager';

import { ConstraintManagerProvider } from './hooks/useConstraintManager';

import useSingleton from '../../hooks/useSingleton';
import useSubject from '../../hooks/useSubject';
import throttle from '../../utils/hof/throttle';

export const Grid = <T extends RowData>({
  className,
  style,
  sx,
  columns,
  data,
  errorMessage,
  hasMore,
  loading,
  rowActions,
  rowActionsPayload,
  rowKey,
  sort,
  minRowHeight,
  bufferSize,
  onButtonSkip,
  onClickHeaderColumn,
  onRowAction,
  onSkip,
  onTableRowClick,
  recomputeSubject,
  shortHeight,
}: IGridProps<T>) => {
  const constraintManager = useSingleton(() => createConstraintManager());

  const scrollXSubject = useSubject<number>();

  useEffect(() => {
    if (recomputeSubject) {
      return recomputeSubject.subscribe(() => {
        constraintManager.clear();
      });
    }
    return undefined;
  }, [recomputeSubject, constraintManager]);

  const handleScrollX = useMemo(
    () =>
      throttle(
        (scrollX: number) => {
          scrollXSubject.next(scrollX);
        },
        5,
      ),
    [scrollXSubject],
  );

  useEffect(
    () => () => {
      handleScrollX.clear();
    },
    [handleScrollX],
  );

  return (
    <ConstraintManagerProvider constraintManager={constraintManager}>
      <Container
        shortHeight={shortHeight}
        className={className}
        style={style}
        sx={sx}
      >
        <Header
          columns={columns}
          sort={sort}
          rowActions={rowActions}
          onClickHeaderColumn={onClickHeaderColumn}
          onScrollX={handleScrollX}
          scrollXSubject={scrollXSubject}
        />
        {!!loading && <Loader />}
        <Content
          columns={columns}
          data={data}
          errorMessage={errorMessage}
          hasMore={hasMore}
          loading={loading}
          rowActions={rowActions}
          rowActionsPayload={rowActionsPayload}
          rowKey={rowKey}
          minRowHeight={minRowHeight}
          bufferSize={bufferSize}
          onSkip={onSkip}
          onTableRowClick={onTableRowClick}
          onRowAction={onRowAction}
          onButtonSkip={onButtonSkip}
          onScrollX={handleScrollX}
          scrollXSubject={scrollXSubject}
        />
      </Container>
    </ConstraintManagerProvider>
  );
};

export default Grid;
