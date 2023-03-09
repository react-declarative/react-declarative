import * as React from "react";
import { createContext, useContext, useState, useMemo } from "react";

import useActualCallback from "../../../hooks/useActualCallback";
import useStateContext from "./StateContext";

import IItemData from "../model/IItemData";

interface Context {
  selectedItems: IItemData[];
  toggleSelection: (id: IItemData["id"]) => void;
  dropSelection: () => void;
}

const SelectionContext = createContext<Context>(null as never);

interface ISelectionContextProviderProps {
  children: React.ReactNode;
}

export const SelectionContextProvider = ({
  children,
}: ISelectionContextProviderProps) => {

  const { state, action } = useStateContext();

  const [selectedItems, setSelectedItems] = useState(
    () => new Map<IItemData["id"], IItemData>()
  );

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

  const dropSelection = useActualCallback(() => {
    action.setSelectedIds(new Set());
    setSelectedItems(new Map());
  });

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
