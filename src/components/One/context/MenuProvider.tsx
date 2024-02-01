import * as React from "react";
import { useContext, useMemo } from "react";
import { createContext } from "react";

import useSubject from "../../../hooks/useSubject";

import TSubject from "../../../model/TSubject";

import MenuItems, { IRequest, IParams } from "../components/common/MenuItems";

interface IContext {
  createContextMenu: (
    params: IParams
  ) => React.MouseEventHandler<HTMLDivElement>;
  menuClickSubject: TSubject<{
    path: string;
    action: string;
  }>;
}

const MenuContext = createContext<IContext>(null as never);

interface IMenuProviderProps {
  children: React.ReactNode;
}

export const MenuProvider = ({ children }: IMenuProviderProps) => {
  const requestSubject = useSubject<IRequest>();
  const menuClickSubject = useSubject<{ path: string; action: string }>();

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
      menuClickSubject,
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
