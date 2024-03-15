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
