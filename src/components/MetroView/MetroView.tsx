import * as React from "react";
import { useMemo } from "react";

import { lighten } from "@mui/material";

import One from "../One";

import ButtonBase from "@mui/material/ButtonBase";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";

import useActualCallback from "../../hooks/useActualCallback";
import useSingleton from "../../hooks/useSingleton";

import FieldType from "../../model/FieldType";
import TypedField from "../../model/TypedField";
import IMetroRoute from "./model/IMetroRoute";
import IMetroGroup from "./model/IMetroGroup";
import IAnything from "../../model/IAnything";

const NAVIGATE_CALLBACK = Symbol("navigate-callback");

const createButton = (
  to: string,
  label: React.ReactNode,
  Icon?: React.ComponentType
): TypedField => ({
  type: FieldType.Component,
  desktopColumns: "6",
  tabletColumns: "12",
  phoneColumns: "12",
  fieldRightMargin: "1",
  fieldBottomMargin: "1",
  element: ({ payload }) => (
    <Paper
      component={ButtonBase}
      onClick={() => {
        payload[NAVIGATE_CALLBACK](to, payload);
      }}
      sx={{
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'stretch',
        width: "100%",
        background: (theme) => theme.palette.primary.main,
        color: "white",
        fontWeight: "bold",
        fontSize: "18px",
        height: "75px",
        minHeight: "125px",
        textWrap: "wrap",
        padding: "16px",
        "&:hover": {
          background: (theme) => lighten(theme.palette.primary.main, 0.23),
        },
        '& > *:nth-of-type(1)': {
            flex: 1,
        },
        transition: "background 500ms",
      }}
    >
      <Stack direction="row" alignItems="center">
        {Icon && <Icon />}
        <Typography textAlign="center">{label}</Typography>
        <Box flex={1} />
      </Stack>
    </Paper>
  ),
});

const createGroup = (label: string, routes: IMetroRoute[]): TypedField => ({
  type: FieldType.Group,
  sx: {
    p: 2,
  },
  desktopColumns: "6",
  tabletColumns: "6",
  phoneColumns: "12",
  fields: [
    {
      type: FieldType.Typography,
      style: {
        whiteSpace: "nowrap",
        minWidth: "195px",
        overflow: "hidden",
        textOverflow: "ellipsis",
      },
      typoVariant: "h6",
      placeholder: label,
    },
    {
      type: FieldType.Group,
      fields: routes.map(({ label, to, icon }) =>
        createButton(to, label, icon)
      ),
    },
  ],
});

const createTitle = (title: string): TypedField => ({
  type: FieldType.Component,
  element: () => (
    <Stack direction="row" alignItems="center" gap={3} sx={{ mt: 3, mb: 3 }}>
      <Typography variant="h4" fontWeight="bold" sx={{ opacity: 0.5 }}>
        {title}
      </Typography>
      <Divider sx={{ flex: 1 }} orientation="horizontal" />
    </Stack>
  ),
});

interface IMetroViewProps<Payload = IAnything> {
  routes: IMetroGroup[];
  payload: Payload | (() => Payload);
  onNavigate?: (to: string, payload: Payload) => void;
}

export const MetroView = <Payload extends object = IAnything>({
  routes,
  payload: upperPayload = {} as Payload,
  onNavigate = () => undefined,
}: IMetroViewProps<Payload>) => {
  const payload = useSingleton(upperPayload);

  const fields = useMemo(() => {
    return routes.map(({ label, routes }) =>
      routes ? createGroup(label, routes) : createTitle(label)
    );
  }, []);

  const onNavigate$ = useActualCallback(onNavigate);

  return (
    <One
      fields={fields}
      payload={() => ({
        [NAVIGATE_CALLBACK]: onNavigate$,
        ...payload,
      })}
    />
  );
};

export default MetroView;
