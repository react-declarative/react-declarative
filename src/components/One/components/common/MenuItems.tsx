import * as React from "react";
import { useCallback, useMemo, useEffect, useState } from "react";

import { makeStyles } from "../../../../styles";

import CircularProgress from "@mui/material/CircularProgress";
import ListItemIcon from "@mui/material/ListItemIcon";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import Menu from "@mui/material/Menu";

import Async from "../../../Async";

import useSinglerunAction from "../../../../hooks/useSinglerunAction";
import useActualValue from "../../../../hooks/useActualValue";
import useActualRef from "../../../../hooks/useActualRef";

import { useOneState } from "../../context/StateProvider";
import { useOnePayload } from "../../context/PayloadProvider";

import IField, { Value } from "../../../../model/IField";
import IFieldMenu from "../../../../model/IFieldMenu";
import TSubject from "../../../../model/TSubject";
import IOption from "../../../../model/IOption";

import queued from "../../../../utils/hof/queued";
import sleep from "../../../../utils/sleep";

type IManagedOption = IOption & { onClick?: IFieldMenu["onClick"] };

export interface IParams {
  name: Exclude<IField["name"], undefined>;
  menuItems: Exclude<IField["menuItems"], undefined>;
  onValueChange: (value: Value) => void;
  menu: Exclude<IField["menu"], undefined>;
}

export interface IRequest extends IParams {
  event: React.MouseEvent<HTMLDivElement>;
}

const INITIAL_STATE: IParams = {
  name: "",
  menu: () => null,
  menuItems: [],
  onValueChange: () => null,
};

interface IMenuItemsProps {
  requestSubject: TSubject<IRequest>;
}

const MENU_MIN_WIDTH = 225;
const MENU_OPEN_DELAY = 350;

const useStyles = makeStyles()({
  container: {
    position: "relative",
    display: "flex",
    alignItems: "stretch",
    justifyContent: "stretch",
  },
  content: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "stretch",
  },
  loader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: "100%",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});

export const MenuItems = ({ requestSubject }: IMenuItemsProps) => {
  const { classes } = useStyles();

  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(0);

  const [params$, setParams] = useActualRef<IParams>(INITIAL_STATE);
  const [counter$, setCounter] = useActualRef(0);

  const { object, changeObject} = useOneState<object>();
  const payload = useOnePayload();

  const handleLoadStart = useCallback(() => {
    setLoading((loading) => loading + 1);
  }, []);

  const handleLoadEnd = useCallback(() => {
    setLoading((loading) => Math.max(loading - 1, 0));
  }, []);

  const { execute } = useSinglerunAction(async (action: string) => {
    await params$.current.menu(
      params$.current.name,
      action,
      object$.current,
      payload,
      params$.current.onValueChange,
      changeObject,
    );
    setAnchorEl(null);
  }, {
    onLoadStart: handleLoadStart,
    onLoadEnd: handleLoadEnd,
  });

  const object$ = useActualValue(object);

  const options = useMemo(
    (): IManagedOption[] =>
      params$.current.menuItems.map(
        ({ isDisabled = () => false, isVisible = () => true, ...other }) => ({
          ...other,
          isDisabled: () => isDisabled(object$.current, payload),
          isVisible: () => isVisible(object$.current, payload),
        })
      ),
    [params$.current.menuItems]
  );

  const options$ = useActualValue(options);

  useEffect(
    () =>
      requestSubject.subscribe(
        queued(async ({ event, menuItems, menu, name, onValueChange }) => {
          /** Nested `<Popover />` unmount delay */
          await sleep(MENU_OPEN_DELAY);
          setCounter((c) => c + 1);
          setParams({
            name,
            menuItems,
            onValueChange,
            menu,
          });
          const pointElement = document.elementFromPoint(event.clientX, event.clientY);
          if (pointElement) {
            setAnchorEl(pointElement as unknown as HTMLDivElement);
          } else {
            setAnchorEl(event.target as HTMLDivElement);
          }
        })
      ),
    []
  );

  return (
    <Menu
      key={counter$.current}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      anchorEl={anchorEl}
      open={!!anchorEl}
      onClose={() => setAnchorEl(null)}
      MenuListProps={{
        disablePadding: true,
      }}
    >
      <div className={classes.container}>
        {loading !== 0 && (
          <div className={classes.loader}>
            <CircularProgress size={14} />
          </div>
        )}
        <div className={classes.content}>
          {options$.current.map(
            (
              {
                label = "unknown-label",
                action = "unknown-action",
                divider,
                onClick,
                icon: Icon,
                isDisabled = () => false,
                isVisible = () => true,
              },
              idx
            ) => {
              const Placeholder = () =>
                !divider ? (
                  <MenuItem
                    sx={{
                      visibility: "hidden",
                      minWidth: MENU_MIN_WIDTH,
                    }}
                  >
                    {!!Icon && (
                      <ListItemIcon>
                        <Icon />
                      </ListItemIcon>
                    )}
                    <Typography variant="inherit">{label}</Typography>
                  </MenuItem>
                ) : null;
              return (
                <Async
                  Loader={Placeholder}
                  onLoadStart={handleLoadStart}
                  onLoadEnd={handleLoadEnd}
                  key={`${counter$.current}-${idx}`}
                  payload={payload}
                >
                  {async (payload) => {
                    /** mui v5 menu invalid position quickfix */
                    await sleep(0);
                    const disabled = await isDisabled(payload);
                    const visible = await isVisible(payload);
                    if (visible) {
                      if (divider) {
                        return <Divider orientation="horizontal" />;
                      }
                      return (
                        <MenuItem
                          disabled={disabled}
                          onClick={() => {
                            if (onClick) {
                              onClick(object$.current, payload, params$.current.onValueChange, changeObject);
                              setAnchorEl(null);
                              return;
                            }
                            execute(action);
                          }}
                          sx={{
                            minWidth: MENU_MIN_WIDTH,
                          }}
                        >
                          {!!Icon && (
                            <ListItemIcon>
                              <Icon />
                            </ListItemIcon>
                          )}
                          <Typography variant="inherit">{label}</Typography>
                        </MenuItem>
                      );
                    } else {
                      return null;
                    }
                  }}
                </Async>
              );
            }
          )}
        </div>
      </div>
    </Menu>
  );
};

export default MenuItems;
