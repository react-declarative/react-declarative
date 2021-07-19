import * as React from 'react';
import { useRef } from 'react';

import { useModal } from 'react-modal-hook';

import IField from '../../model/IField';
import IColumn from '../../model/IColumn';
import IRowData from '../../model/IRowData';
import IAnything from '../../model/IAnything';
import TypedField from '../../model/TypedField';
import { ListHandler } from '../../model/IListProps';
import SelectionMode from '../../model/SelectionMode';
import ListPicker from '../common/ListPicker';

type Fn<Data = IAnything> = (d: Data[] | null) => void;

interface IParams<
  RowData extends IRowData = IAnything,
  FilterData extends IAnything = IAnything,
  Field extends IField = IField<FilterData>
> {
  handler: ListHandler<RowData>;
  selectionMode?: SelectionMode.Single | SelectionMode.Multiple;
  columns?: IColumn<RowData>[];
  filters?: Field[];
  title?: string;
}

export const useList = <
  RowData extends IRowData = IAnything,
  FilterData extends IAnything = IAnything,
  Field extends IField = IField<FilterData>
>({
  handler,
  selectionMode = SelectionMode.Single,
  columns,
  filters,
  title,
}: IParams<RowData, FilterData, Field>) => {

  const changeRef = useRef<Fn>();

  const handleChange: Fn = (date) => {
    const { current } = changeRef;
    if (current) {
      current(date);
    }
    hideModal();
  };

  const [showModal, hideModal] = useModal(({ in: open }) => (
    <ListPicker
      open={open}
      filters={filters}
      selectionMode={selectionMode}
      title={title}
      columns={columns}
      handler={handler}
      onChange={handleChange}
    />
  ));

  return () => new class {
    constructor() {
      showModal();
    };
    then(onData: Fn) {
      changeRef.current = onData;
    };
  }();
};

export const useListTyped = <
  RowData extends IRowData = IAnything,
  FilterData extends IAnything = IAnything,
>(params: IParams<RowData, FilterData, TypedField<FilterData>>) =>
  useList(params);

export default useList;
