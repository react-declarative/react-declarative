import * as React from "react";
import { useContext, useMemo } from "react";
import { createContext } from "react";

import MenuItems, { IRequest, IParams } from "../components/common/MenuItems";

import useSubject from "../../../hooks/useSubject";

import TSubject from "../../../model/TSubject";

interface IContext {
  createContextMenu: (
    params: IParams
  ) => React.MouseEventHandler<HTMLDivElement>;
  requestSubject: TSubject<void>;
}

const MenuContext = createContext<IContext>(null as never);

interface IMenuProviderProps {
  children: React.ReactNode;
}

export const MenuProvider = ({ children }: IMenuProviderProps) => {
  const requestSubject = useSubject<IRequest>();

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