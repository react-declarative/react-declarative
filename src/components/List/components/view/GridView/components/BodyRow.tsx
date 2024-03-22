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

/**
 * Represents the properties for a body row in a table.
 *
 * @template RowData - The type of data associated with the row.
 */
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

  /**
   * Represents a memoized visibility request.
   *
   * @typedef {Object} IVisibilityRequest
   * @property {Object} filterData - The filter data for the request.
   * @property {Object} pagination - The pagination options for the request.
   * @property {Array} sortModel - The sort model for the request.
   * @property {Object} chips - The chips for the request.
   * @property {string} search - The search query for the request.
   * @property {Object} payload - The payload for the request.
   */
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

  /**
   * Returns an array of BodyColumn objects based on the listColumns, visibilityRequest, fullWidth, and mode parameters.
   *
   * @returns {BodyColumn[]} - Array of BodyColumn objects.
   * @param {ListColumn[]} listColumns - Array of ListColumn objects.
   * @param {VisibilityRequest} visibilityRequest - Visibility request object.
   * @param {boolean} fullWidth - Indicates if the column should take up the full width.
   * @param {string} mode - Mode of the column.
   */
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
