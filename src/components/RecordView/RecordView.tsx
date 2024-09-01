import * as React from "react";
import { useMemo } from 'react';

import { SearchProvider } from "./context/SearchContext";

import Container from "./components/Container";

import IData from "./model/IData";
import IRecordViewProps from "./model/IRecordViewProps";

import keyToTitle from "./utils/keyToTitle";
import excelExport from "./helpers/excelExport";
import objectToEntries from "./utils/objectToEntries";

import IAnything from "../../model/IAnything";

/**
 * Renders a view to display record data with search capabilities.
 *
 * @template Data - The type of the data object.
 * @template Payload - The type of the payload object.
 *
 * @param props - The component props.
 * @param props.data - The data object to be displayed.
 * @param [props.search=''] - The search string.
 * @param [props.onSearchChanged] - The callback function triggered when the search string changes.
 * @param [props.formatValue] - The function used to format the value of a data key.
 * @param [props.formatKey] - The function used to format the key of a data entry.
 * @param [props.withExpandAll=false] - Specifies whether to display an option to expand all entries.
 * @param [props.withExpandRoot=false] - Specifies whether to display an option to expand the root entry.
 * @param [props.withExpandLevel=0] - The maximum level of entries to be expanded by default.
 * @param [props.expandList] - The list of data keys to be expanded by default.
 * @param [props.keyWidth=2] - The width of the key column.
 * @param [props.valueWidth=10] - The width of the value column.
 * @param [props.totalWidth] - The total width of the container.
 * @param [props.background] - The background color of the container.
 * @param [props.BeforeSearch] - The component to render before the search field.
 * @param [props.AfterSearch] - The component to render after the search field.
 * @param [props.payload] - The payload object to be passed as a prop to the container component.
 * @param [props.otherProps] - Any other additional props to be passed to the container component.
 *
 * @returns The rendered component.
 */
export const RecordView = <Data extends any = IData, Payload = IAnything>({
  data: upperData = {} as Data,
  search = '',
  onSearchChanged,
  formatValue = (_, value) => value,
  formatKey = (key) => `${keyToTitle(key)}: `,
  formatSearch,
  withExpandAll = false,
  withExpandRoot = false,
  withExpandLevel = 0,
  expandList,
  keyWidth = 2,
  valueWidth = 10,
  totalWidth,
  background,
  BeforeSearch,
  AfterSearch,
  BeforeCollapseLabel,
  AfterCollapseLabel,
  payload,
  className,
  style,
  sx,
  EmptyItem,
  CustomItem,
  ...otherProps
}: IRecordViewProps<Data, Payload>) => {
  const data = useMemo(() => objectToEntries(upperData as IData), [upperData]);
  return (
    <SearchProvider
      search={search}
      data={data as IData}
      withExpandAll={withExpandAll}
      withExpandRoot={withExpandRoot}
      withExpandLevel={withExpandLevel}
      formatSearch={formatSearch}
      expandList={expandList}
      onSearchChanged={onSearchChanged}
    >
      <Container
        formatValue={formatValue}
        formatKey={formatKey}
        EmptyItem={EmptyItem}
        CustomItem={CustomItem}
        keyWidth={keyWidth}
        valueWidth={valueWidth}
        totalWidth={totalWidth}
        background={background}
        BeforeSearch={BeforeSearch}
        AfterSearch={AfterSearch}
        BeforeCollapseLabel={BeforeCollapseLabel}
        AfterCollapseLabel={AfterCollapseLabel}
        payload={payload}
        className={className}
        style={style}
        sx={sx}
        {...otherProps}
      />
    </SearchProvider>
  );
};

RecordView.excelExport = excelExport;

export default RecordView;
