import * as React from "react";
import { useMemo } from "react";

import useProps from "../../../../hooks/useProps";
import useConstraintManager from "../../../../hooks/useConstraintManager";

import DisplayMode from "../../../../../../model/DisplayMode";

import { HeadRowSlot, HeadColumn } from "../../../../slots/HeadRowSlot";
import useFilterData from "../../../../hooks/useFilterData";
import usePagination from "../../../../hooks/usePagination";
import useSearch from "../../../../hooks/useSearch";
import usePayload from "../../../../hooks/usePayload";
import { IVisibilityRequest } from "../../../../helpers/createConstraintManager";

export interface IHeadRowProps {
  fullWidth: number;
  mode: DisplayMode;
}

/**
 * Represents a HeadRow component.
 * @param IHeadRowProps - The props for the HeadRow component.
 * @returns The rendered HeadRow component.
 */
export const HeadRow = ({ fullWidth, mode }: IHeadRowProps) => {
  const { columns: listColumns } = useProps();

  const { wrapColumns } = useConstraintManager();

  const filterData = useFilterData();
  const pagination = usePagination();
  const { sortModel, chips } = useProps();
  const search = useSearch();
  const payload = usePayload();

  /**
   * visibilityRequest - Represents a memoized visibility request.
   *
   * @typedef {Object} IVisibilityRequest
   * @property filterData - The filter data object.
   * @property pagination - The pagination object.
   * @property sortModel - The sort model array.
   * @property chips - The chips object.
   * @property search - The search string.
   * @property payload - The payload object.
   *
   * @param filterData - The filter data to include in the visibility request.
   * @param pagination - The pagination to include in the visibility request.
   * @param sortModel - The sort model to include in the visibility request.
   * @param chips - The chips to include in the visibility request.
   * @param search - The search string to include in the visibility request.
   * @param payload - The payload to include in the visibility request.
   *
   * @returns - The memoized visibility request object.
   */
  const visibilityRequest = useMemo(
    (): IVisibilityRequest => ({
      filterData,
      pagination,
      sortModel: sortModel || [],
      chips: chips || {},
      search,
      payload,
    }),
    [filterData, pagination, sortModel, chips, search, payload]
  );

  /**
   * Represents the columns used in a particular component.
   *
   * @typedef {Object} HeadColumn
   * @property title - The title of the column.
   * @property width - The width of the column.
   * @property isVisible - Indicates whether the column is visible.
   */
  const columns = useMemo(
    () =>
      wrapColumns({
        columns: listColumns,
        visibilityRequest,
        fullWidth,
        mode,
      }),
    [fullWidth, visibilityRequest]
  ) as HeadColumn[];

  return <HeadRowSlot mode={mode} columns={columns} fullWidth={fullWidth} />;
};

export default HeadRow;
