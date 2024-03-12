import * as React from "react";
import { useMemo } from "react";

import Entry from "./components/Entry";

import IRowData from "../../model/IRowData";
import IAnything from "../../model/IAnything";
import IField from "../../model/IField";
import IListProps from "../../model/IListProps";
import TypedField from "../../model/TypedField";
import ColumnType from "../../model/ColumnType";

/**
 * Represents a List component which renders a collection of entries.
 *
 * @template FilterData - The type of the filter data.
 * @template RowData - The type of the row data.
 * @template Payload - The type of the payload.
 * @template Field - The type of the field.
 *
 * @param handler - Function to handle the list data. Default value is an empty array.
 * @param payload - The payload for the list data. Default value is an empty object.
 * @param fallback - Function to handle errors. Default value is a console.error call.
 * @param limit - The limit of items per page. Default value is DEFAULT_LIMIT.
 * @param page - The current page number. Default value is DEFAULT_PAGE.
 * @param isChooser - Flag to indicate if the list is for choosing items. Default value is false.
 * @param filters - The array of filters for the list. Default value is an empty array.
 * @param columns - The array of columns for the list. Default value is an empty array.
 * @param actions - The array of actions for the list. Default value is an empty array.
 * @param onRows - Callback function for when list rows change. Default value is a null function.
 * @param onSortModelChange - Callback function for when sort model changes. Default value is a null function.
 * @param onFilterChange - Callback function for when filter changes. Default value is a null function.
 * @param onChipsChange - Callback function for when chip changes. Default value is a null function.
 * @param onSearchChange - Callback function for when search query changes. Default value is a null function.
 * @param onPageChange - Callback function for when page changes. Default value is a null function.
 * @param onLimitChange - Callback function for when limit changes. Default value is a null function.
 * @param labelDisplayedRows - Function to display the label for displayed rows.
 * @param selectionLabel - Function to display the label for selected items.
 * @param filterData - The additional data for filters. Default value is an empty object.
 * @param withToggledFilters - Flag to indicate if filters are toggled. Default value is false.
 * @param withCustomFilters - Flag to indicate if custom filters are used. Default value is false.
 * @param fetchDebounce - The debounce time for fetching the list data. Default value is LIST_FETCH_DEBOUNCE.
 * @param sortModel - The array of sort model for the list. Default value is an empty array.
 * @param chips - The array of chips for the list. Default value is an empty array.
 * @param chipData - The additional data for chips. Default value is an empty object.
 * @param search - The search query for the list. Default value is an empty string.
 * @param slots - The slots for the list. Default value is an empty object.

 * @returns - The List component.
 */
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
