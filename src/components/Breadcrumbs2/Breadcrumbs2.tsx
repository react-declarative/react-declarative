import * as React from "react";
import { makeStyles } from "../../styles";

import { SxProps } from "@mui/material";

import CircularProgress from "@mui/material/CircularProgress";
import MatBreadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";

import useActualCallback from "../../hooks/useActualCallback";
import useActualState from "../../hooks/useActualState";

import ActionButton from "../ActionButton";
import ActionMenu from "../ActionMenu";
import Async from "../Async";

import classNames from "../../utils/classNames";

import IBreadcrumbs2Action from "./model/IBreadcrumbs2Action";
import IBreadcrumbs2Option from "./model/IBreadcrumbs2Option";
import Breadcrumbs2Type from "./model/Breadcrumbs2Type";
import ActionGroup from "../ActionGroup";

const Loader = () => <CircularProgress size={20} />;
const Fragment = () => <></>;

/**
 * An interface representing the props for the IBreadcrumbs2 component.
 *
 * @template T - The type of payload.
 * @property [className] - The class name to be applied to the component.
 * @property [style] - The inline style to be applied to the component.
 * @property [sx] - The custom styling props for the component.
 * @property [onAction] - The callback function triggered when an action is performed.
 * @property actions - The list of actions for the breadcrumbs.
 * @property items - The list of options for the breadcrumbs.
 * @property [payload] - The payload for the breadcrumbs.
 * @property [BeforeMenuContent] - The component to be rendered before the menu content.
 * @property [AfterMenuContent] - The component to be rendered after the menu content.
 * @property [onLoadStart] - The callback function triggered when the component starts loading.
 * @property [onLoadEnd] - The callback function triggered when the component finishes loading.
 * @property [fallback] - The callback function triggered when an error occurs.
 * @property [throwError] - A flag indicating whether the component should throw an error.
 */
interface IBreadcrumbs2Props<T extends any = any> {
  className?: string;
  style?: React.CSSProperties;
  sx?: SxProps<any>;
  onAction?: (action: string) => void | Promise<void>;
  actions?: IBreadcrumbs2Action<T>[];
  items: IBreadcrumbs2Option<T>[];
  payload?: T;
  BeforeMenuContent?: React.ComponentType<any>;
  AfterMenuContent?: React.ComponentType<any>;
  onLoadStart?: () => void;
  onLoadEnd?: (isOk: boolean) => void;
  fallback?: (e: Error) => void;
  throwError?: boolean;
}

const useStyles = makeStyles()((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    flexDirection: "row",
    paddingTop: "10px",
    paddingBottom: "10px",
    flexWrap: 'wrap',
    gap: theme.spacing(1),
  },
  link: {
    cursor: "pointer",
  },
  stretch: {
    flexGrow: 1,
    shrink: 1,
  },
  disabled: {
    pointerEvents: "none",
    opacity: 0.5,
  },
}));

/**
 * Renders a breadcrumbs component with customizable items and actions.
 *
 * @template T - The type of payload data.
 * @param props - The props object.
 * @param [props.className] - The class name for the component container.
 * @param [props.style] - The inline styles for the component container.
 * @param [props.sx] - The sx prop for the component container.
 * @param [props.onAction=() => undefined] - The callback function to be called when an action is performed.
 * @param props.items - The array of breadcrumb items.
 * @param props.actions - The array of actions to be displayed in the action menu.
 * @param props.payload - The payload data.
 * @param [props.BeforeMenuContent] - The custom content to be displayed before the action menu.
 * @param [props.AfterMenuContent] - The custom content to be displayed after the action menu.
 * @param [props.onLoadStart] - The callback function to be called when the component is loading.
 * @param [props.onLoadEnd] - The callback function to be called when the component finishes loading.
 * @param [props.fallback] - The fallback component to be displayed while loading.
 * @param [props.throwError] - Whether to throw an error on loading failure.
 * @returns The breadcrumbs component.
 */
export const Breadcrumbs2 = <T extends any = any>({
  className,
  style,
  sx,
  onAction = () => undefined,
  items,
  actions,
  payload,
  BeforeMenuContent,
  AfterMenuContent,
  onLoadStart,
  onLoadEnd,
  fallback,
  throwError,
}: IBreadcrumbs2Props<T>) => {
  const { classes } = useStyles();

  const [loading$, setLoading] = useActualState(0);

  /**
   * Increases the loading count and triggers the onLoadStart event.
   */
  const handleLoadStart = () => {
    setLoading((loading) => loading + 1);
    onLoadStart && onLoadStart();
  };

  /**
   * Decreases the loading count by one and triggers the onLoadEnd callback function.
   *
   * @param isOk - Determines if the loading operation was successful.
   * @returns
   */
  const handleLoadEnd = (isOk: boolean) => {
    setLoading((loading) => Math.max(loading - 1, 0));
    onLoadEnd && onLoadEnd(isOk);
  };

  /**
   * Asynchronous callback for handling an action.
   *
   * @param action - The action to be processed.
   * @returns - A promise that resolves once the action is processed.
   */
  const onAction$ = useActualCallback(async (action: string) => {
    if (loading$.current > 1) {
      return;
    }
    await onAction(action);
  });

  return (
    <Box className={classNames(classes.root, className)} style={style} sx={sx}>
      <Box className={classes.stretch}>
        <Async payload={payload} Loader={Loader}>
          {async () => {
            const itemList = await Promise.all(
              items
                .filter(
                  ({ type }) =>
                    type === Breadcrumbs2Type.Link ||
                    type === Breadcrumbs2Type.Component
                )
                .map(
                  async ({
                    action,
                    label,
                    type,
                    element,
                    compute = () => label,
                    isDisabled = () => false,
                    isVisible = () => true,
                    sx,
                  }) => ({
                    visible: await isVisible(payload!),
                    disabled: await isDisabled(payload!),
                    element,
                    action,
                    type,
                    label: await compute(payload!),
                    sx,
                  })
                )
            );
            return (
              <MatBreadcrumbs className={classes.stretch}>
                {itemList
                  .filter(({ type }) => type === Breadcrumbs2Type.Link)
                  .filter(({ visible }) => visible)
                  .map(
                    ({ action = "unknown-action", label, disabled, sx }, idx) => (
                      <Link
                        key={`${action}-${idx}`}
                        className={classNames(classes.link, {
                          [classes.disabled]: disabled,
                        })}
                        onClick={(event) => {
                          event.preventDefault();
                          onAction$(action);
                          return false;
                        }}
                        color="inherit"
                        sx={sx}
                      >
                        {label}
                      </Link>
                    )
                  )}
              </MatBreadcrumbs>
            );
          }}
        </Async>
        <Async payload={payload} Loader={Loader}>
          {async () => {
            const itemList = await Promise.all(
              items
                .filter(({ type }) => type === Breadcrumbs2Type.Component)
                .map(
                  async ({
                    element: Element = () => <React.Fragment />,
                    isDisabled = () => false,
                    isVisible = () => true,
                  }) => {
                    const disabled = await isDisabled(payload!);
                    return {
                      element: () => (
                        <Element disabled={disabled} payload={payload!} />
                      ),
                      visible: await isVisible(payload!),
                    };
                  }
                )
            );
            return (
              <>
                {itemList
                  .filter(({ visible }) => visible)
                  .map(({ element: Element }, idx) => (
                    <Element key={idx} />
                  ))}
              </>
            );
          }}
        </Async>
      </Box>
      <Async payload={payload} Loader={Fragment}>
        {async () => {
          const itemList = await Promise.all(
            items
              .filter(({ type }) => type === Breadcrumbs2Type.Button)
              .map(
                async ({
                  action,
                  label,
                  icon,
                  isDisabled = () => false,
                  isVisible = () => true,
                  sx,
                }) => ({
                  visible: await isVisible(payload!),
                  disabled: await isDisabled(payload!),
                  icon,
                  action,
                  label,
                  sx,
                })
              )
          );
          return (
            <>
              {itemList
                .filter(({ visible }) => visible)
                .map(
                  (
                    { action = "unknown-action", label, disabled, icon: Icon, sx },
                    idx
                  ) => (
                    <ActionButton
                      key={`${action}-${idx}`}
                      variant="contained"
                      startIcon={Icon && <Icon />}
                      disabled={disabled}
                      onClick={() => onAction$(action)}
                      onLoadStart={handleLoadStart}
                      onLoadEnd={handleLoadEnd}
                      fallback={fallback}
                      throwError={throwError}
                      sx={sx}
                    >
                      {label}
                    </ActionButton>
                  )
                )}
            </>
          );
        }}
      </Async>
      <Async payload={payload} Loader={Fragment}>
        {async () => {
          const itemList = await Promise.all(
            items
              .filter(({ type }) => type === Breadcrumbs2Type.ActionGroup)
              .map(
                async ({
                  action,
                  label,
                  icon,
                  actions = [],
                  isDisabled = () => false,
                  isVisible = () => true,
                  sx,
                }) => ({
                  visible: await isVisible(payload!),
                  disabled: await isDisabled(payload!),
                  actions: actions.map(
                    ({
                      isVisible = () => true,
                      isDisabled = () => false,
                      ...other
                    }) => ({
                      ...other,
                      isVisible: () => isVisible(payload!),
                      isDisabled: () => isDisabled(payload!),
                    })
                  ),
                  icon,
                  action,
                  label,
                  sx,
                })
              )
          );
          return (
            <>
              {itemList
                .filter(({ visible }) => visible)
                .map(
                  (
                    { action = "unknown-action", disabled, actions, sx },
                    idx
                  ) => (
                    <ActionGroup
                      key={`${action}-${idx}`}
                      payload={payload}
                      options={actions}
                      disabled={disabled}
                      onAction={onAction$}
                      BeforeContent={BeforeMenuContent}
                      AfterContent={AfterMenuContent}
                      onLoadStart={handleLoadStart}
                      onLoadEnd={handleLoadEnd}
                      fallback={fallback}
                      throwError={throwError}
                      sx={sx}
                    />
                  )
                )}
            </>
          );
        }}
      </Async>
      {!!actions?.length && (
        <ActionMenu
          payload={payload}
          options={actions.map(
            ({
              isVisible = () => true,
              isDisabled = () => false,
              ...other
            }) => ({
              ...other,
              isVisible: () => isVisible(payload!),
              isDisabled: () => isDisabled(payload!),
            })
          )}
          onAction={onAction$}
          BeforeContent={BeforeMenuContent}
          AfterContent={AfterMenuContent}
          onLoadStart={handleLoadStart}
          onLoadEnd={handleLoadEnd}
          fallback={fallback}
          throwError={throwError}
        />
      )}
    </Box>
  );
};

export default Breadcrumbs2;
