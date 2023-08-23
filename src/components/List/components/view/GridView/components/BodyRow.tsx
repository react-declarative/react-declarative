import * as React from "react";
import { useMemo } from "react";

import useProps from "../../../../hooks/useProps";
import useConstraintManager from "../../../../hooks/useConstraintManager";
import useFilterData from "../../../../hooks/useFilterData";
import usePagination from "../../../../hooks/usePagination";
import usePayload from "../../../../hooks/usePayload";
import useSearch from "../../../../hooks/useSearch";

import IAnything from "../../../../../../model/IAnything";
import IRowData from "../../../../../../model/IRowData";

import DisplayMode from "../../../../../../model/DisplayMode";

import { BodyRowSlot, BodyColumn } from "../../../../slots/BodyRowSlot";
import { IVisibilityRequest } from "../../../../helpers/createConstraintManager";

export interface IBodyRowProps<RowData extends IRowData = IAnything> {
  fullWidth: number;
  mode: DisplayMode;
  row: RowData;
}

export const BodyRow = <RowData extends IRowData = IAnything>({
  fullWidth,
  mode,
  row,
}: IBodyRowProps<RowData>) => {
  const { columns: listColumns } = useProps();

  const { wrapColumns } = useConstraintManager();

  const filterData = useFilterData();
  const pagination = usePagination();
  const { sortModel, chips } = useProps();
  const search = useSearch();
  const payload = usePayload();

  const visibilityRequest = useMemo((): IVisibilityRequest => ({
    filterData,
    pagination,
    sortModel: sortModel || [],
    chips: chips || {},
    search,
    payload,
  }), [
    filterData,
    pagination,
    sortModel,
    chips,
    search,
    payload,
  ]);

  const columns = useMemo(() => {
    const columns = wrapColumns({
      columns: listColumns,
      visibilityRequest,
      fullWidth,
      mode,
    });

    return columns;
  }, [fullWidth, filterData, visibilityRequest]) as BodyColumn[];

  return (
    <BodyRowSlot
      row={row}
      mode={mode}
      columns={columns}
      fullWidth={fullWidth}
    />
  );
};

export default BodyRow;
