import * as React from "react";

import BaseActionMenu from "../../../../../ActionMenu";

import CleaningServices from "@mui/icons-material/CleaningServicesOutlined";
import Refresh from "@mui/icons-material/Refresh";
import Sort from "@mui/icons-material/Sort";
import Add from "@mui/icons-material/Add";

import useProps from "../../../../hooks/useProps";
import usePayload from "../../../../hooks/usePayload";
import useModalSort from "../../../../hooks/useModalSort";
import useReload from "../../../../hooks/useReload";
import useCachedRows from "../../../../hooks/useCachedRows";
import useDropFilters from "../../../../hooks/useDropFilters";

import useActualCallback from "../../../../../../hooks/useActualCallback";

import IActionMenuSlot from "../../../../slots/ActionMenuSlot/IActionMenuSlot";

const LOAD_SOURCE = "action-menu";

/**
 * Represents an ActionMenu component.
 * @param options - An array of action options.
 * @param deps - An array of dependencies for the component.
 * @returns - The rendered ActionMenu component.
 */
export const ActionMenu = ({ options = [], deps = [] }: IActionMenuSlot) => {
  const { selectedRows } = useCachedRows();

  const showSortModal = useModalSort();
  const dropFilters = useDropFilters();
  const reloadList = useReload();
  const payload = usePayload();

  const { onAction, fallback, onLoadStart, onLoadEnd, loading } = useProps();

  /**
   * Executes an action based on the given input.
   *
   * @param {string} action - The action to be executed.
   */
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

  /**
   * Callback function for handling load start event.
   *
   * @function handleLoadStart
   * @returns
   */
  const handleLoadStart = () => onLoadStart && onLoadStart(LOAD_SOURCE);
  /**
   * Handles the load end event.
   *
   * @param isOk - A boolean indicating whether the load is successful or not.
   * @returns
   */
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
        }
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
