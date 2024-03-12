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

const Loader = () => <CircularProgress size={20} />;
const Fragment = () => <></>;

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
 * @param {object} props - The props object.
 * @param {string} [props.className] - The class name for the component container.
 * @param {object} [props.style] - The inline styles for the component container.
 * @param {object} [props.sx] - The sx prop for the component container.
 * @param {Function} [props.onAction=() => undefined] - The callback function to be called when an action is performed.
 * @param {Array} props.items - The array of breadcrumb items.
 * @param {Array} props.actions - The array of actions to be displayed in the action menu.
 * @param {T} props.payload - The payload data.
 * @param {React.ElementType} [props.BeforeMenuContent] - The custom content to be displayed before the action menu.
 * @param {React.ElementType} [props.AfterMenuContent] - The custom content to be displayed after the action menu.
 * @param {Function} [props.onLoadStart] - The callback function to be called when the component is loading.
 * @param {Function} [props.onLoadEnd] - The callback function to be called when the component finishes loading.
 * @param {React.Component} [props.fallback] - The fallback component to be displayed while loading.
 * @param {boolean} [props.throwError] - Whether to throw an error on loading failure.
 * @returns {React.Component} The breadcrumbs component.
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

  const handleLoadStart = () => {
    setLoading((loading) => loading + 1);
    onLoadStart && onLoadStart();
  };

  const handleLoadEnd = (isOk: boolean) => {
    setLoading((loading) => Math.max(loading - 1, 0));
    onLoadEnd && onLoadEnd(isOk);
  };

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
