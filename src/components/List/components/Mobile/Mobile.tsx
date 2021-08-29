import * as React from "react";
import { useRef, useEffect } from 'react';

import { VariableSizeList as List } from "react-window";
import IListProps, { IListState, IListCallbacks } from '../../../../model/IListProps';
import IAnything from '../../../../model/IAnything';
import IRowData from '../../../../model/IRowData';

import Container from "../Container";

import MobileItem from "./MobileItem";

interface IMobileProps<FilterData = IAnything, RowData extends IRowData = IAnything> extends
  Omit<IListProps<FilterData, RowData>, keyof {
    ref: never;
    limit: never;
  }>,
  IListState<FilterData, RowData>,
  IListCallbacks<FilterData, RowData> {
  className?: string;
  style?: React.CSSProperties;
}

export const Mobile = <
  FilterData extends IAnything = IAnything,
  RowData extends IRowData = IAnything,
>(props: IMobileProps<FilterData, RowData>) => {

  const { rows } = props;

  const listRef = useRef<any>({});
  const rowHeights = useRef<any>({});

  function getRowHeight(index: number) {
    return rowHeights.current[index];
  }

  function setRowHeight(index: number, size: number) {
    listRef.current.resetAfterIndex(0);
    rowHeights.current = { ...rowHeights.current, [index]: size };
  }

  const Row = ({ index, style }: any) => {
    const elementRef = useRef<HTMLDivElement>(null);

    const handleResize = (newHeight: number) => {
      console.log(newHeight)
      setRowHeight(index, newHeight);
    };

    useEffect(() => {
      const { current: element } = elementRef;
      if (element) {
        const { clientHeight } = element;
        handleResize(clientHeight);
      }
    }, [elementRef]);

    return (
      <MobileItem<FilterData, RowData>
        onResize={handleResize}
        ref={elementRef}
        key={index}
        style={style}
        data={rows[index]}
        {...props}
      />
    );
  }

  return (
    <Container<FilterData, RowData>
      {...props}
    >
      {({
        height,
        width,
      }) => (
        <List
          height={height}
          width={width}
          itemCount={rows.length}
          itemSize={getRowHeight}
          ref={listRef}
        >
          {Row}
        </List>
      )}
    </Container>
  )
};

export default Mobile;
