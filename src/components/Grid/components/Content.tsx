import * as React from 'react';
import { SxProps } from '@mui/system';

import { makeStyles } from '../../../styles';

import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import IColumn from '../model/IColumn';
import IGridProps from '../model/IGridProps';
import RowData from '../model/RowData';

import Line from './Line';
import ContentRow from './ContentRow';

import VirtualView from '../../VirtualView';

import classNames from '../../../utils/classNames';
import get from '../../../utils/get';

import { DEFAULT_ROW_HEIGHT } from '../config';

interface IContentProps {
  className?: string;
  style?: React.CSSProperties;
  sx?: SxProps;
  scrollXSubject: IGridProps['scrollYSubject'];
  scrollYSubject: IGridProps['scrollXSubject'];
  columns: Array<IColumn>;
  rowKey: IGridProps['rowKey'];
  loading: IGridProps['loading'];
  minRowHeight: IGridProps['minRowHeight'];
  bufferSize: IGridProps['bufferSize'];
  data: IGridProps['data'];
  hasMore: IGridProps['hasMore'];
  errorMessage: IGridProps['errorMessage'];
  rowActions: IGridProps['rowActions'];
  rowActionsPayload: IGridProps['rowActionsPayload'];
  onScrollX: (scrollX: number) => void;
  onTableRowClick: IGridProps['onTableRowClick'];
  onRowAction: IGridProps['onRowAction'];
  onButtonSkip: IGridProps['onButtonSkip'];
  onSkip: IGridProps['onSkip'];
}

const useStyles = makeStyles()({
  content: {
    height: "calc(100% - 35px)"
  },
  noData: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "12px"
  },
});

export const Content = ({
  className,
  style,
  sx,
  scrollXSubject,
  scrollYSubject,
  columns,
  loading,
  data,
  rowKey = 'id',
  hasMore,
  errorMessage,
  rowActions,
  rowActionsPayload,
  minRowHeight = DEFAULT_ROW_HEIGHT,
  bufferSize,
  onTableRowClick,
  onRowAction,
  onButtonSkip,
  onSkip,
  onScrollX,
}: IContentProps) => {
  const { classes } = useStyles();
  return (
    <VirtualView
      className={classNames(className, classes.content)}
      style={style}
      sx={sx}
      scrollXSubject={scrollXSubject}
      scrollYSubject={scrollYSubject}
      minRowHeight={minRowHeight}
      bufferSize={bufferSize}
      loading={loading}
      hasMore={hasMore}
      onDataRequest={() => {
        if (onSkip && hasMore) {
          onSkip();
        }
      }}
      onScroll={(e) => {
        const target = e.target as HTMLDivElement;
        if (onScrollX) {
          onScrollX(target.scrollLeft);
        }
      }}
    >
      {!loading && !errorMessage && data.length === 0 && (
        <Line columns={columns} withRowActions={!!rowActions?.length}>
          <div className={classes.noData}>
            <Typography variant="body1">No data</Typography>
          </div>
        </Line>
      )}
      {errorMessage && (
        <Line columns={columns} withRowActions={!!rowActions?.length}>
          <div className={classes.noData}>
            <Typography color="error" variant="body1">
              {errorMessage}
            </Typography>
          </div>
        </Line>
      )}
      {data.map((row: RowData, idx) => {
        const rowId = `${get(row, rowKey)}-${idx}`;
        return (
          <ContentRow
            key={rowId}
            columns={columns}
            row={row}
            onTableRowClick={onTableRowClick}
            onRowAction={onRowAction}
            rowActions={rowActions}
            rowActionsPayload={rowActionsPayload}
            rowKey={rowKey}
          />
        );
      })}
      {data.length > 0 && !errorMessage && onButtonSkip && !loading && hasMore && (
        <Line columns={columns} withRowActions={!!rowActions?.length}>
          <div className={classes.noData}>
            <Button variant="outlined" onClick={onButtonSkip}>
              Show More
            </Button>
          </div>
        </Line>
      )}
    </VirtualView>
  );
};

export default Content;
