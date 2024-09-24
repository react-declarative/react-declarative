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

/**
 * Interface for defining parameters for a component.
 *
 * @interface
 */
export interface IParams {
  name: Exclude<IField["name"], undefined>;
  menuItems: Exclude<IField["menuItems"], undefined>;
  onValueChange: (value: Value) => void;
  menu: Exclude<IField["menu"], undefined>;
}

/**
 * Represents the IRequest interface.
 * This interface extends IParams interface, and adds an event property of type React.MouseEvent<HTMLDivElement>.
 */
export interface IRequest extends IParams {
  event: React.MouseEvent<HTMLDivElement>;
}

/**
 * Represents the initial state for the params object.
 * @typedef IParams
 * @property name - The initial value for the 'name' property.
 * @property menu - The initial value for the 'menu' property, which is a function that returns null.
 * @property menuItems - The initial value for the 'menuItems' property, which is an empty array.
 * @property onValueChange - The initial value for the 'onValueChange' property, which is a function that returns null.
 */
const INITIAL_STATE: IParams = {
  name: "",
  menu: () => null,
  menuItems: [],
  onValueChange: () => null,
};

/**
 * Represents the properties for the MenuItems component
 */
interface IMenuItemsProps {
  requestSubject: TSubject<IRequest>;
}

const MENU_MIN_WIDTH = 225;
const MENU_OPEN_DELAY = 350;

/**
 * This variable defines the styles for a container component and its child elements.
 * It uses the `makeStyles` function from the Material-UI library to create a CSS
 * styles object.
 *
 * The `container` style defines the positioning and layout properties for the container
 * component. It sets the position to "relative", displays the component as a flexible box,
 * aligns the items and justifies the content to stretch, sets the maximum height to 45% of
 * the viewport height, and applies overflow behaviors to handle overflowing content.
 *
 * The `content` style sets the flex property to 1 to allow it to expand and fill the available
 * space within the container. It displays the component as a flex container with a column
 * direction, and justifies the content to stretch.
 *
 * The `loader` style positions the loader component absolutely within the container component.
 * It sets the top, left, right, and bottom properties to 0 to position it at the edges of the
 * container. The height and width properties are set to "100%" to make it fill the container,
 * and it is displayed as a flex container with centered content using `alignItems` and `justifyContent`.
 *
 * @type {function(): object} useStyles - A function that returns an object with CSS styles.
 * @returns The CSS styles object for the container component and its child elements.
 */
const useStyles = makeStyles()({
  container: {
    position: "relative",
    display: "flex",
    alignItems: "stretch",
    justifyContent: "stretch",
    maxHeight: '45vh',
    overflowY: 'auto',
    overflowX: 'hidden',
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

/**
 * Renders a menu with a list of options based on the provided props.
 *
 * @param props - The menu items props.
 * @param props.requestSubject - An observer subject to listen for menu requests.
 *
 * @returns The rendered menu.
 */
export const MenuItems = ({ requestSubject }: IMenuItemsProps) => {
  const { classes } = useStyles();

  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(0);

  const [params$, setParams] = useActualRef<IParams>(INITIAL_STATE);
  const [counter$, setCounter] = useActualRef(0);

  const { object, changeObject } = useOneState<object>();
  const payload = useOnePayload();

  /**
   * A callback function to handle the start of a load operation.
   *
   * @callback HandleLoadStart
   * @memberof global
   *
   * @returns
   */
  const handleLoadStart = useCallback(() => {
    setLoading((loading) => loading + 1);
  }, []);

  /**
   * A callback function to handle the end of a loading process.
   * Decreases the loading value by 1 or sets it to 0 if already at 0.
   * This function is intended to be used with the `useCallback` hook.
   *
   * @function handleLoadEnd
   * @returns
   */
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

  /**
   * Calculate the managed options based on the given parameters.
   *
   * @returns - The array of managed options.
   *
   * @param object$ - The object used for evaluating the isDisabled and isVisible functions.
   * @param payload - The payload object.
   * @param params$.current.menuItems - The array of menu items.
   *
   * @throws - If the menuItems parameter is not an array.
   *
   */
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
