import * as React from "react";

import Paper from '@material-ui/core/Paper';

import DynamicVirtualized, { createCache } from "react-window-dynamic-list";

import IListProps, { IListState, IListCallbacks, IRowData } from '../../../../model/IListProps';
import IAnything from '../../../../model/IAnything';

import Container from "../Container";

import MobileItem from "./MobileItem";

interface IMobileProps<FilterData = IAnything, RowData extends IRowData = IAnything> extends
  IListProps<FilterData, RowData>,
  IListState<FilterData, RowData>,
  IListCallbacks<FilterData, RowData> {
  className?: string;
  style?: React.CSSProperties;
}

export const Mobile = <
  FilterData extends IRowData = IAnything,
  RowData extends IRowData = IAnything,
  >(props: IMobileProps<FilterData, RowData>) => {

  const cache = createCache();

  return (
    <Container
      {...props}
    >
      {({
        height,
        width,
      }) => (
        <Paper>
          <DynamicVirtualized<RowData>
            height={height}
            width={width}
            data={[]}
            cache={cache}
          >
            {({ index, style, data }) => (
              <MobileItem<FilterData, RowData>
                key={index}
                style={style}
                data={data}
                {...props}
              />
            )}
          </DynamicVirtualized>
        </Paper>
      )}
    </Container>
  )
};

export default Mobile;
