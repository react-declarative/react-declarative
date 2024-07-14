import * as React from "react";
import { useContext, useMemo } from "react";
import { createContext } from "react";

import MenuItems, { IRequest, IParams } from "../components/common/MenuItems";

import useSubject from "../../../hooks/useSubject";

import type TSubject from "../../../model/TSubject";

/**
 * Represents an interface for a context object.
 */
interface IContext {
  createContextMenu: (
    params: IParams
  ) => React.MouseEventHandler<HTMLDivElement>;
  requestSubject: TSubject<void>;
}

const MenuContext = createContext<IContext>(null as never);

/**
 * Interface for the props of the MenuProvider component.
 */
interface IMenuProviderProps {
  children: React.ReactNode;
}

/**
 * MenuProvider is a React component that provides menu related functionality to its children components.
 *
 * @param props - The props for the MenuProvider component.
 * @returns - The rendered JSX element.
 */
export const MenuProvider = ({ children }: IMenuProviderProps) => {
  const requestSubject = useSubject<IRequest>();

  /**
   * Represents a context object with utility functions.
   *
   * @typedef IContext
   * @property createContextMenu - Function to create a context menu.
   * @property requestSubject - The request subject.
   */
  const value = useMemo(
    (): IContext => ({
      createContextMenu:
        ({ menuItems = [], onValueChange = () => null, menu, name }: IParams) =>
        async (event) => {
          if (!menuItems) {
            return;
          }
          event.preventDefault();
          event.stopPropagation();
          if (!menuItems?.length) {
            return;
          }
          return await requestSubject.next({
            name,
            menu,
            event,
            menuItems,
            onValueChange,
          });
        },
      requestSubject: requestSubject as unknown as TSubject<void>,
    }),
    []
  );

  return (
    <MenuContext.Provider value={value}>
      {children}
      <MenuItems requestSubject={requestSubject} />
    </MenuContext.Provider>
  );
};

export const useOneMenu = () => useContext(MenuContext);

export default MenuProvider;
