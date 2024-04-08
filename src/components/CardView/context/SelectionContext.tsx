import * as React from "react";
import { createContext, useContext, useState, useMemo } from "react";

import useActualCallback from "../../../hooks/useActualCallback";
import useStateContext from "./StateContext";

import IItemData from "../model/IItemData";

/**
 * Represents the current context of the application.
 */
interface Context {
  selectedItems: IItemData[];
  toggleSelection: (id: IItemData["id"]) => void;
  dropSelection: () => void;
}

const SelectionContext = createContext<Context>(null as never);

/**
 * Represents the props for the ISelectionContextProvider component.
 */
interface ISelectionContextProviderProps {
  children: React.ReactNode;
}

/**
 * Provides context for item selection.
 *
 * @typedef ISelectionContextProviderProps
 * @property children - The child elements to render within the provider.
 */
export const SelectionContextProvider = ({
  children,
}: ISelectionContextProviderProps) => {

  const { state, action } = useStateContext();

  const [selectedItems, setSelectedItems] = useState(
    () => new Map<IItemData["id"], IItemData>()
  );

  /**
   * Toggles the selection of an item.
   *
   * @param id - The ID of the item to toggle the selection for.
   * @returns
   */
  const toggleSelection = useActualCallback((id: IItemData["id"]) => {
    const pendingSelectedIds = new Set(state.selectedIds);
    const pendingSelectedItems = new Map(selectedItems);
    if (pendingSelectedIds.has(id)) {
      pendingSelectedIds.delete(id);
      pendingSelectedItems.delete(id);
    } else {
      pendingSelectedIds.add(id);
      pendingSelectedItems.set(id, state.items.find((item) => item.id === id));
    }
    action.setSelectedIds(pendingSelectedIds);
    setSelectedItems(pendingSelectedItems);
  });

  /**
   * Executes the provided callback function `useActualCallback` when `dropSelection` is invoked.
   * The callback function sets the selected IDs to an empty set and the selected items to an empty map.
   *
   * @function dropSelection
   * @param useActualCallback - The callback function to be executed when `dropSelection` is invoked.
   * @returns
   */
  const dropSelection = useActualCallback(() => {
    action.setSelectedIds(new Set());
    setSelectedItems(new Map());
  });

  /**
   * Represents a memoized value for the context.
   *
   * @typedef ContextValue
   * @property selectedItems - An array of selected items.
   * @property toggleSelection - A function to toggle the selection of items.
   * @property dropSelection - A function to drop the selection of items.
   */
  const contextValue = useMemo(() => ({
    selectedItems: [...selectedItems.values()],
    toggleSelection,
    dropSelection,
  }), [selectedItems]);

  return (
    <SelectionContext.Provider value={contextValue}>
      {children}
    </SelectionContext.Provider>
  );
};

export const useSelectionContext = () => useContext(SelectionContext);

export default useSelectionContext;
