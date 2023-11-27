import * as React from "react";
import { useMemo, useCallback } from "react";

import { makeStyles } from '../../../styles';

import Box from "@mui/material/Box";

import { useOneState } from "../context/StateProvider";
import { useOnePayload } from "../context/PayloadProvider";

import deepClone from "../../../utils/deepClone";
import classNames from "../../../utils/classNames";

import IField from "../../../model/IField";
import IEntity from "../../../model/IEntity";
import IAnything from "../../../model/IAnything";
import IManaged, { IWrappedLayout, PickProp } from "../../../model/IManaged";

import makeLayout from "../components/makeLayout/makeLayout";

export interface ICustomLayoutProps<Data = IAnything, Payload = IAnything>
  extends IWrappedLayout<Data, Payload> {
  className?: PickProp<IField<Data, Payload>, "className">;
  style?: PickProp<IField<Data, Payload>, "style">;
  sx?: PickProp<IField<Data, Payload>, "sx">;
  customLayout?: PickProp<IField<Data, Payload>, "customLayout">;
  hidden?: PickProp<IField<Data, Payload>, 'hidden'>;
}

type FieldIgnoreParam = keyof Omit<IManaged, keyof IField> | "readonly";

const FIELD_INTERNAL_PARAMS: FieldIgnoreParam[] = [
  "dirty",
  "fallback",
  "readonly",
  "invalid",
  "loading",
  "object",
  "onChange",
  "prefix",
  "value",
];

interface ICustomLayoutPrivate<Data = IAnything> extends IEntity<Data> {
  children?: React.ReactNode;
}

const useStyles = makeStyles()({
    root: {
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'stretch',
        '& > *': {
            flex: 1,
        },
    },
});

const Fragment = ({ children }: React.PropsWithChildren<{}>) => <>{children}</>;

export const CustomLayout = <Data extends IAnything = IAnything>({
  children,
  className,
  style,
  sx,
  customLayout: CustomLayout = Fragment,
  ...otherProps
}: ICustomLayoutProps<Data> & ICustomLayoutPrivate<Data>) => {
  const { classes } = useStyles();
  const { object, setObject } = useOneState<any>();
  const _payload = useOnePayload();

  const handleChange = useCallback(
    (object: unknown) => setObject(deepClone(object), {}),
    []
  );

  const props = useMemo(() => {
    const _fieldParams = Object.entries(otherProps as IField)
      .filter(
        ([key]) => !FIELD_INTERNAL_PARAMS.includes(key as FieldIgnoreParam)
      )
      .reduce((acm, [key, value]) => ({ ...acm, [key]: value }), {}) as IField;
    const onChange = (data: Record<string, any>) =>
      handleChange({ ...object, ...data });
    const _fieldData = object;
    return {
      ...object,
      onChange,
      _fieldParams,
      _fieldData,
      _payload,
    };
  }, [object]);

  return (
    <Box className={classNames(className, classes.root)} style={style} sx={sx}>
        <CustomLayout {...props}>
            {children}
        </CustomLayout>
    </Box>
  );
};

CustomLayout.displayName = "CustomLayout";

export default makeLayout(CustomLayout) as typeof CustomLayout;
