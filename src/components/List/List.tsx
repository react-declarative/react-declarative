import * as React from "react";
import { useMemo } from "react";

import Entry from "./components/Entry";

import IRowData from "../../model/IRowData";
import IAnything from "../../model/IAnything";
import IField from "../../model/IField";
import IListProps from "../../model/IListProps";
import TypedField from "../../model/TypedField";

import useSingleton from "../../hooks/useSingleton";

export const List = <
  FilterData extends {} = IAnything,
  RowData extends IRowData = IAnything,
  Payload extends IAnything = IAnything,
  Field extends IField = IField<FilterData, Payload>
>({
  payload: upperPayload = {} as Payload,
  columns: upperColumns,
  ...otherProps
}: IListProps<FilterData, RowData, Payload, Field>) => {
  const payload = useSingleton(upperPayload);

  const columns = useMemo(() => {
    return upperColumns
      .map(({ isVisible = () => true, ...column }) => ({
        visible: isVisible(payload),
        ...column,
      }))
      .filter(({ visible }) => visible);
  }, [upperColumns]);

  return <Entry {...otherProps} columns={columns} payload={payload} />;
};

export const ListTyped = <
    FilterData extends {} = IAnything,
    RowData extends IRowData = IAnything,
>(
    props: IListProps<FilterData, RowData, TypedField<FilterData>>,
) => <List<FilterData, RowData> {...props} />;

export default List;
