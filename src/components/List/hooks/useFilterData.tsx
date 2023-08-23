import * as React from "react";
import { useContext } from "react";

import IListProps from "../../../model/IListProps";
import IAnything from "../../../model/IAnything";
import IField from "../../../model/IField";

import IRowData from "../../../model/IRowData";

type IContext<
  FilterData extends {} = IAnything,
  RowData extends IRowData = IAnything,
  Payload extends IAnything = IAnything,
  Field extends IField = IField<FilterData, Payload>
> = Exclude<IListProps<FilterData, RowData, Payload, Field>["filterData"], undefined>;

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
