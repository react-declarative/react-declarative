import * as React from "react";
import { useContext } from "react";

import IListProps from "../../../model/IListProps";
import IAnything from "../../../model/IAnything";
import IField from "../../../model/IField";

import IRowData from "../../../model/IRowData";

/**
 * Represents the context for a specific instance of a list component.
 *
 * @template FilterData - The type of the filter data object.
 * @template RowData - The type of the row data object.
 * @template Payload - The type of the payload object.
 * @template Field - The type of the field object.
 */
type IContext<
  FilterData extends {} = IAnything,
  RowData extends IRowData = IAnything,
  Payload extends IAnything = IAnything,
  Field extends IField = IField<FilterData, Payload>
> = Exclude<IListProps<FilterData, RowData, Payload, Field>["filterData"], undefined>;

/**
 * Represents the interface for the props of a React component.
 *
 * @template FilterData - The type of the filter data.
 * @template RowData - The type of the row data.
 * @template Payload - The type of the payload.
 * @template Field - The type of the field.
 */
interface IProps<
  FilterData extends {} = IAnything,
  RowData extends IRowData = IAnything,
  Payload extends IAnything = IAnything,
  Field extends IField = IField<FilterData, Payload>
> {
  value: IContext<FilterData, RowData, Payload, Field>;
  children: React.ReactNode;
}

const FilterDataContext = React.createContext<IContext>(null as never);

/**
 * Provides filtered data to its children components.
 * @template FilterData - The type of the data used for filtering.
 * @template RowData - The type of the row data.
 * @template Payload - The type of the payload.
 * @template Field - The type of the field.
 *
 * @param props - The props for the FilterDataProvider.
 * @param props.children - The children components.
 * @param props.value - The value used for filtering.
 *
 * @returns The FilterDataProvider component.
 */
export const FilterDataProvider = <
  FilterData extends {} = IAnything,
  RowData extends IRowData = IAnything,
  Payload extends IAnything = IAnything,
  Field extends IField = IField<FilterData, Payload>
>({
  children,
  value = {} as FilterData,
}: IProps<FilterData, RowData, Payload, Field>) => (
  <FilterDataContext.Provider value={value}>
    {children}
  </FilterDataContext.Provider>
);

/**
 * Retrieves the filter data from the FilterDataContext.
 *
 * @template FilterData - The type of the filter data.
 * @template RowData - The type of the row data.
 * @template Payload - The type of the payload.
 * @template Field - The type of the field.
 *
 * @returns The filter context as IContext<FilterData, RowData, Payload, Field>.
 */
export const useFilterData = <
  FilterData extends {} = IAnything,
  RowData extends IRowData = IAnything,
  Payload extends IAnything = IAnything,
  Field extends IField = IField<FilterData, Payload>
>() =>
  useContext(FilterDataContext) as IContext<
    FilterData,
    RowData,
    Payload,
    Field
  >;

export default useFilterData;
