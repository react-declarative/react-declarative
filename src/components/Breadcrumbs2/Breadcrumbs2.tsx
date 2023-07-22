import * as React from "react";
import { makeStyles } from "../../styles";

import CircularProgress from "@mui/material/CircularProgress";
import MatBreadcrumbs from "@mui/material/Breadcrumbs";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";

import useActualCallback from "../../hooks/useActualCallback";

import ActionMenu from "../ActionMenu";
import Async from "../Async";

import classNames from "../../utils/classNames";

import IBreadcrumbs2Action from "./model/IBreadcrumbs2Action";
import IBreadcrumbs2Option from "./model/IBreadcrumbs2Option";
import Breadcrumbs2Type from "./model/Breadcrumbs2Type";

const Loader = () => <CircularProgress size={20} />;
const Fragment = () => <></>;

interface IBreadcrumbs2Props<T extends any = any> {
  onAction?: (action: string) => void;
  actions?: IBreadcrumbs2Action<T>[];
  items: IBreadcrumbs2Option<T>[];
  payload?: T;
  BeforeMenuContent?: React.ComponentType<any>;
  AfterMenuContent?: React.ComponentType<any>;
}

const useStyles = makeStyles()((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
    justifyContent: "stretch",
    flexDirection: "row",
    paddingTop: "10px",
    paddingBottom: "10px",
    '& > *:nth-of-type(n + 1)': {
      marginLeft: theme.spacing(1),
    },
  },
  link: {
    cursor: 'pointer',
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

export const Breadcrumbs2 = <T extends any = any>({
  onAction = () => undefined,
  items,
  actions,
  payload,
  BeforeMenuContent,
  AfterMenuContent,
}: IBreadcrumbs2Props<T>) => {
  const { classes } = useStyles();

  const onAction$ = useActualCallback(onAction);

  return (
    <Box className={classes.root}>
      <Box className={classes.stretch}>
        <Async payload={payload} Loader={Loader}>
          {async () => {
            const itemList = await Promise.all(
              items
                .filter(({ type }) => type === Breadcrumbs2Type.Link)
                .map(
                  async ({
                    action,
                    label,
                    isDisabled = () => false,
                    isVisible = () => true,
                  }) => ({
                    visible: await isVisible(payload!),
                    disabled: await isDisabled(payload!),
                    action,
                    label,
                  })
                )
            );
            return (
              <MatBreadcrumbs className={classes.stretch}>
                {itemList
                  .filter(({ visible }) => visible)
                  .map(({ action, label, disabled }, idx) => (
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
                    >
                      {label}
                    </Link>
                  ))}
              </MatBreadcrumbs>
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
                  }) => ({
                    visible: await isVisible(payload!),
                    disabled: await isDisabled(payload!),
                    icon,
                    action,
                    label,
                  })
                )
            );
            return (
              <>
                {itemList
                  .filter(({ visible }) => visible)
                  .map(({ action, label, disabled, icon: Icon }, idx) => (
                    <Button
                      key={`${action}-${idx}`}
                      variant="contained"
                      startIcon={Icon && <Icon />}
                      disabled={disabled}
                      onClick={() => onAction$(action)}
                    >
                      {label}
                    </Button>
                  ))}
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
          onAction={onAction}
          BeforeContent={BeforeMenuContent}
          AfterContent={AfterMenuContent}
        />
      )}
    </Box>
  );
};

export default Breadcrumbs2;
