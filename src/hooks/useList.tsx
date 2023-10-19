import * as React from 'react';
import { useRef, useState } from 'react';

import { useModal } from '../components/ModalProvider';

import IColumn from '../model/IColumn';
import IRowData from '../model/IRowData';
import IAnything from '../model/IAnything';
import IListProps from '../model/IListProps';

import SelectionMode from '../model/SelectionMode';

import ListPicker, { IListPickerProps } from '../components/common/ListPicker';

import Subject from '../utils/rx/Subject';

type Fn<Data = IAnything> = (d: Data[] | null) => void;

interface IParams<RowData extends IRowData = IAnything> extends Omit<IListPickerProps<RowData>, keyof {
  onChange: never;
  selectionMode: never;
  selectedRows: never;
  minHeight: never;
  minWidth: never;
  title: never;
  columns: never;
  open: never;
}> {
  selectionMode?: SelectionMode.Single | SelectionMode.Multiple;
  selectedRows?: IListProps<RowData>['selectedRows'];
  columns: Omit<IColumn<RowData>, keyof {
    headerName: never;
    width: never;
  }>[];
  minHeight?: number;
  minWidth?: number;
  title?: string;
}

export const useList = <RowData extends IRowData = IAnything>({
  handler,
  columns,
  rowActions,
  payload,
  features,
  selectionMode = SelectionMode.Single,
  title: titleDefault = 'Pick item',
  minWidth: minWidthDefault = 425,
  minHeight: minHeightDefault = 375,
  selectedRows: selectedRowsDefault,
}: IParams<RowData>) => {

  const [title, setTitle] = useState(titleDefault);
  const [minWidth, setMinWidth] = useState(minWidthDefault);
  const [minHeight, setMinHeight] = useState(minHeightDefault);
  const [selectedRows, setSelectedRows] = useState(selectedRowsDefault || null);

  const changeRef = useRef<Fn>();

  const handleChange: Fn = (data) => {
    const { current } = changeRef;
    if (current) {
      current(data);
    }
    hideModal();
  };

  const { showModal, hideModal } = useModal(() => (
    <ListPicker
      open
      payload={payload}
      features={features}
      selectionMode={selectionMode}
      minHeight={minHeight}
      minWidth={minWidth}
      title={title}
      columns={columns}
      handler={handler}
      selectedRows={selectedRows}
      onChange={handleChange}
      rowActions={rowActions}
    />
  ), [title, minWidth, minHeight, selectedRows]);

  return ({
    title,
    minWidth,
    minHeight,
    selectedRows,
  }: Partial<IParams<RowData>> = {}) => new class {
    constructor() {
      title !== undefined && setTitle(title);
      minWidth !== undefined && setMinWidth(minWidth);
      minHeight !== undefined && setMinHeight(minHeight);
      selectedRows !== undefined && setSelectedRows(selectedRows);
      showModal();
    };
    then = (onData: Fn) => {
      changeRef.current = onData;
    };
    toPromise = async () => {
      const subject = new Subject<RowData[] | null>();
      this.then(subject.next);
      return await subject.toPromise();
    };
  }();
};

export default useList;
