import * as React from "react";
import { useMemo } from 'react';

import { SearchProvider } from "./context/SearchContext";

import Container from "./components/Container";

import IData from "./model/IData";
import IRecordViewProps from "./model/IRecordViewProps";

import keyToTitle from "./utils/keyToTitle";
import excelExport from "./helpers/excelExport";
import objectToEntries from "./utils/objectToEntries";

export const RecordView = <Data extends any = IData>({
  data: upperData = {} as Data,
  search = '',
  onSearchChanged,
  formatValue = (_, value) => value,
  formatKey = (key) => `${keyToTitle(key)}: `,
  withExpandAll = false,
  withExpandRoot = false,
  withExpandLevel = 0,
  expandList,
  keyWidth = 2,
  valueWidth = 10,
  totalWidth,
  background,
  ...otherProps
}: IRecordViewProps<Data>) => {
  const data = useMemo(() => objectToEntries(upperData as IData), [upperData]);
  return (
    <SearchProvider
      search={search}
      data={data as IData}
      withExpandAll={withExpandAll}
      withExpandRoot={withExpandRoot}
      withExpandLevel={withExpandLevel}
      expandList={expandList}
      onSearchChanged={onSearchChanged}
    >
      <Container
        formatValue={formatValue}
        formatKey={formatKey}
        keyWidth={keyWidth}
        valueWidth={valueWidth}
        totalWidth={totalWidth}
        background={background}
        {...otherProps}
      />
    </SearchProvider>
  );
};

RecordView.excelExport = excelExport;

export default RecordView;
