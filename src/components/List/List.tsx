import * as React from "react";
import { useMemo } from "react";

import Entry from "./components/Entry";

import IRowData from "../../model/IRowData";
import IAnything from "../../model/IAnything";
import IField from "../../model/IField";
import IListProps from "../../model/IListProps";
import TypedField from "../../model/TypedField";
import ColumnType from "../../model/ColumnType";

export const List = <
  FilterData extends {} = IAnything,
  RowData extends IRowData = IAnything,
  Payload extends IAnything = IAnything,
  Field extends IField = IField<FilterData, Payload>
>(props: IListProps<FilterData, RowData, Payload, Field>) => {
  return <Entry {...props} />;
};

export const ListTyped = <
    FilterData extends {} = IAnything,
    RowData extends IRowData = IAnything,
>(
    props: IListProps<FilterData, RowData, TypedField<FilterData>>,
) => {

  const columns = useMemo(() => {
    const { columns = [], rowActions, onRowAction } = props;
    if (!rowActions?.length || !onRowAction) {
      return columns.filter(({ type }) => type !== ColumnType.Action);
    }
    return columns;
  }, []);

  return <List<FilterData, RowData> {...props} columns={columns} />;
};

export default List;
