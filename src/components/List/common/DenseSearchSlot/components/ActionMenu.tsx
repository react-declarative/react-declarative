import * as React from 'react';

import { IActionMenuSlot } from "../../../slots/ActionMenuSlot";

import BaseActionMenu from '../../../../ActionMenu';

import useActualCallback from "../../../../../hooks/useActualCallback";
import useCachedRows from "../../../hooks/useCachedRows";
import useModalSort from "../../../hooks/useModalSort";
import useDropFilters from "../../../hooks/useDropFilters";
import useReload from "../../../hooks/useReload";
import usePayload from "../../../hooks/usePayload";
import useProps from "../../../hooks/useProps";

import CleaningServices from "@mui/icons-material/CleaningServicesOutlined";
import Refresh from "@mui/icons-material/Refresh";
import Sort from "@mui/icons-material/Sort";
import Add from "@mui/icons-material/Add";

const LOAD_SOURCE = "action-menu";

export const ActionMenu = ({ options = [], deps = [] }: IActionMenuSlot) => {
  const { selectedRows } = useCachedRows();

  const showSortModal = useModalSort();
  const dropFilters = useDropFilters();
  const reloadList = useReload();
  const payload = usePayload();

  const { onAction, fallback, onLoadStart, onLoadEnd, loading } =
    useProps();

  const handleAction = useActualCallback((action: string) => {
    if (action === "update-now") {
      reloadList();
    } else if (action === "resort-action") {
      showSortModal();
    } else if (action === "drop-filters") {
      dropFilters();
    }
    onAction && onAction(action, selectedRows, reloadList);
  });

  const handleLoadStart = () => onLoadStart && onLoadStart(LOAD_SOURCE);

  const handleLoadEnd = (isOk: boolean) =>
    onLoadEnd && onLoadEnd(isOk, LOAD_SOURCE);

  return (
    <BaseActionMenu
      options={options.map(
        ({
          action,
          isDisabled = () => false,
          isVisible = () => true,
          ...other
        }) => {
          if (action === "update-now") {
            return {
              action,
              ...other,
              icon: other.icon || Refresh,
              isDisabled: () => isDisabled(selectedRows, payload),
              isVisible: () => isVisible(selectedRows, payload),
              label: other.label || "Refresh manually",
            };
          } else if (action === "add-action") {
            return {
              action,
              ...other,
              icon: other.icon || Add,
              isDisabled: () => isDisabled(selectedRows, payload),
              isVisible: () => isVisible(selectedRows, payload),
              label: other.label || "Create new row",
            };
          } else if (action === "resort-action") {
            return {
              action,
              ...other,
              icon: other.icon || Sort,
              isDisabled: () => isDisabled(selectedRows, payload),
              isVisible: () => isVisible(selectedRows, payload),
              label: other.label || "Change sort order",
            };
          } else if (action === "drop-filters") {
            return {
              action,
              ...other,
              icon: other.icon || CleaningServices,
              isDisabled: () => isDisabled(selectedRows, payload),
              isVisible: () => isVisible(selectedRows, payload),
              label: other.label || "Drop filters",
            };
          } else {
            return {
              action,
              ...other,
              isDisabled: () => isDisabled(selectedRows, payload),
              isVisible: () => isVisible(selectedRows, payload),
            };
          }
        },
      )}
      onAction={handleAction}
      fallback={fallback}
      payload={selectedRows}
      deps={[...deps, payload]}
      onLoadStart={handleLoadStart}
      onLoadEnd={handleLoadEnd}
      disabled={loading}
    />
  );
};

export default ActionMenu;
