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
import useRowDisabledMap from "../../../../hooks/useRowDisabledMap";

export interface IBodyRowProps<RowData extends IRowData = IAnything> {
  fullWidth: number;
  mode: DisplayMode;
  row: RowData;
}

/**
 * Renders a row in the body of a table.
 *
 * @template RowData - The type of data for the row.
 * @param props - The props for the BodyRow component.
 * @returns - The rendered row.
 */
export const BodyRow = <RowData extends IRowData = IAnything>({
  fullWidth,
  mode,
  row,
}: IBodyRowProps<RowData>) => {
  const { columns: listColumns, isRowDisabled = () => false } = useProps();

  const { wrapColumns } = useConstraintManager();

  const filterData = useFilterData();
  const pagination = usePagination();
  const { sort, chips } = useProps();
  const search = useSearch();
  const payload = usePayload();
  const [disabledMap] = useRowDisabledMap();

  const visibilityRequest = useMemo((): IVisibilityRequest => ({
    filterData,
    pagination,
    sortModel: sort || [],
    chips: chips || {},
    search,
    payload,
  }), [
    filterData,
    pagination,
    sort,
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
    disabledMap.set(row.id, isRowDisabled(row, visibilityRequest));
    return columns;
  }, [fullWidth, visibilityRequest]) as BodyColumn[];

  return (
    <BodyRowSlot
      row={row}
      mode={mode}
      disabled={!!disabledMap.get(row.id)}
      columns={columns}
      fullWidth={fullWidth}
    />
  );
};

export default BodyRow;
